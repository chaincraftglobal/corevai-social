// app/api/posts/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Status, Platform } from "@prisma/client";

type Params = { id: string };

async function requireUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });
    return user;
}

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<Params> }
) {
    const { id } = await ctx.params;
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findFirst({
        where: { id, userId: user.id },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ post }, { status: 200 });
}

export async function PATCH(
    req: NextRequest,
    ctx: { params: Promise<Params> }
) {
    const { id } = await ctx.params;
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => ({}))) as Partial<{
        day: string;
        dateISO: string;
        time: string;
        caption: string;
        hashtags: string[];
        imageUrl: string;
        status: Status;
        platform: Platform;
        locked: boolean;
        publishedAt: string | null;
        likes: number | null;
        comments: number | null;
        impressions: number | null;
    }>;

    // Ensure the post belongs to the user
    const existing = await prisma.post.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: any = {};
    if (typeof body.day === "string") data.day = body.day;
    if (typeof body.dateISO === "string") data.dateISO = body.dateISO;
    if (typeof body.time === "string") data.time = body.time;
    if (typeof body.caption === "string") data.caption = body.caption;
    if (Array.isArray(body.hashtags)) data.hashtags = body.hashtags;
    if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl;
    if (typeof body.status === "string") data.status = body.status as Status;
    if (typeof body.platform === "string") data.platform = body.platform as Platform;
    if (typeof body.locked === "boolean") data.locked = body.locked;
    if (typeof body.likes === "number" || body.likes === null) data.likes = body.likes;
    if (typeof body.comments === "number" || body.comments === null) data.comments = body.comments;
    if (typeof body.impressions === "number" || body.impressions === null) data.impressions = body.impressions;
    if (body.publishedAt === null) data.publishedAt = null;
    else if (typeof body.publishedAt === "string") data.publishedAt = new Date(body.publishedAt);

    const post = await prisma.post.update({
        where: { id },
        data,
    });

    return NextResponse.json({ ok: true, post }, { status: 200 });
}

export async function DELETE(
    _req: NextRequest,
    ctx: { params: Promise<Params> }
) {
    const { id } = await ctx.params;
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure the post belongs to the user
    const existing = await prisma.post.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
}