// app/api/signup/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Free trial setup
        const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? 7);
        const FREE_TRIAL_CREDITS = Number(process.env.FREE_TRIAL_CREDITS ?? 30);

        const now = new Date();
        const trialEndsAt = new Date(
            now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
        );

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                passwordHash,
                plan: "FREE", // 👈 default plan
                trialEndsAt,
                credits: FREE_TRIAL_CREDITS,
            },
            select: { id: true, email: true, name: true, plan: true, trialEndsAt: true, credits: true },
        });

        return NextResponse.json({ ok: true, user }, { status: 201 });
    } catch (e) {
        console.error("signup error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}