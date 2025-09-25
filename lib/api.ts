import type { BrandInfo, Post } from "@/lib/state";

export async function fetchBrand(): Promise<BrandInfo | null> {
    const res = await fetch("/api/brand", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.brand ?? null;
}

export async function saveBrand(brand: BrandInfo) {
    const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error("Failed to save brand");
    return res.json();
}

export async function fetchPosts(): Promise<Post[]> {
    const res = await fetch("/api/posts", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.posts ?? [];
}

export async function savePosts(posts: Post[]) {
    const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
    });
    if (!res.ok) throw new Error("Failed to save posts");
    return res.json();
}