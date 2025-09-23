// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Post } from "./state"

/**
 * cn → merge Tailwind classes safely (used by shadcn/ui)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helpers for analytics + mock data
 */
export function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0)
}

export function groupBy<T, K extends string | number>(list: T[], key: (x: T) => K) {
  return list.reduce((acc, item) => {
    const k = key(item)
      ; (acc[k] ||= []).push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function bestPost(posts: Post[]) {
  if (!posts.length) return null
  return posts
    .slice()
    .sort(
      (a, b) =>
        ((b.likes ?? 0) + (b.comments ?? 0)) -
        ((a.likes ?? 0) + (a.comments ?? 0))
    )[0]
}

export function seededImg(seed: string, w = 600, h = 400) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
}