"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);

        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") || "");
        const password = String(fd.get("password") || "");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/dashboard",
        });

        if (res?.error) {
            setErr("Invalid email or password");
            setLoading(false);
            return;
        }

        // when redirect=false, we need to trigger redirect manually
        window.location.href = "/dashboard";
    };

    return (
        <div className="max-w-sm mx-auto py-16">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-slate-600 mb-6">
                Sign in to continue to <span className="font-medium">CoreVAI Social</span>.
            </p>

            <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full border rounded px-4 py-2 mb-5"
            >
                Continue with Google
            </button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">or</span>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="border w-full rounded px-3 py-2"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="********"
                    className="border w-full rounded px-3 py-2"
                    required
                />
                {err && <p className="text-sm text-red-600">{err}</p>}
                <button
                    disabled={loading}
                    className="w-full bg-teal-600 text-white rounded px-4 py-2 hover:bg-teal-700 disabled:opacity-50"
                >
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>

            <p className="text-sm text-slate-600 mt-6">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-teal-600 underline">
                    Create one
                </Link>
            </p>
        </div>
    );
}