export default function FeedList() {
    return (
        <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                >
                    <h4 className="font-semibold">Feed Post {i + 1}</h4>
                    <p className="text-sm text-slate-600">[Published caption here]</p>
                </div>
            ))}
        </div>
    );
}