/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.kctmenswear.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.kctmenswear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.supabase.co'],
    },
  },
};

module.exports = nextConfig;