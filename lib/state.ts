// lib/state.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Status = "DRAFT" | "SCHEDULED" | "PUBLISHED";

// ✅ New Platform type
export type Platform = "LinkedIn" | "Twitter" | "Instagram" | "Facebook";

export type BrandInfo = {
    name: string;
    niche: string;
    tone: string;
    platforms: Platform[];  // use the Platform union here
};

export type Post = {
    id: string;
    day: string;
    time?: string; // ✅ add this
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: Status;
    platform: Platform;     // use the Platform union here
    publishedAt?: string;
    likes?: number;
    comments?: number;
    impressions?: number;
};

type Store = {
    posts: Post[];
    setPosts: (p: Post[]) => void;
    approve: (id: string) => void;
    approveAll: () => void;
    publishAllNow: () => void;
    reset: () => void;

    brand: BrandInfo | null;
    setBrand: (b: BrandInfo) => void;

    // ✅ NEW
    autoApprove: boolean;
    setAutoApprove: (v: boolean) => void;
};

export const usePostsStore = create<Store>()(
    persist(
        (set, get) => ({
            posts: [],
            setPosts: (p) => set({ posts: p }),
            approve: (id) =>
                set({
                    posts: get().posts.map((p) =>
                        p.id === id ? { ...p, status: "SCHEDULED" } : p
                    ),
                }),
            approveAll: () =>
                set({
                    posts: get().posts.map((p) =>
                        p.status === "DRAFT" ? { ...p, status: "SCHEDULED" } : p
                    ),
                }),
            publishAllNow: () =>
                set({
                    posts: get().posts.map((p) =>
                        p.status === "SCHEDULED"
                            ? {
                                ...p,
                                status: "PUBLISHED",
                                publishedAt: new Date().toISOString(),
                                likes: Math.floor(Math.random() * 500),
                                comments: Math.floor(Math.random() * 100),
                                impressions: Math.floor(Math.random() * 2000),
                            }
                            : p
                    ),
                }),
            reset: () => set({ posts: [] }),

            brand: null,
            setBrand: (b) => set({ brand: b }),
            // ✅ NEW
            autoApprove: false,
            setAutoApprove: (v) => set({ autoApprove: v }),
        }),
        { name: "corevai-posts" }
    )
);