type Props = {
    id: string;
    day: string;
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
    onApprove?: (id: string) => void;
};

export default function PostCard({ id, day, caption, hashtags, imageUrl, status, onApprove }: Props) {
    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
            <div className="p-2 bg-slate-100 text-xs font-medium flex justify-between">
                <span>{day}</span>
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
            <img src={imageUrl} alt={caption} className="h-32 w-full object-cover" />
            <div className="p-3 flex-1 flex flex-col">
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