
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ]
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Security: Remove source maps in production
    if (!dev) {
      config.devtool = false;
    }
    
    return config;
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects for security
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/login',
        permanent: false,
      },
    ]
  },
  
  // Output configuration for Docker
  output: 'standalone',
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Analytics and monitoring
  analyticsId: process.env.VERCEL_ANALYTICS_ID,
}

module.exports = nextConfig
