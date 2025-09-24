"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await signIn("credentials", { email, password, callbackUrl: "/dashboard", redirect: true });
        setLoading(false);
    }

    return (
        <div className="max-w-md mx-auto py-10 space-y-6">
            <h1 className="text-2xl font-bold">Sign in</h1>

            {/* Google Sign-in */}
            <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full border rounded px-4 py-2 hover:bg-slate-50 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .9 8.3 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.2 18.9 13 24 13c3.1 0 6 .9 8.3 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.2 4 9.5 8.4 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 10.1-2 13.7-5.3l-6.3-5.3C29.2 35.9 26.7 37 24 37c-5.1 0-9.4-3.3-11-7.9l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.6-6.6 7.1l6.3 5.3C39.2 37.5 44 31.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
                </svg>
                Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs text-slate-500">or</span>
                <div className="h-px bg-slate-200 flex-1" />
            </div>

            {/* Credentials form */}
            <form onSubmit={onSubmit} className="space-y-4">
                <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
                    value={email} onChange={e => setEmail(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
                    value={password} onChange={e => setPassword(e.target.value)} />
                <button disabled={loading}
                    className="w-full bg-teal-600 text-white rounded px-4 py-2 hover:bg-teal-700 disabled:opacity-50">
                    {loading ? "Signing in…" : "Sign In"}
                </button>
            </form>

            <p className="text-sm text-slate-600">
                New here? <Link href="/signup" className="text-teal-600 underline">Create account</Link>
            </p>
        </div>
    );
}