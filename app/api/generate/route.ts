// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { BrandInfo, Platform, Post } from "@/lib/state";
import { pickTime } from "@/lib/scheduler";
import { openai } from "@/lib/openai";   // centralized OpenAI client
import { prisma } from "@/lib/prisma";
import { seededImg } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAYS = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday",
] as const;

type ModelPost = { day: string; caption: string; hashtags: string[] };
type ModelResponse = { posts: ModelPost[] };

function isModelResponse(x: unknown): x is ModelResponse {
    if (!x || typeof x !== "object") return false;
    const posts = (x as any).posts;
    if (!Array.isArray(posts)) return false;
    return posts.every(
        (p) =>
            p &&
            typeof p === "object" &&
            typeof (p as any).day === "string" &&
            typeof (p as any).caption === "string" &&
            Array.isArray((p as any).hashtags)
    );
}

export async function POST(req: Request) {
    try {
        // ---- Auth required ----
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ---- Parse brand payload ----
        const { brand }: { brand: BrandInfo } = await req.json();
        if (!brand?.name || !brand?.niche || !brand?.tone || !brand?.platforms?.length) {
            return NextResponse.json({ error: "Invalid brand payload" }, { status: 400 });
        }
        const primaryPlatform: Platform = (brand.platforms[0] ?? "LinkedIn") as Platform;

        // ---- Fetch user for credits/trial ----
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, plan: true, credits: true, trialEndsAt: true },
        });
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // ---- Cost model: 1 credit per generated post (7) ----
        const COST = 7;

        // Optional: trial enforcement (not blocking if they still have credits)
        // const trialExpired = user.trialEndsAt ? new Date(user.trialEndsAt).getTime() < Date.now() : false;

        // ---- Enforce credits ----
        if ((user.credits ?? 0) < COST) {
            return NextResponse.json(
                {
                    error: "Not enough credits. Please upgrade your plan.",
                    need: COST,
                    have: user.credits ?? 0,
                    plan: user.plan ?? "FREE",
                },
                { status: 402 }
            );
        }

        // ---- Ask model for JSON (7 posts) ----
        const system = `You generate week-long social media post plans.
Return STRICT JSON with keys: posts:[{day, caption, hashtags}], exactly 7 items.
- "day" must be one of ${DAYS.join(", ")} and each used exactly once.
- "caption" 1–2 short sentences; tone=${brand.tone}; niche=${brand.niche}.
- "hashtags" array of 2–5 strings; relevant to ${brand.niche}.
Do NOT include markdown, explanations, or extra keys.`;

        const userMsg = `Brand: ${brand.name}
Niche: ${brand.niche}
Tone: ${brand.tone}
Platforms: ${brand.platforms.join(", ")}
Goal: Create a 7-day plan with concise, platform-friendly captions and helpful hashtags.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.7,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: system },
                { role: "user", content: userMsg },
            ],
        });

        const raw = completion.choices[0]?.message?.content ?? "{}";

        let parsed: ModelResponse = { posts: [] };
        try {
            const json = JSON.parse(raw) as unknown;
            parsed = isModelResponse(json) ? json : { posts: [] };
        } catch {
            // keep parsed = { posts: [] }
        }

        // Fallback if model output is not perfect
        const safePostsArray: ModelPost[] =
            parsed.posts?.length === 7
                ? parsed.posts
                : DAYS.map((d) => ({
                    day: d,
                    caption: `(${brand.tone}) ${brand.niche} insights`,
                    hashtags: [`#${brand.niche.replace(/\s+/g, "")}`, "#Growth"],
                }));

        // ---- Build Post[] with time slots + seeded images ----
        const posts: Post[] = DAYS.map((day, idx) => {
            const found = safePostsArray.find((x) => x.day === day) ?? safePostsArray[idx];
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

        // ---- Decrement credits atomically ----
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: COST } },
            select: { credits: true },
        });

        // ---- Return with cost + remaining so UI can update live ----
        return NextResponse.json({
            posts,
            cost: COST,
            remaining: updated.credits ?? 0,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown_error";
        console.error("POST /api/generate error", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}