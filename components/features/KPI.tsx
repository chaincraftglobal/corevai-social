export default function KPI({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm text-center">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>
        </div>
    );
}