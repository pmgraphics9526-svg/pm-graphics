import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      // kissfft-js (Vocal Remover tool) ships an emscripten bundle with an
      // unreachable Node.js fallback path that references `fs`/`path`.
      // Turbopack still statically resolves it, so stub both for the
      // browser build only — no other tool imports Node built-ins.
      fs: { browser: './lib/empty-shim.js' },
      path: { browser: './lib/empty-shim.js' },
    },
  },
  images: {
    // Serve WebP automatically — 60–80% smaller than PNG/JPG at same quality
    formats: ['image/webp'],
    qualities: [75, 85],
    // Breakpoints that match our 1/2/3 column responsive grid
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 240, 360, 480],
    // Cache optimised variants for 30 days at the Vercel edge
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://www.google.com https://www.gstatic.com blob:;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://dl.airtable.com https://*.airtableusercontent.com https://storage.googleapis.com;
      font-src 'self' data:;
      connect-src 'self' https://vitals.vercel-analytics.com https://www.google.com;
      frame-src 'self' https://www.google.com;
      media-src 'self' blob: data: https://dl.airtable.com https://*.airtableusercontent.com https://storage.googleapis.com;
      worker-src 'self' blob:;
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
      {
        // The audio tools (Music Mixer, Audio Trim, Noise Reduce) load a
        // multi-threaded ffmpeg.wasm build, which needs SharedArrayBuffer.
        // Browsers only expose that in a cross-origin-isolated context, so
        // the tool pages themselves need COEP+COOP. Scoped to /tools/ only
        // — applying this site-wide would risk breaking third-party embeds
        // (Google reCAPTCHA/Maps, Airtable images) used elsewhere.
        source: '/tools/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // Once COEP is active, every subresource the isolated page loads
        // must explicitly allow cross-origin loading. The ffmpeg core/wasm
        // files are same-origin, but CORP makes that explicit regardless
        // of how the library's internal fetch/worker loading resolves it.
        // worker.js also needs its own COEP header — Chrome only grants a
        // dedicated Worker cross-origin-isolated status (and thus
        // SharedArrayBuffer) if the worker script's own response declares
        // require-corp too; without it the worker load is blocked outright
        // (net::ERR_BLOCKED_BY_RESPONSE), which is what silently stalled
        // ffmpeg-core.wasm from ever being requested.
        source: '/ffmpeg/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
