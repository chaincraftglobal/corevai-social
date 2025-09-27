import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// ⬆️ removed apiVersion to avoid literal type mismatch

export const PLANS = {
    BRONZE: process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE || "",
    SILVER: process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER || "",
    GOLD: process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD || "",
    DIAMOND: process.env.NEXT_PUBLIC_STRIPE_PRICE_DIAMOND || "",
} as const;

export function priceIdToPlan(priceId?: string | null) {
    if (!priceId) return "FREE" as const;
    if (priceId === PLANS.BRONZE) return "BRONZE" as const;
    if (priceId === PLANS.SILVER) return "SILVER" as const;
    if (priceId === PLANS.GOLD) return "GOLD" as const;
    if (priceId === PLANS.DIAMOND) return "DIAMOND" as const;
    return "FREE" as const;
}

export function monthlyCredits(
    plan: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND"
) {
    switch (plan) {
        case "BRONZE": return 100;
        case "SILVER": return 500;
        case "GOLD": return 1500;
        case "DIAMOND": return 999999;
        default: return 30;
    }
}