import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full border-t bg-slate-50 mt-12">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                <p>© {new Date().getFullYear()} CoreVAI Social. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                </div>
            </div>
        </footer>
    )
}