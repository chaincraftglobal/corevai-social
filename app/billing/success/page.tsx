"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UsageInfo = {
    credits: number;
    trialEndsAt: string | null;
    plan?: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
};

export default function BillingSuccessPage() {
    const [usage, setUsage] = useState<UsageInfo | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/usage", { cache: "no-store" });
                if (!res.ok) throw new Error("usage fetch failed");
                const data = (await res.json()) as UsageInfo;
                if (!cancelled) setUsage(data);
            } catch {
                if (!cancelled) setUsage(null);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="max-w-xl mx-auto py-16 text-center">
            <h1 className="text-3xl font-bold mb-3">🎉 Payment successful</h1>
            <p className="text-slate-600 mb-8">
                Thanks for upgrading! Your subscription is active.
            </p>

            {usage ? (
                <div className="mb-8 space-y-2">
                    <div className="text-lg">
                        Plan: <span className="font-semibold">{usage.plan ?? "FREE"}</span>
                    </div>
                    <div className="text-lg">
                        Credits: <span className="font-semibold">{usage.credits}</span>
                    </div>
                    {usage.trialEndsAt && (
                        <div className="text-sm text-slate-500">
                            Trial ends: {new Date(usage.trialEndsAt).toLocaleDateString()}
                        </div>
                    )}
                </div>
            ) : (
                <div className="mb-8 text-slate-500">Syncing your subscription…</div>
            )}

            <div className="flex justify-center gap-3">
                <Link href="/dashboard" className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700">
                    Go to Dashboard
                </Link>
                <Link href="/pricing" className="px-4 py-2 rounded border">
                    View Plans
                </Link>
            </div>
        </div>
    );
}