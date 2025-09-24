/* eslint-disable @next/next/no-img-element */
import type { Platform } from "@/lib/state";

type Props = {
    id: string;
    day: string;
    time?: string;
    dateISO?: string;                      // ✅ add optional date
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
    platform: Platform;

    locked?: boolean;                      // ✅ add lock flag
    onToggleLock?: (id: string) => void;   // ✅ add handler
    onApprove?: (id: string) => void;
};

export default function PostCard({
    id,
    day,
    time,
    dateISO,          // ✅ properly destructured
    caption,
    hashtags,
    imageUrl,
    status,
    platform,
    locked,           // ✅ properly destructured
    onToggleLock,     // ✅ properly destructured
    onApprove,
}: Props) {
    return (
        <div className={`border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col ${locked ? "ring-2 ring-amber-400" : ""}`}>
            <div className="p-2 bg-slate-100 text-xs font-medium flex items-center justify-between">
                <span>
                    {day}{time ? ` • ${time}` : ""}{dateISO ? ` • ${dateISO}` : ""}
                </span>
                <div className="flex items-center gap-2">
                    {status === "DRAFT" && onToggleLock && (
                        <button
                            type="button"
                            onClick={() => onToggleLock(id)}
                            className={`px-2 py-0.5 rounded text-[10px] ${locked ? "bg-amber-300 text-amber-900" : "bg-slate-200 text-slate-700"}`}
                            title={locked ? "Unlock post" : "Lock post"}
                        >
                            {locked ? "🔒 Locked" : "🔓 Lock"}
                        </button>
                    )}
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
            </div>

            <img src={imageUrl} alt={caption} className="h-32 w-full object-cover" />

            <div className="p-3 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {platform}
                    </span>
                </div>

                <p className="text-sm mb-2">{caption}</p>

                <div className="flex flex-wrap gap-1 mt-auto mb-3">
                    {hashtags.map((tag) => (
                        <span key={tag} className="text-xs text-slate-500">
                            {tag}
                        </span>
                    ))}
                </div>

                {status === "DRAFT" && onApprove && (
                    <button
                        type="button"
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