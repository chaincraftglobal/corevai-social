// lib/billing.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Plan IDs already defined here…
export const PLANS = {
    BRONZE: process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE!,
    SILVER: process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER!,
    GOLD: process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD!,
    DIAMOND: process.env.NEXT_PUBLIC_STRIPE_PRICE_DIAMOND!,
} as const;

export function priceIdToPlan(priceId?: string | null) {
    if (!priceId) return "FREE" as const;
    if (priceId === PLANS.BRONZE) return "BRONZE" as const;
    if (priceId === PLANS.SILVER) return "SILVER" as const;
    if (priceId === PLANS.GOLD) return "GOLD" as const;
    if (priceId === PLANS.DIAMOND) return "DIAMOND" as const;
    return "FREE" as const;
}

export function monthlyCredits(plan: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND") {
    if (plan === "BRONZE") return 100;
    if (plan === "SILVER") return 500;
    if (plan === "GOLD") return 1500;
    if (plan === "DIAMOND") return 999999;
    return 30;
}

/** Create a Stripe Billing Portal session for a given customerId. */
export async function createBillingPortal(customerId: string, returnUrl: string) {
    return stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });
}