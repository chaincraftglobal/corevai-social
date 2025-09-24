// lib/state.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Status = "DRAFT" | "SCHEDULED" | "PUBLISHED";
export type Platform = "LinkedIn" | "Twitter" | "Instagram" | "Facebook";

export type BrandInfo = {
    name: string;
    niche: string;
    tone: "Friendly" | "Professional" | "Witty" | "Inspirational";
    platforms: Platform[];
};

export type Post = {
    id: string;
    day: string;
    time?: string;
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: Status;
    platform: Platform;
    publishedAt?: string;
    likes?: number;
    comments?: number;
    impressions?: number;

    // ✅ R6
    locked?: boolean;
};

type Store = {
    // posts flow
    posts: Post[];
    setPosts: (p: Post[]) => void;
    approve: (id: string) => void;
    approveAll: () => void;
    publishAllNow: () => void;
    reset: () => void;

    // brand/onboarding
    brand: BrandInfo | null;
    setBrand: (b: BrandInfo) => void;

    // options
    autoApprove: boolean;
    setAutoApprove: (v: boolean) => void;

    // ✅ R6 actions
    toggleLock: (id: string) => void;
    regenerateUnlocked: (freshDrafts: Post[]) => void;
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

            autoApprove: false,
            setAutoApprove: (v) => set({ autoApprove: v }),

            // ✅ R6
            toggleLock: (id) =>
                set({
                    posts: get().posts.map((p) =>
                        p.id === id ? { ...p, locked: !p.locked } : p
                    ),
                }),
            regenerateUnlocked: (freshDrafts) =>
                set({
                    posts: get().posts.map((p, idx) => {
                        // only replace unlocked DRAFTs
                        if (p.status !== "DRAFT" || p.locked) return p;
                        const repl = freshDrafts[idx % freshDrafts.length] ?? p;
                        return { ...repl, locked: p.locked ?? false };
                    }),
                }),
        }),
        { name: "corevai-posts" }
    )
);