// app/billing/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ManageBillingButton from "@/components/billing/ManageBillingButton";

type ReconcileOk = { plan: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND"; credits: number };

export default function SuccessPage() {
    const [status, setStatus] = useState<ReconcileOk | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [didAuto, setDidAuto] = useState(false);

    async function syncNow() {
        setBusy(true);
        setErr(null);
        try {
            const res = await fetch("/api/billing/reconcile", { method: "POST", cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Sync failed");
            setStatus({ plan: data.plan, credits: data.credits });
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Sync failed");
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        if (!didAuto) {
            setDidAuto(true);
            // Auto-attempt a sync when page loads
            syncNow();
        }
    }, [didAuto]);

    return (
        <div className="max-w-2xl mx-auto py-16 text-center">
            <h1 className="text-3xl font-bold mb-3">🎉 Payment successful</h1>
            <p className="text-slate-600 mb-6">Thanks for upgrading! Your subscription is active.</p>

            <div className="inline-flex flex-col items-center gap-2 mb-4">
                {status ? (
                    <>
                        <div className="text-lg">
                            Plan: <b>{status.plan}</b>
                        </div>
                        <div className="text-lg">
                            Credits: <b>{status.credits}</b>
                        </div>
                    </>
                ) : (
                    <div className="text-slate-500">Syncing your account…</div>
                )}
                {err && <div className="text-red-600 text-sm">{err}</div>}
            </div>

            <div className="mb-8">
                <button
                    onClick={syncNow}
                    disabled={busy}
                    className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                    {busy ? "Refreshing…" : "Refresh Plan & Credits"}
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                <Link href="/dashboard" className="px-4 py-2 rounded border hover:bg-slate-50">
                    Go to Dashboard
                </Link>
                <Link href="/pricing" className="px-4 py-2 rounded border hover:bg-slate-50">
                    View Plans
                </Link>
                <ManageBillingButton />
            </div>
        </div>
    );
}