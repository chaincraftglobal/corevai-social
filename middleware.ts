// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = ["/dashboard", "/feed", "/analytics", "/planner"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Read session once
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If logged in and on landing (/), send to /dashboard
    if (pathname === "/") {
        if (token) {
            const url = req.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next(); // show public landing to logged-out users
    }

    // Protect app routes
    if (PROTECTED.some((p) => pathname.startsWith(p))) {
        if (token) return NextResponse.next();
        const url = req.nextUrl.clone();
        url.pathname = "/signin";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/", // landing
        "/dashboard/:path*",
        "/feed/:path*",
        "/analytics/:path*",
        "/planner/:path*",
    ],
};