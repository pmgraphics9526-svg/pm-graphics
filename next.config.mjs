import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // Serve WebP automatically — 60–80% smaller than PNG/JPG at same quality
    formats: ['image/webp'],
    // Breakpoints that match our 1/2/3 column responsive grid
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 240, 360, 480],
    // Cache optimised variants for 30 days at the Vercel edge
    minimumCacheTTL: 2592000,
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://www.google.com https://www.gstatic.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://dl.airtable.com https://*.airtableusercontent.com;
      font-src 'self' data:;
      connect-src 'self' https://vitals.vercel-analytics.com https://www.google.com;
      frame-src 'self' https://www.google.com;
      media-src 'self' blob: data: https://dl.airtable.com https://*.airtableusercontent.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.pmgraphics.in',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
