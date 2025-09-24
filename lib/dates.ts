// lib/dates.ts
export const DAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
] as const;

export function startOfNextWeek(from: Date = new Date()): Date {
    // Next Monday at 00:00
    const d = new Date(from);
    const day = d.getDay(); // 0=Sun
    const delta = ((8 - day) % 7) || 7; // days until next Monday
    d.setDate(d.getDate() + delta);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function formatDateISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}