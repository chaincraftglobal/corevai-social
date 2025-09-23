import type { BrandInfo, Post, Platform } from "./state";
import { seededImg } from "./utils";

// Small pool of example captions per tone
const captionsByTone: Record<string, string[]> = {
    Friendly: [
        "Hey friends 👋 let’s talk about {{niche}} today!",
        "Sharing a quick tip from {{name}}’s journey 🚀",
        "Happy vibes only 🌸 Stay inspired in {{niche}}!",
    ],
    Professional: [
        "Industry insights: {{niche}} trends you should know.",
        "{{name}} is committed to excellence in {{niche}}.",
        "Building authority in {{niche}} — one step at a time.",
    ],
    Witty: [
        "Who said {{niche}} has to be boring? 😉",
        "Another day, another {{niche}} hack 💡",
        "{{name}} just dropped wisdom bombs 💣",
    ],
    Inspirational: [
        "Dream big. {{niche}} is the future 🌟",
        "Success leaves clues — here’s one from {{name}}.",
        "Inspiration fuels progress 🚀",
    ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function generatePlan(brand: BrandInfo): Post[] {
    const caps = captionsByTone[brand.tone] || captionsByTone["Friendly"];

    return days.map((day, idx) => {
        const caption = caps[idx % caps.length]
            .replace("{{niche}}", brand.niche)
            .replace("{{name}}", brand.name);

        return {
            id: String(idx + 1),
            day,
            caption,
            hashtags: [`#${brand.niche}`, "#AI", "#Growth"],
            imageUrl: seededImg(`${brand.name}-${day}-${idx}`),
            status: "DRAFT" as const,
            platform: (brand.platforms[0] ?? "LinkedIn") as Platform,  // ✅ assert type
        };
    });
}