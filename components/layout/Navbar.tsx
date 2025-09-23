"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/feed", label: "Feed" },
    { href: "/analytics", label: "Analytics" },
]

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="w-full border-b bg-white shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-lg text-teal-600">
                    CoreVAI Social
                </Link>

                <div className="flex gap-6">
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
                </div>
            </div>
        </nav>
    )
}