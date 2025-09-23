// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { usePostsStore } from "@/lib/state";
import { generatePlan } from "@/lib/agent";
import CalendarBoard from "@/components/features/CalendarBoard";
import KPI from "@/components/features/KPI";

export default function DashboardPage() {
    const router = useRouter();
    const { posts, setPosts, approve, approveAll, reset, brand } = usePostsStore();

    const draftCount = posts.filter((p) => p.status === "DRAFT").length;
    const scheduledCount = posts.filter((p) => p.status === "SCHEDULED").length;
    const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;

    const handleGenerate = () => {
        if (!brand) {
            router.push("/onboarding"); // 🚀 redirect instead of alert
            return;
        }
        setPosts(generatePlan(brand));
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

            {/* 👇 Show current brand info */}
            <p className="mb-6 text-slate-600">
                {brand ? (
                    <>
                        Current Brand: <span className="font-semibold">{brand.name}</span>{" "}
                        ({brand.platforms.join(", ")}, tone: {brand.tone})
                    </>
                ) : (
                    <>No brand yet —{" "}
                        <button
                            onClick={() => router.push("/onboarding")}
                            className="underline text-blue-600"
                        >
                            create one here
                        </button>.
                    </>
                )}
            </p>

            <div className="flex gap-3 mb-6">
                <button
                    onClick={handleGenerate}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                    Generate Plan
                </button>

                {posts.length > 0 && (
                    <>
                        <button
                            onClick={approveAll}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Approve All
                        </button>
                        <button
                            onClick={reset}
                            className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300"
                        >
                            Reset
                        </button>
                    </>
                )}
            </div>

            {posts.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <KPI label="Drafts" value={draftCount} />
                    <KPI label="Scheduled" value={scheduledCount} />
                    <KPI label="Published" value={publishedCount} />
                </div>
            )}

            <CalendarBoard posts={posts} onApprove={approve} />
        </div>
    );
}