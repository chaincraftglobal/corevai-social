"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const appLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/planner", label: "Planner" },
    { href: "/feed", label: "Feed" },
    { href: "/analytics", label: "Analytics" },
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
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-sm px-3 py-1 border rounded hover:bg-slate-50"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="text-sm px-3 py-1 border rounded hover:bg-slate-50">
                                Sign in
                            </Link>
                            <Link href="/signup" className="text-sm px-3 py-1 border rounded hover:bg-slate-50">
                                Create account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}