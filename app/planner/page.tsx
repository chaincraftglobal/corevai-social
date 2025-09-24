"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostsStore, type Post } from "@/lib/state";
import { generatePlanRemote } from "@/lib/agent";
import { startOfNextWeek, formatDateISO, DAY_NAMES } from "@/lib/dates";
import type { Status, Platform } from "@prisma/client";

const CADENCES = [1, 3, 5];
const WEEK_OPTIONS = [2, 3, 4, 5, 6];

export default function PlannerPage() {
    const router = useRouter();
    const { brand, setPosts } = usePostsStore();

    const [cadence, setCadence] = useState<number>(3);
    const [weeks, setWeeks] = useState<number>(4);
    const [loading, setLoading] = useState(false);

    const handlePlan = async () => {
        if (!brand) { router.push("/onboarding"); return; }

        try {
            setLoading(true);

            // Get 7 AI suggestions (caption/hashtags/time/platform). We'll reuse/rotate them.
            const base: Post[] = await generatePlanRemote(brand);

            const start = startOfNextWeek();
            const result: Post[] = []; // ✅ explicit typing
            let ptr = 0;

            for (let w = 0; w < weeks; w++) {
                // choose weekday indices based on cadence
                const slots =
                    cadence === 1 ? [1] :               // Tue
                        cadence === 3 ? [1, 3, 5] :         // Tue/Thu/Sat
                            [1, 2, 3, 4, 5];                    // Mon–Fri

                for (let i = 0; i < slots.length; i++) {
                    const dayOffset = slots[i];

                    const date = new Date(start);
                    date.setDate(start.getDate() + w * 7 + dayOffset);
                    const iso = formatDateISO(date);
                    const dayName = DAY_NAMES[date.getDay()];

                    const s = base[ptr % base.length];
                    ptr++;

                    // Ensure platform is a Prisma enum (fallback LinkedIn)
                    const platform: Platform = (s.platform ?? "LinkedIn") as Platform;

                    result.push({
                        id: `plan-${w}-${i}-${Date.now()}`,
                        day: dayName,
                        dateISO: iso,                 // ✅ real calendar date
                        time: s.time,                 // optional
                        caption: s.caption,
                        hashtags: s.hashtags,
                        imageUrl: s.imageUrl,
                        status: "DRAFT" as Status,    // ✅ enum literal
                        platform,                     // ✅ enum
                        locked: false,
                    });
                }
            }

            setPosts(result);
            router.push("/dashboard");
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to build plan");
        } finally {
            setLoading(false);
        }
    };

    const nextMonday = formatDateISO(startOfNextWeek());

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-4">Planner</h1>
            <p className="text-slate-600 mb-6">
                Plan posts with real dates. Starts next Monday:{" "}
                <span className="font-medium">{nextMonday}</span>.
            </p>

            <div className="space-y-5">
                <div>
                    <label className="block mb-1 font-medium">Cadence (posts/week)</label>
                    <select
                        value={cadence}
                        onChange={(e) => setCadence(Number(e.target.value))}
                        className="border rounded px-3 py-2 w-full"
                    >
                        {CADENCES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Weeks</label>
                    <select
                        value={weeks}
                        onChange={(e) => setWeeks(Number(e.target.value))}
                        className="border rounded px-3 py-2 w-full"
                    >
                        {WEEK_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>

                <button
                    onClick={handlePlan}
                    disabled={loading}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                >
                    {loading ? "Generating…" : "Generate Monthly Plan"}
                </button>
            </div>
        </div>
    );
}