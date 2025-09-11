/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: {
    // Usamos next/image optimizado y permitimos Supabase
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' }, // cubre cualquier subdominio de supabase.co
    ],
  },
};

module.exports = nextConfig;
