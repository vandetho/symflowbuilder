import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { primaryMain } from '@/theme/palette';
import connectMongo from '@/util/connect-mongo';
import User from '@/models/user.schema';

async function refreshAccessToken(tokenObject: any) {
    try {
        // Get a new set of tokens with a refreshToken
        const tokenResponse = await axios.post(`/api/refresh-token`, {
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
            name: 'credentials',
            // The credentials object is what's used to generate Next Auths default login page - We will not use it however.
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            // Authorize callback is ran upon calling the signin function
            authorize: async (credentials) => {
                if (credentials) {
                    connectMongo();
                    const user = await User.findOne({ email: credentials.email }).select('+password');

                    if (!user) {
                        throw new Error('No user with a matching email was found.');
                    }

                    const pwValid = await user.comparePassword(credentials.password);

                    if (!pwValid) {
                        throw new Error('Your password is invalid');
                    }

                    return user;
                }

                throw new Error('Invalid credentials provided.');
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
