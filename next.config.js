/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per supportare moduli Node.js
  serverExternalPackages: ['crypto', 'jsonwebtoken', 'bcryptjs', 'speakeasy'],
  
  // Disabilita ESLint durante build per i file di sicurezza in sviluppo
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
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;