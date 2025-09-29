// app/api/billing/reconcile/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, priceIdToPlan, monthlyCredits } from "@/lib/billing";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, stripeCustomerId: true },
    });
    if (!user?.stripeCustomerId) {
        return NextResponse.json({ error: "No Stripe customer on file" }, { status: 400 });
    }

    // Get latest active subscription for the customer
    const subs = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "all",
        limit: 1,
    });
    const sub = subs.data[0];
    if (!sub) {
        // No subscription → set FREE
        await prisma.user.update({
            where: { id: user.id },
            data: { plan: "FREE", credits: 0, stripeSubscriptionId: null, stripePriceId: null },
        });
        return NextResponse.json({ ok: true, plan: "FREE", credits: 0 });
    }

    const item = sub.items?.data?.[0];
    const priceId = item?.price?.id ?? null;
    const plan = priceIdToPlan(priceId);
    const credits = monthlyCredits(plan);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            plan,
            credits,
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId ?? undefined,
        },
    });

    return NextResponse.json({ ok: true, plan, credits });
}