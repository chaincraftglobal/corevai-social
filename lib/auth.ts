// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? 7);
const FREE_TRIAL_CREDITS = Number(process.env.FREE_TRIAL_CREDITS ?? 30);

// Build providers safely (Google optional)
const providers: NextAuthOptions["providers"] = [];

// ✅ Google OAuth (only if env vars set)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        })
    );
} else {
    console.warn("[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing — skipping Google provider.");
}

// ✅ Credentials (always included)
providers.push(
    Credentials({
        name: "Email & Password",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(creds) {
            if (!creds?.email || !creds?.password) return null;

            const user = await prisma.user.findUnique({ where: { email: creds.email } });
            if (!user?.passwordHash) return null;

            const ok = await bcrypt.compare(creds.password, user.passwordHash);
            if (!ok) return null;

            return { id: user.id, name: user.name ?? null, email: user.email ?? null };
        },
    })
);

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers,
    pages: { signIn: "/signin" },

    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) (token as any).uid = user.id;
            return token;
        },
        async session({ session, token }) {
            if ((token as any)?.uid) (session as any).userId = (token as any).uid;
            return session;
        },

        // 🔧 Safety net: if a user logs in but has missing credits/trial, seed them
        async signIn({ user }) {
            try {
                if (!user?.id) return true;

                const row = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { credits: true, trialEndsAt: true, plan: true },
                });
                if (!row) return true;

                const needsSeed = (row.credits ?? 0) === 0 && !row.trialEndsAt;
                if (needsSeed) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            plan: "FREE",
                            credits: FREE_TRIAL_CREDITS,
                            trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 86400000),
                        },
                    });
                }
            } catch (e) {
                console.warn("[auth] signIn seeding failed", e);
            }
            return true;
        },
    },

    // 🌱 First-time Google OAuth user creation → seed credits/trial immediately
    events: {
        async createUser({ user }) {
            try {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        plan: "FREE",
                        credits: FREE_TRIAL_CREDITS,
                        trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 86400000),
                    },
                });
            } catch (e) {
                console.warn("[auth] createUser seeding failed", e);
            }
        },
    },
};