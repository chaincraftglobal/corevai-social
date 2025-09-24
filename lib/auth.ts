import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    pages: { signIn: "/signin" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user?.passwordHash) return null;

                const ok = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!ok) return null;

                // Return the full user object (NextAuth will strip sensitive fields)
                return user;
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) (session.user as any).id = user.id;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};