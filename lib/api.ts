// lib/api.ts
import type { BrandInfo, Post } from "@/lib/state"

// Small fetch helper
async function j<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init)
    if (!res.ok) {
        let msg = `HTTP ${res.status}`
        try {
            const data = await res.json()
            if (data?.error) msg = data.error
        } catch { }
        throw new Error(msg)
    }
    return res.json() as Promise<T>
}

/* ----------------- BRAND ----------------- */

export async function fetchBrand(): Promise<BrandInfo | null> {
    try {
        const data = await j<{ brand: BrandInfo | null }>("/api/brand", { cache: "no-store" })
        return data.brand ?? null
    } catch {
        return null
    }
}

export async function saveBrand(brand: BrandInfo): Promise<BrandInfo> {
    const data = await j<{ ok: boolean; brand: BrandInfo }>("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
    })
    return data.brand
}

/* ----------------- POSTS ----------------- */

export async function fetchPosts(): Promise<Post[]> {
    try {
        const data = await j<{ posts: Post[] }>("/api/posts", { cache: "no-store" })
        return Array.isArray(data.posts) ? data.posts : []
    } catch {
        return []
    }
}

/** Saves posts with replace-all semantics (matches our API). */
export async function savePosts(posts: Post[]): Promise<{ ok: boolean; created: number }> {
    // API accepts either {posts: [...] } or [...]; we send {posts} for clarity
    return j<{ ok: boolean; created: number }>("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
    })
}

/* ----------------- USAGE / BILLING ----------------- */

export type UsageInfo = {
    credits: number
    trialEndsAt: string | null
    plan: "FREE" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND"
}

export async function fetchUsage(): Promise<UsageInfo> {
    try {
        const data = await j<UsageInfo>("/api/usage", { cache: "no-store" })
        return data
    } catch {
        return { credits: 0, trialEndsAt: null, plan: "FREE" }
    }
}