"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostsStore, type BrandInfo, type Platform } from "@/lib/state";

// ✅ Strongly-typed list of allowed platforms
const ALL_PLATFORMS: Platform[] = ["LinkedIn", "Twitter", "Instagram", "Facebook"];

export default function OnboardingPage() {
    const { setBrand } = usePostsStore();
    const router = useRouter();

    // ✅ Initialize with Platform[] (not string[])
    const [form, setForm] = useState<BrandInfo>({
        name: "",
        niche: "",
        tone: "",
        platforms: [],            // Platform[]
    });

    const handleChange = (field: keyof BrandInfo, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // ✅ Accept Platform, and return BrandInfo (with Platform[]), so TS is happy
    const handleCheckbox = (platform: Platform) => {
        setForm((prev): BrandInfo => ({
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
        <div className="max-w-lg mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Tell us about your brand</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Name */}
                <div>
                    <label className="block mb-1 font-medium">Brand Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g. ChainCraft Global"
                    />
                </div>

                {/* Niche */}
                <div>
                    <label className="block mb-1 font-medium">Niche</label>
                    <select
                        value={form.niche}
                        onChange={(e) => handleChange("niche", e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select niche</option>
                        <option value="Tech">Tech</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </div>

                {/* Tone */}
                <div>
                    <label className="block mb-1 font-medium">Tone</label>
                    <select
                        value={form.tone}
                        onChange={(e) => handleChange("tone", e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select tone</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Professional">Professional</option>
                        <option value="Witty">Witty</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>
                </div>

                {/* Platforms */}
                <div>
                    <label className="block mb-1 font-medium">Preferred Platforms</label>
                    <div className="flex gap-4 flex-wrap">
                        {ALL_PLATFORMS.map((p) => (
                            <label key={p} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.platforms.includes(p)}
                                    onChange={() => handleCheckbox(p)}  // ✅ p is Platform
                                />
                                {p}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Save & Continue
                </button>
            </form>

            <button
                type="button"
                onClick={() => {
                    const state = usePostsStore.getState();
                    console.log("Brand in store:", state.brand);
                    alert(`Check console → Brand: ${JSON.stringify(state.brand, null, 2)}`);
                }}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                Debug: Log Brand
            </button>
        </div>
    );
}