export default function InsightCard({ text }: { text: string }) {
    return (
        <div className="border rounded-lg p-3 bg-slate-50 text-sm">{text}</div>
    );
}