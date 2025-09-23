// components/features/FeedList.tsx
import { Post } from "@/lib/state";

export default function FeedList({ posts }: { posts: Post[] }) {
    if (!posts.length) {
        return (
            <div className="text-slate-500 py-10 text-center">
                No published posts yet. Approve and publish to see them here.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {posts
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.publishedAt || 0).getTime() -
                        new Date(a.publishedAt || 0).getTime()
                )
                .map((p) => (
                    <article
                        key={p.id}
                        className="border rounded-lg bg-white shadow-sm overflow-hidden"
                    >
                        <div className="px-4 py-2 text-xs text-slate-500 flex justify-between">
                            <span>{p.platform || "LinkedIn (Demo)"}</span>
                            <span>
                                {p.publishedAt
                                    ? new Date(p.publishedAt).toLocaleString()
                                    : "—"}
                            </span>
                        </div>
                        <img
                            src={p.imageUrl}
                            alt={p.caption}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <p className="mb-2">{p.caption}</p>
                            <div className="text-xs text-slate-500 mb-3">
                                {p.hashtags.map((t) => ` ${t}`).join(" ")}
                            </div>
                            <div className="text-sm text-slate-600 flex gap-6">
                                <span>❤️ {p.likes ?? 0}</span>
                                <span>💬 {p.comments ?? 0}</span>
                                <span>👀 {p.impressions ?? 0}</span>
                            </div>
                        </div>
                    </article>
                ))}
        </div>
    );
}