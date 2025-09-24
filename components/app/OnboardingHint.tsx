"use client";

import Link from "next/link";
import { usePostsStore } from "@/lib/state";

export default function OnboardingHint() {
    const brand = usePostsStore((s) => s.brand);
    if (brand) return null;

    return (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">
            Complete{" "}
            <Link href="/onboarding" className="underline font-medium">
                Onboarding
            </Link>{" "}
            to personalize your plan.
        </div>
    );
}