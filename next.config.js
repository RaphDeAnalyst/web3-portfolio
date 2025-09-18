/** @type {import('next').NextConfig} */

// Bundle analyzer configuration (optional)
const withBundleAnalyzer = process.env.ANALYZE === 'true' ?
  require('@next/bundle-analyzer')({
    enabled: true,
    openAnalyzer: false,
  }) :
  (config) => config

const nextConfig = {
  // Performance optimizations
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // SEO optimizations
  trailingSlash: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Existing security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Enhanced security headers
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Content Security Policy - Production-grade
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https: http:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https: wss: https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://*.supabase.co https://*.supabase.io",
              "frame-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "manifest-src 'self'",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
      {
        // More relaxed CSP for admin routes that may need additional permissions
        source: '/admin/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https: http:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https: wss: https://*.supabase.co https://*.supabase.io",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "manifest-src 'self'",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);