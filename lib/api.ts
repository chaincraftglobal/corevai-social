// lib/api.ts
import type { BrandInfo, Post } from "@/lib/state"

/* ----------------- tiny JSON fetch helper ----------------- */
async function j<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init)
    if (!res.ok) {
        // Try to surface API error messages
        try {
            const data = await res.json()
            if (data?.error) throw new Error(data.error)
        } catch {
            /* ignore parse error */
        }
        throw new Error(`HTTP ${res.status}`)
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

/** Replace-all save (matches API semantics). */
export async function savePosts(posts: Post[]): Promise<{ ok: boolean; created: number }> {
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
        return await j<UsageInfo>("/api/usage", { cache: "no-store" })
    } catch {
        return { credits: 0, trialEndsAt: null, plan: "FREE" }
    }
}

/* ----------------- GENERATION (OpenAI-backed) ----------------- */

export type GenerateResult = {
    posts: Post[]
    cost: number
    remaining: number
}

/**
 * Calls /api/generate with the current brand.
 * Throws with the API error message (e.g., "Not enough credits...") if non-OK.
 */
export async function generateRemote(brand: BrandInfo): Promise<GenerateResult> {
    return j<GenerateResult>("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand }),
    })
}