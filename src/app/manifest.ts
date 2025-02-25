import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SymflowBuilder',
        short_name: 'SymflowBuilder',
        description: 'SymflowBuilder is a workflow builder for symfony',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#D3500E',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192.png',
                sizes: '192x178',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-256.png',
                sizes: '256x238',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-384.png',
                sizes: '384x356',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x474',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
