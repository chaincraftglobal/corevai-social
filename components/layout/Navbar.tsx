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
];

type UsageInfo = {
    credits: number;
    trialEndsAt: string | null;
    plan: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
};

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [usage, setUsage] = useState<UsageInfo | null>(null);

    useEffect(() => {
        let aborted = false;
        async function run() {
            if (!session) {
                setUsage(null);
                return;
            }
            try {
                const res = await fetch("/api/usage", { cache: "no-store" });
                if (!res.ok) throw new Error("usage fetch failed");
                const data = (await res.json()) as UsageInfo;
                if (!aborted) setUsage(data);
            } catch {
                if (!aborted) setUsage(null);
            }
        }
        run();
        return () => { aborted = true; };
    }, [session]);

    const trialDaysLeft: number | null = usage?.trialEndsAt
        ? Math.max(
            0,
            Math.ceil(
                (new Date(usage.trialEndsAt).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
        )
        : null;

    return (
        <nav className="w-full border-b bg-white shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-lg text-teal-600">
                    CoreVAI Social
                </Link>

                <div className="flex items-center gap-6">
                    {session ? (
                        <>
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

                            {usage && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="px-2 py-1 bg-slate-100 rounded">
                                        Credits: {usage.credits ?? 0}
                                    </span>
                                    {trialDaysLeft !== null && trialDaysLeft > 0 && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">
                                            Trial ends in {trialDaysLeft}d
                                        </span>
                                    )}
                                </div>
                            )}

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