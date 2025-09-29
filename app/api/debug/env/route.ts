// app/api/debug/env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    const mask = (v?: string | null) =>
        v ? v.slice(0, 6) + "…" + v.slice(-4) : null;

    return NextResponse.json({
        NEXT_PUBLIC_STRIPE_PRICE_BRONZE: mask(process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE),
        NEXT_PUBLIC_STRIPE_PRICE_SILVER: mask(process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER),
        NEXT_PUBLIC_STRIPE_PRICE_GOLD: mask(process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD),
        NEXT_PUBLIC_STRIPE_PRICE_DIAMOND: mask(process.env.NEXT_PUBLIC_STRIPE_PRICE_DIAMOND),
        // Also useful for sanity:
        NODE_ENV: process.env.NODE_ENV,
    });
}