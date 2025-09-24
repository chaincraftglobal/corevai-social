// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";            // ✅ add
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        // ✅ Google OAuth
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true, // lets users link same email across methods
        }),

        // ✅ Credentials (kept)
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
        }),
    ],
    pages: { signIn: "/signin" },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) token.uid = user.id;
            return token;
        },
        async session({ session, token }) {
            if (token?.uid) (session as any).userId = token.uid;
            return session;
        },
    },
};