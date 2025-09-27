// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Status, Platform } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Whitelists to coerce string inputs to Prisma enums safely
const STATUS_VALUES: Record<string, Status> = {
    DRAFT: "DRAFT",
    SCHEDULED: "SCHEDULED",
    PUBLISHED: "PUBLISHED",
};

const PLATFORM_VALUES: Record<string, Platform> = {
    LinkedIn: "LinkedIn",
    Twitter: "Twitter",
    Instagram: "Instagram",
    Facebook: "Facebook",
};

function asStatus(v: unknown): Status {
    if (typeof v === "string" && v in STATUS_VALUES) return STATUS_VALUES[v];
    return "DRAFT"; // sensible fallback
}

function asPlatform(v: unknown): Platform {
    if (typeof v === "string" && v in PLATFORM_VALUES) return PLATFORM_VALUES[v];
    return "LinkedIn"; // sensible fallback
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ posts: [] }, { status: 200 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });
        if (!user) return NextResponse.json({ posts: [] }, { status: 200 });

        const posts = await prisma.post.findMany({
            where: { userId: user.id },
            orderBy: [{ dateISO: "asc" }, { createdAt: "asc" }],
        });

        return NextResponse.json({ posts }, { status: 200 });
    } catch (err) {
        console.error("GET /api/posts error", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * Replace-all save
 * Accepts either { posts: Post[] } or raw Post[] in body
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Parse payload (allow both {posts:[...]} and [...] for convenience)
        const body = await req.json().catch(() => null);
        const incoming = Array.isArray(body) ? body : body?.posts;
        if (!Array.isArray(incoming)) {
            return NextResponse.json({ error: "Invalid payload: expected array or {posts: [...]}" }, { status: 400 });
        }

        // Normalize/validate
        const rows = incoming.map((p: any) => ({
            id: p?.id ?? undefined, // let DB generate if missing
            day: String(p?.day ?? ""),
            dateISO: p?.dateISO ? String(p.dateISO) : null,
            time: p?.time ? String(p.time) : null,
            caption: String(p?.caption ?? ""),
            hashtags: Array.isArray(p?.hashtags) ? p.hashtags.map(String) : [],
            imageUrl: String(p?.imageUrl ?? ""),
            status: asStatus(p?.status),
            platform: asPlatform(p?.platform),
            locked: Boolean(p?.locked),
            publishedAt: p?.publishedAt ? new Date(p.publishedAt) : null,
            likes: p?.likes != null ? Number(p.likes) : null,
            comments: p?.comments != null ? Number(p.comments) : null,
            impressions: p?.impressions != null ? Number(p.impressions) : null,
        }));

        // Replace-all strategy for MVP simplicity
        await prisma.post.deleteMany({ where: { userId: user.id } });

        // Chunked createMany to avoid payload limits
        const chunkSize = 100;
        let created = 0;
        for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            const res = await prisma.post.createMany({
                data: chunk.map((r) => ({ ...r, userId: user.id })),
                skipDuplicates: true,
            });
            created += res.count;
        }

        return NextResponse.json({ ok: true, created }, { status: 200 });
    } catch (err) {
        console.error("POST /api/posts error", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}