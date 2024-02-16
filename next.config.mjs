import next_pwa from "next-pwa";

const isDev = process.env.NODE_ENV !== 'production';

const withPWA = next_pwa({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    exclude: [
        ({ asset }) => {
            return !!(
                asset.name.startsWith('server/') ||
                asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/) ||
                (isDev && !asset.name.startsWith('static/runtime/'))
            );
        },
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({});

export default nextConfig;
