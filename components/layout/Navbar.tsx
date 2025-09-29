// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const appLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/planner", label: "Planner" },
    { href: "/feed", label: "Feed" },
    { href: "/analytics", label: "Analytics" },
    { href: "/pricing", label: "Pricing" },
];

type Plan = "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";

type UsageInfo = {
    credits: number;
    trialEndsAt: string | null;
    plan: Plan;
};

function planClasses(plan: Plan) {
    // subtle colors per tier
    switch (plan) {
        case "BRONZE":
            return "bg-amber-100 text-amber-800";
        case "SILVER":
            return "bg-slate-200 text-slate-800";
        case "GOLD":
            return "bg-yellow-100 text-yellow-800";
        case "DIAMOND":
            return "bg-indigo-100 text-indigo-800";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [usage, setUsage] = useState<UsageInfo | null>(null);
    const [loadingUsage, setLoadingUsage] = useState(false);

    async function loadUsage() {
        if (!session) { setUsage(null); return; }
        try {
            setLoadingUsage(true);
            const res = await fetch("/api/usage", { cache: "no-store" });
            const data = (await res.json()) as UsageInfo | { credits?: number; plan?: string; trialEndsAt?: string | null };
            // normalize
            setUsage({
                credits: typeof data.credits === "number" ? data.credits : 0,
                plan: (data as any).plan ?? "FREE",
                trialEndsAt: (data as any).trialEndsAt ?? null,
            });
        } catch {
            setUsage(null);
        } finally {
            setLoadingUsage(false);
        }
    }

    useEffect(() => { loadUsage(); /* eslint-disable-next-line */ }, [session]);

    const trialDaysLeft: number | null =
        usage?.trialEndsAt
            ? Math.max(0, Math.ceil((new Date(usage.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : null;

    return (
        <nav className="w-full border-b bg-white shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-lg text-teal-600">
                    CoreVAI Social
                </Link>

                <div className="flex items-center gap-6">
                    {appLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "text-sm font-medium hover:text-teal-600",
                                pathname.startsWith(href)
                                    ? "text-teal-600 border-b-2 border-teal-600 pb-1"
                                    : "text-slate-600"
                            )}
                        >
                            {label}
                        </Link>
                    ))}

                    {session ? (
                        <>
                            {/* Plan + Credits pill cluster */}
                            <div className="flex items-center gap-2">
                                {usage && (
                                    <>
                                        <Link
                                            href="/pricing"
                                            className={cn(
                                                "text-xs px-2 py-1 rounded border",
                                                planClasses(usage.plan as Plan)
                                            )}
                                            title="Manage plan"
                                        >
                                            Plan: {usage.plan}
                                        </Link>

                                        <span className="text-xs px-2 py-1 rounded border bg-slate-50 text-slate-700">
                                            Credits: {usage.credits}
                                        </span>

                                        {trialDaysLeft !== null && trialDaysLeft > 0 && (
                                            <span className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-800 border">
                                                Trial: {trialDaysLeft}d left
                                            </span>
                                        )}

                                        <button
                                            onClick={loadUsage}
                                            disabled={loadingUsage}
                                            className="text-xs px-2 py-1 rounded border hover:bg-slate-50 disabled:opacity-50"
                                            title="Refresh credits/plan"
                                        >
                                            {loadingUsage ? "Refreshing…" : "Refresh"}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                                className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                            >
                                Sign in
                            </button>
                            <Link
                                href="/signup"
                                className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                            >
                                Create account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}