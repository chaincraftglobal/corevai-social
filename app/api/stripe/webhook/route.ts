import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, priceIdToPlan, monthlyCredits } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const s = event.data.object as any;
                // attach subscription/customer on user
                const subId = s.subscription as string | undefined;
                const customerId = s.customer as string | undefined;
                const priceId = s?.line_items?.data?.[0]?.price?.id || s?.amount_total; // not always available
                // fetch subscription to get items
                if (subId) {
                    const sub = await stripe.subscriptions.retrieve(subId);
                    const item = sub.items.data[0];
                    const priceId = item?.price?.id || null;

                    // find user by customerId
                    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId ?? "" } });
                    if (user) {
                        const plan = priceIdToPlan(priceId);
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                stripeSubscriptionId: subId,
                                stripePriceId: priceId ?? undefined,
                                plan,
                                credits: monthlyCredits(plan), // top up
                            },
                        });
                    }
                }
                break;
            }

            case "customer.subscription.updated":
            case "customer.subscription.created": {
                const sub = event.data.object as any;
                const customerId = sub.customer as string;
                const priceId = sub.items?.data?.[0]?.price?.id as string | undefined;
                const plan = priceIdToPlan(priceId);

                const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            stripeSubscriptionId: sub.id,
                            stripePriceId: priceId ?? undefined,
                            plan,
                            // optional: only top-up on billing cycle start
                        },
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const sub = event.data.object as any;
                const customerId = sub.customer as string;
                const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { plan: "FREE", stripeSubscriptionId: null, stripePriceId: null },
                    });
                }
                break;
            }

            default:
                // ignore others for now
                break;
        }

        return NextResponse.json({ received: true });
    } catch (e) {
        console.error("stripe webhook error", e);
        return NextResponse.json({ error: "webhook_error" }, { status: 500 });
    }
}

// Disable body parsing for this route (not needed in Next 15 app router, but safe to keep in mind)