import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@symflowbuilder/db";

const useSecureCookies = process.env.NODE_ENV === "production";

export const { handlers, auth, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    cookies: {
        pkceCodeVerifier: {
            name: useSecureCookies
                ? "__Secure-authjs.pkce.code_verifier"
                : "authjs.pkce.code_verifier",
            options: {
                httpOnly: useSecureCookies,
                sameSite: "lax",
                path: "/",
                domain: useSecureCookies ? ".symflowbuilder.com" : undefined,
                secure: useSecureCookies,
            },
        },
    },
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id;
            return session;
        },
    },
});
