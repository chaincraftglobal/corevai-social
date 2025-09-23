// lib/insights.ts
import type { Post } from "./state";
import { groupBy, sum, bestPost, seededImg } from "./utils";

export function deriveInsights(published: Post[]) {
    if (!published.length) return [];
    const withEng = published.map(p => ({ ...p, eng: (p.likes ?? 0) + (p.comments ?? 0) }));
    const byDay = groupBy(withEng, p => p.day);
    const dayScores = Object.entries(byDay).map(([day, items]) => ({ day, eng: sum(items.map(i => i.eng)) }));
    const bestDay = dayScores.sort((a, b) => b.eng - a.eng)[0]?.day;

    const emojiWins = withEng.filter(p => /[^\w\s]/u.test(p.caption)).length / withEng.length > 0.5;
    const hashtagCountAvg = Math.round(sum(withEng.map(p => p.hashtags.length)) / withEng.length);

    const top = bestPost(published);

    const insights = [
        top ? `Top post was on ${top.day} with ${(top.likes ?? 0)} likes and ${(top.comments ?? 0)} comments.` : null,
        bestDay ? `Best engagement window: ${bestDay}.` : null,
        emojiWins ? `Posts with emojis performed better this week 🎉` : `Plain captions were competitive this week.`,
        `Average hashtags per post: ~${hashtagCountAvg}. Try 3–5 focused tags.`,
    ].filter(Boolean) as string[];

    return insights;
}

export function generateOptimizedPlan(published: Post[]): Post[] {
    const top = bestPost(published);
    const preferredDay = top?.day ?? "Wednesday";
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const rotated = [...days.filter(d => d !== preferredDay)];
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
    }));
}
