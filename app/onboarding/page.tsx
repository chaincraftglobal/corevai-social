// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostsStore, type BrandInfo, type Platform } from "@/lib/state";

export default function OnboardingPage() {
    const router = useRouter();
    const { setBrand } = usePostsStore();

    // ✅ give tone a valid default; type platforms as Platform[]
    const [form, setForm] = useState<BrandInfo>({
        name: "",
        niche: "",
        tone: "Friendly",
        platforms: [], // Platform[]
    });

    const handleCheckbox = (platform: Platform) => {
        setForm((prev) => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter((p) => p !== platform)
                : [...prev.platforms, platform],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBrand(form);
        router.push("/dashboard");
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-4">Onboarding</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Brand / Business Name</label>
                    <input
                        className="border rounded px-3 py-2 w-full"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>

                {/* Niche */}
                <div>
                    <label className="block text-sm font-medium mb-1">Niche</label>
                    <input
                        className="border rounded px-3 py-2 w-full"
                        value={form.niche}
                        onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
                        required
                    />
                </div>

                {/* Tone */}
                <div>
                    <label className="block text-sm font-medium mb-1">Tone</label>
                    <select
                        className="border rounded px-3 py-2 w-full"
                        value={form.tone}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                tone: e.target.value as BrandInfo["tone"], // ✅ cast to union
                            }))
                        }
                    >
                        <option value="Friendly">Friendly</option>
                        <option value="Professional">Professional</option>
                        <option value="Witty">Witty</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>
                </div>

                {/* Platforms */}
                <div>
                    <label className="block text-sm font-medium mb-1">Platforms</label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {(["LinkedIn", "Twitter", "Instagram", "Facebook"] as Platform[]).map((p) => (
                            <label key={p} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.platforms.includes(p)}
                                    onChange={() => handleCheckbox(p)}
                                />
                                {p}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                    Save & Continue
                </button>
            </form>
        </div>
    );
}