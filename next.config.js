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

  // Configurazione immagini per supportare Vercel Blob Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // Headers di sicurezza globali
  async headers() {
    return [
      {
        // Headers per tutte le pagine TRANNE /contact
        source: '/((?!contact).*)',
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
      },
      {
        // Headers speciali per /contact per permettere iframe
        source: '/contact',
        headers: [
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
          // X-Frame-Options rimosso per permettere iframe
        ]
      }
    ];
  },

  // Redirects per compatibilità URL
  async redirects() {
    return [
      {
        source: '/bugbounty',
        destination: '/bug-bounty',
        permanent: true,
      },
      {
        source: '/bugbounty/:path*',
        destination: '/bug-bounty/:path*',
        permanent: true,
      },
    ];
  }
};

module.exports = nextConfig;