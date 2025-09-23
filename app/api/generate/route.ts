import { NextResponse } from "next/server";
import OpenAI from "openai";
import { type BrandInfo, type Platform, type Post } from "@/lib/state";
import { pickTime } from "@/lib/scheduler"; // we added in Phase 2 R4
import { seededImg } from "@/lib/utils";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

        // Ask the model for 7 posts as JSON
        const system = `You generate week-long social media post plans.
Return STRICT JSON with keys: posts:[{day, caption, hashtags}], 7 items.
- "day" must be one of ${DAYS.join(", ")} (use each exactly once).
- "caption" 1–2 short sentences; tone=${brand.tone}; niche=${brand.niche}.
- "hashtags" array of 2–5 strings; no #spam; relevant to ${brand.niche}.
Do NOT include markdown, explanations, or extra keys.`;

        const user = `Brand: ${brand.name}
Niche: ${brand.niche}
Tone: ${brand.tone}
Platforms: ${brand.platforms.join(", ")}
Goal: Create a 7-day plan with concise, platform-friendly captions and helpful hashtags.`;

        // You can use responses API, but chat.completions with JSON is simple & stable:
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini", // good, fast, inexpensive
            temperature: 0.7,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });

        const raw = completion.choices[0]?.message?.content || "{}";
        let parsed: { posts: Array<{ day: string; caption: string; hashtags: string[] }> } = { posts: [] };
        try {
            parsed = JSON.parse(raw);
        } catch {
            // fallback: empty
        }

        // Normalize to your Post[]
        const posts: Post[] = DAYS.map((day, idx) => {
            const p = parsed.posts.find((x) => x.day === day) ?? parsed.posts[idx] ?? {
                day,
                caption: `(${brand.tone}) ${brand.niche} insights`,
                hashtags: [`#${brand.niche.replace(/\s+/g, "")}`, "#AI"],
            };

            return {
                id: `ai-${Date.now()}-${idx}`,
                day,
                time: pickTime(primaryPlatform, idx),
                caption: p.caption?.trim() || `(${brand.tone}) ${brand.niche} insights`,
                hashtags: Array.isArray(p.hashtags) && p.hashtags.length ? p.hashtags.slice(0, 5) : [`#${brand.niche.replace(/\s+/g, "")}`, "#Growth"],
                imageUrl: seededImg(`${brand.name}-${day}-ai`, 800, 500), // keep simple image for now
                status: "DRAFT",
                platform: primaryPlatform,
            };
        });

        return NextResponse.json({ posts });
    } catch (err: any) {
        console.error("generate error", err);
        return NextResponse.json({ error: err?.message || "unknown_error" }, { status: 500 });
    }
}