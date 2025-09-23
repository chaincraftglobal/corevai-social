// lib/state.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Status = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export type Post = {
    id: string;
    day: string;
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: Status;
    // ✅ add this:
    publishedAt?: string;
    // metrics
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
                                // ✅ stamp publish time
                                publishedAt: new Date().toISOString(),
                                // demo metrics
                                likes: Math.floor(Math.random() * 500),
                                comments: Math.floor(Math.random() * 100),
                                impressions: Math.floor(Math.random() * 2000),
                            }
                            : p
                    ),
                }),
            reset: () => set({ posts: [] }),
        }),
        { name: "corevai-posts" }
    )
);