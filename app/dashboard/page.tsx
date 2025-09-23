"use client";

import { useState } from "react";
import { demoDrafts, DraftPost } from "@/lib/mockData";
import CalendarBoard from "@/components/features/CalendarBoard";

export default function DashboardPage() {
    const [posts, setPosts] = useState<DraftPost[]>([]);

    // Handle Generate Plan
    const generatePlan = () => {
        setPosts(demoDrafts);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="mb-6 text-slate-600">
                Generate your 7-day AI social plan. Posts will appear below.
            </p>

            <button
                onClick={generatePlan}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
            >
                Generate Plan
            </button>

            {/* Calendar Board */}
            <CalendarBoard posts={posts} />
        </div>
    );
}