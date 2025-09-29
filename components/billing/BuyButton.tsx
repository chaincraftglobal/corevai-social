// components/billing/BuyButton.tsx
"use client";

import { useState } from "react";

type Props = {
    priceId: string;
    disabled?: boolean;
    children?: React.ReactNode;
};

export default function BuyButton({ priceId, disabled, children }: Props) {
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        if (!priceId || disabled) return;
        try {
            setLoading(true);
            const res = await fetch("/api/billing/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Send as JSON consistently to avoid “Unexpected end of JSON input”
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.url) {
                const msg = data?.error || `Checkout failed (HTTP ${res.status})`;
                alert(msg);
                return;
            }
            window.location.href = data.url as string;
        } catch (e: any) {
            alert(e?.message ?? "Failed to start checkout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuy}
            disabled={disabled || !priceId || loading}
            className="mt-auto px-3 py-2 rounded bg-teal-600 text-white disabled:opacity-50 hover:bg-teal-700"
        >
            {loading ? "Redirecting…" : children ?? "Buy with Stripe"}
        </button>
    );
}