"use client";

import { useState } from "react";

export default function ManageBillingButton({
    className = "",
    children = "Manage billing",
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        try {
            const res = await fetch("/api/billing/portal", { method: "POST" });
            const text = await res.text();
            let data: any = {};
            try { data = JSON.parse(text); } catch { /* keep raw text */ }

            if (!res.ok || !data?.url) {
                const msg = data?.error || text || `HTTP ${res.status}`;
                alert(`Billing portal error: ${msg}`);
                return;
            }
            window.location.href = data.url;
        } catch (e: any) {
            alert(`Billing portal error: ${e?.message ?? "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`px-4 py-2 rounded border hover:bg-slate-50 ${className}`}
        >
            {loading ? "Opening…" : children}
        </button>
    );
}