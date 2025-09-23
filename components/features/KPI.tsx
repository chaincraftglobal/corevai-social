export default function KPI({ label, value }: { label: string; value: number }) {
    return (
        <div className="border rounded-md p-4 bg-white shadow-sm text-center">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    );
}