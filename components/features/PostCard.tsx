/* eslint-disable @next/next/no-img-element */
import type { Platform } from "@/lib/state";

type Props = {
    id: string;
    day: string;
    time?: string; // ✅ recommended posting time
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
    platform: Platform; // ✅ show which network this post targets
    onApprove?: (id: string) => void;

    // ✅ R6
    locked?: boolean;
    onToggleLock?: (id: string) => void;

};

export default function PostCard({
    id,
    day,
    time,
    caption,
    hashtags,
    imageUrl,
    status,
    platform,
    onApprove,
}: Props) {
    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
            {/* Header: Day • Time + Status */}
            <div className="p-2 bg-slate-100 text-xs font-medium flex items-center justify-between">
                <span>
                    {day}
                    {time ? ` • ${time}` : ""}
                </span>
                <span
                    className={`px-2 py-0.5 rounded text-[10px] ${status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700"
                        : status === "SCHEDULED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                >
                    {status}
                </span>
            </div>

            {/* Image */}
            <img src={imageUrl} alt={caption} className="h-32 w-full object-cover" />

            {/* Body */}
            <div className="p-3 flex-1 flex flex-col">
                {/* Platform chip */}
                <div className="mb-2">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {platform}
                    </span>
                </div>

                {/* Caption */}
                <p className="text-sm mb-2">{caption}</p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 mt-auto mb-3">
                    {hashtags.map((tag) => (
                        <span key={tag} className="text-xs text-slate-500">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Approve CTA for drafts */}
                {status === "DRAFT" && onApprove && (
                    <button
                        onClick={() => onApprove(id)}
                        className="mt-auto bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                        Approve
                    </button>
                )}
            </div>
        </div>
    );
}