export { auth as middleware } from "./auth";

export const runtime = "nodejs";

export const config = {
    matcher: ["/dashboard/:path*", "/api/workflows/:path*"],
};
