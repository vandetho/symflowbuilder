import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { primaryMain } from '@/theme/palette';

async function refreshAccessToken(tokenObject: any) {
    try {
        // Get a new set of tokens with a refreshToken
        const tokenResponse = await axios.post(`${process.env.BACKEND_URL}/api/token/refresh`, {
            refreshToken: tokenObject.refreshToken,
        });

        return {
            accessToken: tokenResponse.data.token,
            accessTokenExpiry: Date.now() + 60 * 60 * 1000,
            refreshToken: tokenResponse.data.refreshToken,
        };
    } catch (error) {
        return {
            ...tokenObject,
            error: 'RefreshAccessTokenError',
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                firstName: {
                    label: 'firstName',
                    type: 'string',
                    placeholder: 'John',
                },
                lastName: {
                    label: 'lastName',
                    type: 'string',
                    placeholder: 'Doe',
                },
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'jsmith@kromb.io',
                },
                confirmEmail: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'jsmith@kromb.io',
                },
                password: { label: 'Password', type: 'password' },
                confirmPassword: { label: 'Password', type: 'password' },
                agreeTerms: { label: 'Agree Terms', type: 'checkbox' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                authType: { type: 'radio', options: ['login', 'register'] },
            },
            async authorize(credentials) {
                if (credentials) {
                    if (credentials.accessToken && credentials.refreshToken) {
                        return { token: credentials.accessToken, refreshToken: credentials.refreshToken };
                    }
                    if (credentials.authType === 'register') {
                        const payload = {
                            firstName: credentials.firstName,
                            lastName: credentials.lastName,
                            email: credentials.email,
                            plainPassword: credentials.password,
                            agreeTerms: credentials.agreeTerms,
                        };

                        const res = await fetch('/api/sign-up', {
                            method: 'POST',
                            body: JSON.stringify(payload),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const user = await res.json();
                        if (!res.ok) {
                            throw new Error(user.message);
                        }
                        if (res.ok && user) {
                            return user;
                        }
                        return null;
                    }

                    const payload = {
                        email: credentials.email,
                        password: credentials.password,
                    };

                    const res = await fetch('/api/sing-in', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const user = await res.json();
                    if (!res.ok) {
                        throw new Error(user.message);
                    }
                    if (res.ok && user) {
                        return user;
                    }
                }
                return null;
            },
        }),
    ],
    cookies: {},
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    accessToken: (user as any).token,
                    accessTokenExpiry: 60 * 60 * 1000 + Date.now(),
                    refreshToken: (user as any).refreshToken,
                };
            }

            const shouldRefreshTime = Math.round((token as any).accessTokenExpiry - Date.now());

            if (shouldRefreshTime <= 0) {
                return refreshAccessToken(token);
            }
            return Promise.resolve(token);
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).accessTokenExpiry = token.accessTokenExpiry;
                (session.user as any).refreshToken = token.refreshToken;
                (session.user as any).error = token.error;
            }

            return session;
        },
    },
    theme: {
        colorScheme: 'auto', // "auto" | "dark" | "light"
        brandColor: primaryMain, // Hex color code #33FF5D
        logo: '/icon-512.png', // Absolute URL to image
    },
    debug: process.env.NODE_ENV === 'development',
};
