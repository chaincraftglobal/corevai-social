export default function BillingCancelPage() {
    return (
        <div className="max-w-xl mx-auto py-16 text-center">
            <h1 className="text-3xl font-bold mb-3">Payment canceled</h1>
            <p className="text-slate-600 mb-8">
                No worries — your card was not charged.
            </p>
            <a href="/pricing" className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700">
                Back to Pricing
            </a>
        </div>
    );
}
