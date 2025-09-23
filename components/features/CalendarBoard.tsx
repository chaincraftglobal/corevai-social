// components/features/CalendarBoard.tsx
import PostCard from "./PostCard";
import type { Post } from "@/lib/state";

export default function CalendarBoard({
    posts,
    onApprove,
}: {
    posts: Post[];
    onApprove?: (id: string) => void;
}) {
    if (!posts.length) {
        return (
            <div className="text-center text-slate-500 py-10">
                No drafts yet. Click “Generate Plan” to create your week.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {posts.map((post) => (
                <PostCard key={post.id} {...post} onApprove={onApprove} />
            ))}
        </div>
    );
}