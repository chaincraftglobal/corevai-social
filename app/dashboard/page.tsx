// app/dashboard/page.tsx
"use client";

import { usePostsStore } from "@/lib/state";
import { demoDrafts } from "@/lib/mockData";
import CalendarBoard from "@/components/features/CalendarBoard";
import KPI from "@/components/features/KPI";

export default function DashboardPage() {
    const { posts, setPosts, approve, approveAll, reset } = usePostsStore(); // added reset
    const draftCount = posts.filter((p) => p.status === "DRAFT").length;
    const scheduledCount = posts.filter((p) => p.status === "SCHEDULED").length;
    const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="mb-6 text-slate-600">
                Generate your 7-day AI social plan. Approve posts to schedule them.
            </p>

            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setPosts(demoDrafts)}
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
                            Reset Demo
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