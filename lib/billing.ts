// lib/billing.ts
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ✅ no apiVersion

export const PLANS = {
    BRONZE: process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE!,
    SILVER: process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER!,
    GOLD: process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD!,
    DIAMOND: process.env.NEXT_PUBLIC_STRIPE_PRICE_DIAMOND!,
} as const;