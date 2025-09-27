// lib/usage.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UsageInfo = {
    credits: number;
    trialEndsAt: string | null;
    plan?: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
};

const USAGE_EVENT = "usage:refetch";

// Allow any part of the app to request a navbar refresh
export function bumpUsageSignal() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(USAGE_EVENT));
    }
}

async function fetchUsageOnce(): Promise<UsageInfo | null> {
    try {
        const res = await fetch("/api/usage", { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as UsageInfo;
    } catch {
        return null;
    }
}

export function useUsage() {
    const [usage, setUsage] = useState<UsageInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<number | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUsageOnce();
            if (data) setUsage(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // initial fetch
        refetch();

        // refetch when tab becomes visible again
        const onVis = () => {
            if (document.visibilityState === "visible") refetch();
        };
        document.addEventListener("visibilitychange", onVis);

        // refetch on our custom signal
        const onSignal = () => refetch();
        window.addEventListener(USAGE_EVENT, onSignal);

        // light polling (every 30s) to keep it fresh
        timerRef.current = window.setInterval(refetch, 30_000);

        return () => {
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener(USAGE_EVENT, onSignal);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [refetch]);

    return { usage, loading, refetch };
}