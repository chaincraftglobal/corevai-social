import type { Post } from "./state";
import { groupBy, sum, bestPost, seededImg } from "./utils";

// ... keep deriveInsights as-is

export function generateOptimizedPlan(published: Post[]): Post[] {
    // pick a default platform based on what you’ve posted most
    const platformCounts = published.reduce<Record<string, number>>((acc, p) => {
        if (p.platform) acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
    }, {});
    const topPlatform =
        Object.keys(platformCounts).sort((a, b) => (platformCounts[b] ?? 0) - (platformCounts[a] ?? 0))[0] ||
        "LinkedIn";

    const top = bestPost(published);
    const preferredDay = top?.day ?? "Wednesday";
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const rotated = [...days.filter((d) => d !== preferredDay)];
    rotated.splice(2, 0, preferredDay);

    const baseCaptions = [
        "Fresh ideas for your audience ✨",
        "Quick win tip they’ll love 💡",
        "Behind the scenes: keep it real 🎬",
        "Ask a question to spark comments ❓",
        "Value first. Sell second. 📈",
        "Story > Features. Share outcomes 📖",
        "Call to action: save & share 🔁",
    ];

    return rotated.map((day, idx) => ({
        id: String(idx + 100),
        day,
        caption: baseCaptions[idx % baseCaptions.length],
        hashtags: ["#Growth", "#Marketing", "#AI"].slice(0, 2 + (idx % 2)),
        imageUrl: seededImg(`opt-${day}-${idx}`),
        status: "DRAFT" as const,
        platform: topPlatform as Post["platform"], // ✅ required by type
        // time is optional; you can add smarter times later
    }));
}