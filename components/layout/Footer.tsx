import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-100 text-slate-600 mt-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-6">
                <p className="text-sm">
                    © {new Date().getFullYear()} CoreVAI Social. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm mt-2 md:mt-0">
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}