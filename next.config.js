/** @type {import('next').NextConfig} */

// Bundle analyzer configuration (optional)
const withBundleAnalyzer = process.env.ANALYZE === 'true' ?
  require('@next/bundle-analyzer')({
    enabled: true,
    openAnalyzer: false,
  }) :
  (config) => config

const nextConfig = {
  // Environment variables configuration
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  },

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
    webpackBuildWorker: true,
    optimizeCss: true,
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            maxSize: 244000,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-icons',
            chunks: 'all',
            priority: 10,
            maxSize: 50000,
          },
        },
      }
    }

    // Tree shake unused imports (only for production)
    if (!dev && !isServer) {
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    return config
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // SEO optimizations
  trailingSlash: false,

  // Modern browser targeting to reduce bundle size
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Redirects for canonical URL enforcement
  async redirects() {
    return [
      // Redirect www to non-www (backup in case middleware doesn't catch it)
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.matthewraphael.xyz',
          },
        ],
        destination: 'https://matthewraphael.xyz/$1',
        permanent: true,
      },
      // Redirect trailing slashes to non-trailing slash URLs
      {
        source: '/((?!api).*)/',
        destination: '/$1',
        permanent: true,
      },
      // Redirect common alternative paths to canonical ones
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Security headers
  async headers() {
    return [
      {
        // Cache control for homepage
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        // Cache control for blog listing page
        source: '/blog',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        // Cache control for individual blog posts
        source: '/blog/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        // Cache control for portfolio page
        source: '/portfolio',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        // No caching for admin pages - always fresh content
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com https://utteranc.es",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https: http:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https: wss: https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://*.supabase.co https://*.supabase.io https://api.github.com",
              "frame-src 'self' https://dune.com https://*.dune.com https://dune.xyz https://*.dune.xyz https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://utteranc.es https://drive.google.com https://docs.google.com",
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://utteranc.es",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https: http:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https: wss: https://*.supabase.co https://*.supabase.io https://api.github.com",
              "frame-src 'self' https://dune.com https://*.dune.com https://dune.xyz https://*.dune.xyz https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://utteranc.es https://drive.google.com https://docs.google.com",
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