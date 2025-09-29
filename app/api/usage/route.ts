// app/api/usage/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Plan = "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";

type UsagePayload = {
    credits: number;
    trialEndsAt: string | null;
    plan: Plan;
    stripePriceId?: string | null;
};

function json(data: UsagePayload, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return json({ credits: 0, trialEndsAt: null, plan: "FREE", stripePriceId: null });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                credits: true,
                trialEndsAt: true,
                plan: true,
                stripePriceId: true, // ✅ include current Stripe price ID
            },
        });

        if (!user) {
            return json({ credits: 0, trialEndsAt: null, plan: "FREE", stripePriceId: null });
        }

        return json({
            credits: user.credits ?? 0,
            trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
            plan: (user.plan as Plan) || "FREE",
            stripePriceId: user.stripePriceId ?? null,
        });
    } catch (err) {
        console.error("GET /api/usage error", err);
        return json({ credits: 0, trialEndsAt: null, plan: "FREE", stripePriceId: null }, 200);
    }
}