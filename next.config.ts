import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable optimization — Vercel resizes + caches + serves WebP/AVIF automatically
    // First load processes image, subsequent loads are instant from Vercel's CDN cache
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    // Cache optimized images for 7 days on CDN
    minimumCacheTTL: 604800,
    // Serve WebP/AVIF to browsers that support it (Safari 14+ supports WebP)
    formats: ['image/webp'],
    // Responsive sizes for mobile/desktop
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 160, 256, 384],
  },
};

export default nextConfig;
