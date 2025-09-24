"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/feed", label: "Feed" },
    { href: "/analytics", label: "Analytics" },
    { href: "/planner", label: "Planner" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="w-full border-b bg-white shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-lg text-teal-600">
                    CoreVAI Social
                </Link>

                <div className="flex items-center gap-6">
                    {navLinks.map(({ href, label }) => (
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

                    {!session ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/signup"
                                className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                            >
                                Sign up
                            </Link>
                            <button
                                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                                className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                            >
                                Sign in
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                        >
                            Sign out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}