"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") || "");
        const email = String(fd.get("email") || "");
        const password = String(fd.get("password") || "");

        const res = await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setErr(j?.error || "Failed to sign up");
            setLoading(false);
            return;
        }

        // auto sign-in after signup
        await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
    };

    return (
        <div className="max-w-sm mx-auto py-16">
            <h1 className="text-2xl font-bold mb-6">Create account</h1>

            <form onSubmit={onSubmit} className="space-y-3">
                <input name="name" placeholder="Your name" className="border w-full rounded px-3 py-2" />
                <input name="email" type="email" required placeholder="email@example.com" className="border w-full rounded px-3 py-2" />
                <input name="password" type="password" required placeholder="********" className="border w-full rounded px-3 py-2" />
                {err && <p className="text-sm text-red-600">{err}</p>}
                <button
                    disabled={loading}
                    className="w-full bg-teal-600 text-white rounded px-4 py-2 hover:bg-teal-700 disabled:opacity-50"
                >
                    {loading ? "Creating…" : "Sign up"}
                </button>
            </form>

            <div className="mt-6">
                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full border rounded px-4 py-2"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}