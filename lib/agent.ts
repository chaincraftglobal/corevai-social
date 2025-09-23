// lib/agent.ts
import type { BrandInfo, Post, Platform } from "./state";
import { seededImg } from "./utils";
import { pickTime } from "./scheduler"; // ✅ add this

const CAPTIONS: Record<BrandInfo["tone"], string[]> = {
    Friendly: [
        "Hey friends 👋 let’s talk about {{niche}} today!",
        "Quick tip from {{name}}’s journey 🚀",
        "Happy vibes 🌸 Stay inspired in {{niche}}!",
    ],
    Professional: [
        "Industry insights: {{niche}} trends to watch.",
        "{{name}} is raising the bar in {{niche}}.",
        "Building authority in {{niche}} — one step at a time.",
    ],
    Witty: [
        "Who said {{niche}} has to be boring? 😉",
        "Another day, another {{niche}} hack 💡",
        "{{name}} just dropped wisdom 💣",
    ],
    Inspirational: [
        "Dream big. {{niche}} is the future 🌟",
        "Success leaves clues — here’s one from {{name}}.",
        "Inspiration fuels progress 🚀",
    ],
} as const;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function generatePlan(brand: BrandInfo): Post[] {
    const caps = CAPTIONS[brand.tone as keyof typeof CAPTIONS] ?? CAPTIONS.Friendly;
    const platform: Platform = (brand.platforms[0] ?? "LinkedIn") as Platform;

    return DAYS.map((day, idx) => {
        const caption = caps[idx % caps.length]
            .replace("{{niche}}", brand.niche)
            .replace("{{name}}", brand.name);

        return {
            id: `gen-${Date.now()}-${idx}`,
            day,
            time: pickTime(platform, idx), // ✅ recommended time per platform
            caption,
            hashtags: [`#${brand.niche.replace(/\s+/g, "")}`, "#AI", "#Growth"],
            imageUrl: seededImg(`${brand.name}-${day}-${idx}`, 800, 500),
            status: "DRAFT" as const,
            platform,
        };
    });
}

export async function generatePlanRemote(brand: BrandInfo): Promise<Post[]> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Generate failed: ${res.status} ${msg}`);
  }
  const data = await res.json();
  return data.posts as Post[];
}