"use client";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="bg-white shadow">
            <nav className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-xl text-teal-600">
                    CoreVAI Social
                </Link>
                <div className="flex gap-6 text-sm font-medium">
                    <Link href="/">Home</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/feed">Feed</Link>
                    <Link href="/analytics">Analytics</Link>
                </div>
            </nav>
        </header>
    );
}