// app/api/billing/webhook/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, priceIdToPlan, monthlyCredits } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

// Helper: apply subscription data to a user
async function applySubscriptionToUser(opts: {
    customerId: string;
    subscriptionId: string | null;
    priceId: string | null;
}) {
    const { customerId, subscriptionId, priceId } = opts;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
        select: { id: true },
    });
    if (!user) return;

    const plan = priceIdToPlan(priceId);
    const credits = monthlyCredits(plan);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            plan,
            credits,
            stripeSubscriptionId: subscriptionId ?? undefined,
            stripePriceId: priceId ?? undefined,
        },
    });
}

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature");
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json(
            { error: "Missing signature or secret" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;
    try {
        const rawBody = await req.text();
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const customerId = (session.customer as string) ?? null;
                const subscriptionId = (session.subscription as string) ?? null;

                if (!customerId) break;

                let priceId: string | null = null;
                if (subscriptionId) {
                    const sub = await stripe.subscriptions.retrieve(subscriptionId);
                    priceId = sub.items?.data?.[0]?.price?.id ?? null;

                    await applySubscriptionToUser({
                        customerId,
                        subscriptionId,
                        priceId,
                    });
                }
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const sub = event.data.object as Stripe.Subscription;
                const customerId = (sub.customer as string) ?? null;
                if (!customerId) break;

                const item = sub.items?.data?.[0];
                const priceId = item?.price?.id ?? null;

                await applySubscriptionToUser({
                    customerId,
                    subscriptionId: sub.id,
                    priceId,
                });
                break;
            }

            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;

                const customerId =
                    (typeof invoice.customer === "string"
                        ? invoice.customer
                        : (invoice.customer as any)?.id) ?? null;

                const subscriptionId =
                    (typeof (invoice as any).subscription === "string"
                        ? (invoice as any).subscription
                        : (invoice as any).subscription?.id) ?? null;

                if (!customerId || !subscriptionId) break;

                const sub = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = sub.items?.data?.[0]?.price?.id ?? null;

                await applySubscriptionToUser({
                    customerId,
                    subscriptionId,
                    priceId,
                });
                break;
            }

            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription;
                const customerId = (sub.customer as string) ?? null;
                if (!customerId) break;

                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                    select: { id: true },
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            plan: "FREE",
                            credits: 0,
                            stripeSubscriptionId: null,
                            stripePriceId: null,
                        },
                    });
                }
                break;
            }

            default:
                // console.log(`Unhandled event type ${event.type}`);
                break;
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("Webhook handler error", err);
        return NextResponse.json(
            { error: "Webhook handler error" },
            { status: 500 }
        );
    }
}