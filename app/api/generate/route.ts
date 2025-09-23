import { NextResponse } from "next/server";
import OpenAI from "openai";
import { type BrandInfo, type Platform, type Post } from "@/lib/state";
import { pickTime } from "@/lib/scheduler";
import { seededImg } from "@/lib/utils";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ModelPost = { day: string; caption: string; hashtags: string[] };
type ModelResponse = { posts: ModelPost[] };

function isModelResponse(x: unknown): x is ModelResponse {
    if (!x || typeof x !== "object") return false;
    const posts = (x as Record<string, unknown>).posts;
    if (!Array.isArray(posts)) return false;
    return posts.every(
        (p) =>
            p &&
            typeof p === "object" &&
            typeof (p as Record<string, unknown>).day === "string" &&
            typeof (p as Record<string, unknown>).caption === "string" &&
            Array.isArray((p as Record<string, unknown>).hashtags)
    );
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
        }

        const { brand }: { brand: BrandInfo } = await req.json();
        if (!brand?.name || !brand?.niche || !brand?.tone || !brand?.platforms?.length) {
            return NextResponse.json({ error: "Invalid brand payload" }, { status: 400 });
        }

        const primaryPlatform: Platform = (brand.platforms[0] ?? "LinkedIn") as Platform;

        const system = `You generate week-long social media post plans.
Return STRICT JSON with keys: posts:[{day, caption, hashtags}], 7 items.
- "day" must be one of ${DAYS.join(", ")} (use each exactly once).
- "caption" 1–2 short sentences; tone=${brand.tone}; niche=${brand.niche}.
- "hashtags" array of 2–5 strings; relevant to ${brand.niche}.
Do NOT include markdown, explanations, or extra keys.`;

        const user = `Brand: ${brand.name}
Niche: ${brand.niche}
Tone: ${brand.tone}
Platforms: ${brand.platforms.join(", ")}
Goal: Create a 7-day plan with concise, platform-friendly captions and helpful hashtags.`;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.7,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });

        const raw: string = completion.choices[0]?.message?.content ?? "{}";

        let parsed: ModelResponse = { posts: [] };
        try {
            const json = JSON.parse(raw) as unknown;
            parsed = isModelResponse(json) ? json : { posts: [] };
        } catch {
            // keep parsed = { posts: [] }
        }

        const posts: Post[] = DAYS.map((day, idx) => {
            const found = parsed.posts.find((x) => x.day === day) ?? parsed.posts[idx];
            const caption = (found?.caption ?? `(${brand.tone}) ${brand.niche} insights`).trim();
            const hashtags =
                Array.isArray(found?.hashtags) && found!.hashtags.length
                    ? found!.hashtags.slice(0, 5)
                    : [`#${brand.niche.replace(/\s+/g, "")}`, "#Growth"];

            return {
                id: `ai-${Date.now()}-${idx}`,
                day,
                time: pickTime(primaryPlatform, idx),
                caption,
                hashtags,
                imageUrl: seededImg(`${brand.name}-${day}-ai`, 800, 500),
                status: "DRAFT",
                platform: primaryPlatform,
            };
        });

        return NextResponse.json({ posts });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown_error";
        console.error("generate error", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}