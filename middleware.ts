export { auth as middleware } from "./auth";

export const config = {
    matcher: ["/dashboard/:path*", "/api/workflows/:path*"],
};
