// app/pricing/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BuyButton from "@/components/billing/BuyButton";

type Usage = {
    credits: number;
    trialEndsAt: string | null;
    plan: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
};

export default function PricingPage() {
    const [usage, setUsage] = useState<Usage | null>(null);

    // read Stripe price Ids from env (exposed at build)
    const BRONZE = process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE ?? "";
    const SILVER = process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER ?? "";
    const GOLD = process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD ?? "";
    const DIAMOND = process.env.NEXT_PUBLIC_STRIPE_PRICE_DIAMOND ?? "";

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const res = await fetch("/api/usage", { cache: "no-store" });
                const data = (await res.json()) as Usage;
                if (!abort) setUsage(data);
            } catch {
                if (!abort) setUsage({ credits: 0, plan: "FREE", trialEndsAt: null });
            }
        })();
        return () => {
            abort = true;
        };
    }, []);

    const currentPlan = usage?.plan ?? "FREE";

    const Card = ({
        title,
        price,
        pid,
    }: {
        title: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
        price: string;
        pid: string; // stripe price id
    }) => {
        const isCurrent = currentPlan === title;
        return (
            <div className="border rounded p-4">
                <h3 className="font-semibold">{title.charAt(0) + title.slice(1).toLowerCase()}</h3>
                <p className="text-2xl">{price}</p>
                <p className="text-sm text-slate-600 mb-4">AI generations included (tiered)</p>

                {pid ? (
                    isCurrent ? (
                        <button className="w-full px-3 py-2 rounded bg-slate-200 text-slate-700 cursor-default">
                            Current plan
                        </button>
                    ) : (
                        <BuyButton priceId={pid} />
                    )
                ) : (
                    <div className="text-xs text-red-600">Missing env price ID</div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Choose your plan</h1>
                <Link href="/billing/success" className="text-sm underline">
                    Sync plan (after portal changes)
                </Link>
            </div>

            <p className="mb-4 text-slate-600">
                Current plan: <b>{currentPlan}</b>
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="BRONZE" price="$9/mo" pid={BRONZE} />
                <Card title="SILVER" price="$29/mo" pid={SILVER} />
                <Card title="GOLD" price="$99/mo" pid={GOLD} />
                <Card title="DIAMOND" price="$199/mo" pid={DIAMOND} />
            </div>
        </div>
    );
}