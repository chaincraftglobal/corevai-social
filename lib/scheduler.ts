// lib/scheduler.ts
import type { Platform } from "./state";

const WINDOWS: Record<Platform, string[]> = {
    LinkedIn: ["09:00", "13:00", "18:00"],
    Twitter: ["10:00", "15:00", "20:00"],
    Instagram: ["11:00", "17:00", "21:00"],
    Facebook: ["12:00", "16:00", "19:00"],
};

// Pick a time based on platform and index (rotates)
export function pickTime(platform: Platform, index: number): string {
    const slots = WINDOWS[platform] || ["10:00"];
    return slots[index % slots.length];
}