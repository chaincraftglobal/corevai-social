export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/feed/:path*",
        "/analytics/:path*",
        "/planner/:path*",
    ],
};