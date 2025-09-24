// lib/state.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
    dateISO?: string;
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: Status;
    platform: Platform;
    publishedAt?: string;
    likes?: number;
    comments?: number;
    impressions?: number;
    locked?: boolean; // R6
};

type Store = {
    // posts flow
    posts: Post[];
    setPosts: (p: Post[]) => void;
    approve: (id: string) => void;
    approveAll: () => void;
    publishAllNow: () => void;
    setStatus: (id: string, s: Status) => void;
    clearPublished: () => void;
    reset: () => void;

    // brand/onboarding
    brand: BrandInfo | null;
    setBrand: (b: BrandInfo) => void;

    // options
    autoApprove: boolean;
    setAutoApprove: (v: boolean) => void;

    // R6 actions
    toggleLock: (id: string) => void;
    regenerateUnlocked: (freshDrafts: Post[]) => void;
};

const STORE_VERSION = 2;

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

            setStatus: (id, s) =>
                set({
                    posts: get().posts.map((p) => (p.id === id ? { ...p, status: s } : p)),
                }),

            clearPublished: () =>
                set({
                    posts: get().posts.filter((p) => p.status !== "PUBLISHED"),
                }),

            reset: () => set({ posts: [] }),

            brand: null,
            setBrand: (b) => set({ brand: b }),

            autoApprove: false,
            setAutoApprove: (v) => set({ autoApprove: v }),

            toggleLock: (id) =>
                set({
                    posts: get().posts.map((p) =>
                        p.id === id ? { ...p, locked: !p.locked } : p
                    ),
                }),

            // safer: rotate through fresh drafts independently of current index
            regenerateUnlocked: (freshDrafts) =>
                set(() => {
                    if (!freshDrafts.length) return {};
                    let ptr = 0;
                    const next = () => freshDrafts[(ptr++ % freshDrafts.length + freshDrafts.length) % freshDrafts.length];

                    return {
                        posts: get().posts.map((p) => {
                            if (p.status !== "DRAFT" || p.locked) return p;
                            const repl = next();
                            // preserve id/locked if you prefer; here we fully replace content but keep lock flag
                            return { ...repl, id: p.id, locked: p.locked ?? false };
                        }),
                    };
                }),
        }),
        {
            name: "corevai-posts",
            version: STORE_VERSION,
            storage: createJSONStorage(() => localStorage),
            migrate: (persisted: any, version) => {
                // simple example: ensure 'locked' exists on drafts after upgrade
                if (version < 2 && persisted?.state?.posts) {
                    persisted.state.posts = persisted.state.posts.map((p: Post) => ({
                        locked: false,
                        ...p,
                    }));
                }
                return persisted?.state ?? persisted;
            },
            // partialize: only persist what you want
            // partialize: (s) => ({ posts: s.posts, brand: s.brand, autoApprove: s.autoApprove }),
        }
    )
);