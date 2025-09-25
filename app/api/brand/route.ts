import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ brand: null }, { status: 200 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ brand: null }, { status: 200 });

    const brand = await prisma.brandInfo.findUnique({ where: { userId: user.id } });
    return NextResponse.json({ brand }, { status: 200 });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, niche, tone, platforms } = body ?? {};
    if (!name || !niche || !tone || !Array.isArray(platforms)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const saved = await prisma.brandInfo.upsert({
        where: { userId: user.id },           // ✅ works now (unique)
        update: { name, niche, tone, platforms },
        create: { name, niche, tone, platforms, userId: user.id },
    });

    return NextResponse.json({ ok: true, brand: saved }, { status: 200 });
}