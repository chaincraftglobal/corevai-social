// app/feed/page.tsx
"use client";

import { usePostsStore } from "@/lib/state";
import FeedList from "@/components/features/FeedList";

export default function FeedPage() {
    const { posts, publishAllNow } = usePostsStore();
    const published = posts.filter((p) => p.status === "PUBLISHED");
    const scheduled = posts.filter((p) => p.status === "SCHEDULED");

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Feed</h1>
            <p className="mb-6 text-slate-600">
                Posts appear here when published. Use “Publish Now” during this milestone.
            </p>


            {scheduled.length > 0 && (
                <button
                    onClick={publishAllNow}
                    className="mb-6 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                    Publish Now ({scheduled.length})
                </button>
            )}

            <FeedList posts={published} />
        </div>
    );
}