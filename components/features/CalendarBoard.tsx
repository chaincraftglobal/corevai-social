export default function CalendarBoard() {
    return (
        <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
                <div
                    key={i}
                    className="border rounded-md p-3 text-center bg-slate-50"
                >
                    <p className="font-medium">Day {i + 1}</p>
                    <p className="text-xs text-slate-400">[Post Placeholder]</p>
                </div>
            ))}
        </div>
    );
}