// app/api/billing/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PLANS } from "@/lib/billing";

export const runtime = "nodejs";

type Body = string | { priceId?: string } | null;

export async function POST(req: Request) {
    // 1) Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Get priceId (accept raw string or { priceId })
    let body: Body = null;
    try { body = await req.json(); } catch { }
    const priceId =
        typeof body === "string" ? body :
            (body && typeof body === "object" ? body.priceId : undefined);

    if (!priceId) {
        return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // 3) Validate priceId is one of our env IDs
    const allowed = new Set(Object.values(PLANS).filter(Boolean));
    if (!allowed.has(priceId)) {
        return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    // 4) Load user / ensure Stripe customer
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, name: true, stripeCustomerId: true },
    });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let customerId = user.stripeCustomerId ?? undefined;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            metadata: { userId: user.id }, // used by webhook to find user
        });
        customerId = customer.id;
        await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customerId },
        });
    }

    // 5) Create Checkout session
    const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL!,
        cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL!,
        allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkout.url }, { status: 200 });
}