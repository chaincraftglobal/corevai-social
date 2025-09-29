// app/api/billing/portal/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/billing";

function j(data: unknown, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: { "Cache-Control": "no-store" },
    });
}

export async function POST() {
    try {
        // Basic env checks
        if (!process.env.STRIPE_SECRET_KEY) {
            return j({ error: "Missing STRIPE_SECRET_KEY" }, 500);
        }

        const returnUrl =
            process.env.NEXT_PUBLIC_PORTAL_RETURN_URL ??
            process.env.NEXTAUTH_URL ??
            "http://localhost:3000/pricing";

        // 1) Auth
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return j({ error: "Unauthorized" }, 401);
        }

        // 2) Load user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, email: true, name: true, stripeCustomerId: true },
        });
        if (!user) return j({ error: "Unauthorized" }, 401);

        // 3) Ensure Stripe customer
        let customerId = user.stripeCustomerId ?? undefined;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
                name: user.name ?? undefined,
                metadata: { userId: user.id },
            });
            customerId = customer.id;
            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        // 4) Create billing portal session
        const portal = await stripe.billingPortal.sessions.create({
            customer: customerId!,
            return_url: returnUrl,
        });

        return j({ url: portal.url }, 200);
    } catch (err: any) {
        console.error("POST /api/billing/portal error:", err);
        // expose a short, safe message so the client can show it
        return j({ error: err?.message ?? "Server error" }, 500);
    }
}