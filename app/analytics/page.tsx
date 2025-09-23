"use client";

import { usePostsStore } from "@/lib/state";
import KPI from "@/components/features/KPI";
import AnalyticsChart from "@/components/features/AnalyticsChart";
import InsightCard from "@/components/features/InsightCard";
import { deriveInsights, generateOptimizedPlan } from "@/lib/insights";

export default function AnalyticsPage() {
    const { posts, setPosts } = usePostsStore();
    const published = posts.filter(p => p.status === "PUBLISHED");

    const totalLikes = published.reduce((a, b) => a + (b.likes ?? 0), 0);
    const totalComments = published.reduce((a, b) => a + (b.comments ?? 0), 0);
    const totalImpr = published.reduce((a, b) => a + (b.impressions ?? 0), 0);
    const best = published
        .slice()
        .sort((a, b) => ((b.likes ?? 0) + (b.comments ?? 0)) - ((a.likes ?? 0) + (a.comments ?? 0)))[0];

    const chartData = (() => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return days.map(day => {
            const dayPosts = published.filter(p => p.day === day);
            const engagement = dayPosts.reduce((a, b) => a + (b.likes ?? 0) + (b.comments ?? 0), 0);
            return { day: day.slice(0, 3), engagement };
        });
    })();

    const insights = deriveInsights(published);

    const optimize = () => {
        const next = generateOptimizedPlan(published);
        setPosts(next);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Analytics</h1>
            <p className="mb-6 text-slate-600">Performance from your published posts.</p>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KPI label="Impressions" value={totalImpr} />
                <KPI label="Likes" value={totalLikes} />
                <KPI label="Comments" value={totalComments} />
                <KPI
                    label="Best Post"
                    value={best ? (best.likes ?? 0) + (best.comments ?? 0) : 0}
                />
            </div>

            {/* Chart */}
            <div className="mb-6">
                <AnalyticsChart data={chartData} />
            </div>



            {/* Insights */}
            <div className="grid gap-3 mb-8">
                {[
                    `Total impressions: ${insights.totalImpr}`,
                    `Total likes: ${insights.totalLikes}`,
                    `Total comments: ${insights.totalComments}`,
                    insights.best
                        ? `Best post was on ${insights.best.day} → "${insights.best.caption}"`
                        : "No best post yet",
                ].map((t, i) => (
                    <InsightCard key={i} text={t} />
                ))}
            </div>

            {/* Optimize CTA */}
            <button
                onClick={optimize}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                disabled={!published.length}
                title={published.length ? "" : "Publish some posts first"}
            >
                Optimize Next Week
            </button>
            <p className="text-xs text-slate-500 mt-2">
                (Generates a fresh 7-day plan in Dashboard based on this week’s results.)
            </p>
        </div>
    );
}