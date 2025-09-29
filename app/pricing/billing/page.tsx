"use client";

export default function BillingSettingsPage() {
    async function openPortal() {
        const res = await fetch("/api/billing/portal", { method: "POST" });
        const data = await res.json();
        if (!res.ok) return alert(data?.error || "Portal failed");
        window.location.href = data.url;
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Billing</h1>
            <p className="text-slate-600 mb-6">Manage your subscription, payment method, and invoices.</p>
            <button onClick={openPortal} className="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-900">
                Open Billing Portal
            </button>
        </div>
    );
}