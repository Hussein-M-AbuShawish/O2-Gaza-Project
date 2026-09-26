// next.config.mjs - الإعدادات المثالية
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ تفعيل TypeScript بشكل صحيح
  typescript: {
    ignoreBuildErrors: false,  // احذف هذا السطر أو اجعله false
  },
  
  // ✅ تحسين الصور بشكل صحيح
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      ...(process.env.BOT_ORIGIN
        ? [{
            protocol: new URL(process.env.BOT_ORIGIN).protocol.replace(':', ''),
            hostname: new URL(process.env.BOT_ORIGIN).hostname,
            pathname: '/menu/**',
          }]
        : []),
      // استضافة Firebase
      { protocol: 'https', hostname: '*.web.app', pathname: '/menu/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ إعدادات الإنتاج
  reactStrictMode: true,
  
  // ✅ تحسين الـ Bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async rewrites() {
    const bot = (process.env.BOT_ORIGIN || '').replace(/\/+$/, '');
    if (!bot) return [];
    return {
      beforeFiles: [
        { source: '/bot-api/:path*', destination: `${bot}/api/:path*` },
        { source: '/api/img/:path*', destination: `${bot}/api/img/:path*` },
      ],
      afterFiles: [
        { source: '/menu/:path*', destination: `${bot}/menu/:path*` },
      ],
      fallback: [],
    };
  },

  // ✅ Headers للأمان
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
}

export default nextConfig
