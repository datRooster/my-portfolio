/** @type {import('next').NextConfig} */
const nextConfig = {
  // CONFIGURAZIONE PER DEPLOYMENT STATICO (hosting condiviso)
  // Decommenta le righe seguenti per export statico:
  
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // },
  
  // CONFIGURAZIONE PER DEPLOYMENT DINAMICO (VPS/Server)
  // Configurazione attuale per server con Node.js
  serverExternalPackages: ['crypto', 'jsonwebtoken', 'bcryptjs', 'speakeasy'],
  
  // Disabilita ESLint durante build per deployment rapido
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript check durante build
  typescript: {
    ignoreBuildErrors: false,
  },

  // Headers di sicurezza globali
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
          }
        ],
      },
    ]
  },

  // Configurazione immagini per produzione
  images: {
    domains: ['localhost', 'your-domain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },

  // Compressione per performance
  compress: true,
  
  // Configurazione per hosting su subdirectory (se necessario)
  // basePath: '/portfolio',
  // assetPrefix: '/portfolio',
};

module.exports = nextConfig;