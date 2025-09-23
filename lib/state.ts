// lib/state.ts
"use client";

import { create } from "zustand";

export type Status = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export type Post = {
    id: string;
    day: string;
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: Status;
    publishedAt?: string;
    platform?: string;
    likes?: number;
    comments?: number;
    impressions?: number;
};

type Store = {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    approve: (id: string) => void;
    approveAll: () => void;
    publishAllNow: () => void;
};

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const usePostsStore = create<Store>((set, get) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    approve: (id) =>
        set({
            posts: get().posts.map((p) =>
                p.id === id ? { ...p, status: "SCHEDULED" } : p
            ),
        }),
    approveAll: () =>
        set({
            posts: get().posts.map((p) => ({ ...p, status: "SCHEDULED" })),
        }),
    publishAllNow: () =>
        set({
            posts: get().posts.map((p) =>
                p.status === "SCHEDULED"
                    ? {
                        ...p,
                        status: "PUBLISHED",
                        publishedAt: new Date().toISOString(),
                        platform: "LinkedIn (Demo)",
                        likes: randomBetween(50, 500),
                        comments: randomBetween(0, 50),
                        impressions: randomBetween(1000, 8000),
                    }
                    : p
            ),
        }),
}));