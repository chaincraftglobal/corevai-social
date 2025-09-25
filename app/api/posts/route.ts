import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Status, Platform } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ posts: [] }, { status: 200 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ posts: [] }, { status: 200 });

    const posts = await prisma.post.findMany({
        where: { userId: user.id },
        orderBy: [{ dateISO: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ posts }, { status: 200 });
}

// bulk upsert: { posts: Post[] }
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { posts } = await req.json();
    if (!Array.isArray(posts)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    // Normalize/validate minimal set
    const rows = posts.map((p: any) => ({
        id: p.id ?? undefined,
        day: p.day,
        dateISO: p.dateISO ?? null,
        time: p.time ?? null,
        caption: p.caption ?? "",
        hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
        imageUrl: p.imageUrl ?? "",
        status: p.status as Status,
        platform: p.platform as Platform,
        locked: !!p.locked,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
        likes: p.likes ?? null,
        comments: p.comments ?? null,
        impressions: p.impressions ?? null,
    }));

    // Simple strategy: delete all user posts, then recreate (keeps it easy)
    await prisma.post.deleteMany({ where: { userId: user.id } });

    // CreateMany in chunks (to stay safe)
    const chunkSize = 100;
    for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        await prisma.post.createMany({
            data: chunk.map(r => ({ ...r, userId: user.id })),
            skipDuplicates: true,
        });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}