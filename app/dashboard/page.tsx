"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePostsStore } from "@/lib/state";
import { generatePlanRemote } from "@/lib/agent";
import CalendarBoard from "@/components/features/CalendarBoard";
import KPI from "@/components/features/KPI";
import OnboardingHint from "@/components/app/OnboardingHint";
import { fetchBrand, fetchPosts, saveBrand, savePosts } from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const {
        posts, setPosts, approve, approveAll, reset, brand, setBrand,
        autoApprove, setAutoApprove,
        toggleLock, regenerateUnlocked,
    } = usePostsStore();

    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false); // avoid flicker

    const draftCount = posts.filter((p) => p.status === "DRAFT").length;
    const scheduledCount = posts.filter((p) => p.status === "SCHEDULED").length;
    const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;

    // 🔄 Initial hydrate from DB (if logged in)
    useEffect(() => {
        (async () => {
            try {
                // hydrate brand if missing
                if (!brand) {
                    const b = await fetchBrand();
                    if (b) setBrand(b);
                }
                // hydrate posts
                const fromDb = await fetchPosts();
                if (fromDb.length > 0) setPosts(fromDb);
            } catch {
                // ignore; demo still works offline
            } finally {
                setHydrated(true);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGenerate = async () => {
        if (!brand) { router.push("/onboarding"); return; }
        try {
            setLoading(true);
            const plan = await generatePlanRemote(brand);
            setPosts(plan.map((p) => ({ ...p, locked: false })));
            if (autoApprove) queueMicrotask(() => approveAll());
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to generate posts");
        } finally {
            setLoading(false);
        }
    };

    const handleRegenUnlocked = async () => {
        if (!brand) { router.push("/onboarding"); return; }
        try {
            setLoading(true);
            const fresh = await generatePlanRemote(brand);
            regenerateUnlocked(fresh);
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to regenerate");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCloud = async () => {
        try {
            setLoading(true);
            if (brand) await saveBrand(brand);
            await savePosts(posts);
            alert("Saved to cloud ✅");
        } catch (e: any) {
            alert(e?.message ?? "Save failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

            {/* Show onboarding banner if brand not set */}
            <OnboardingHint />

            <p className="mb-4 text-slate-600">
                {brand ? (
                    <>Current Brand: <span className="font-semibold">{brand.name}</span> ({brand.platforms.join(", ")}, tone: {brand.tone})</>
                ) : (
                    <>No brand yet — <button onClick={() => router.push("/onboarding")} className="underline text-blue-600">create one here</button>.</>
                )}
            </p>

            <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} />
                    Auto-approve after generation
                </label>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <button onClick={handleGenerate} disabled={loading} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50">
                    {loading ? "Generating…" : "Generate Plan"}
                </button>

                <button onClick={handleRegenUnlocked} disabled={loading || posts.length === 0} className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 disabled:opacity-50">
                    {loading ? "Regenerating…" : "Regenerate Unlocked"}
                </button>

                {posts.length > 0 && (
                    <>
                        <button onClick={approveAll} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Approve All
                        </button>
                        <button onClick={reset} className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300">
                            Reset
                        </button>
                        <button onClick={handleSaveCloud} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50">
                            {loading ? "Saving…" : "Save to Cloud"}
                        </button>
                    </>
                )}
            </div>

            {/* Avoid flicker on first load */}
            {hydrated && posts.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <KPI label="Drafts" value={draftCount} />
                    <KPI label="Scheduled" value={scheduledCount} />
                    <KPI label="Published" value={publishedCount} />
                </div>
            )}

            <CalendarBoard posts={posts} onApprove={approve} onToggleLock={toggleLock} />
        </div>
    );
}