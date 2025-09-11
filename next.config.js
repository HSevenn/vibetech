/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permitimos imágenes públicas de Supabase Storage y tu dominio
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'vibetechvibe.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
    ],
    // si tenías un bucket/domino exacto puedes añadirlo explícito también:
    // { protocol: 'https', hostname: 'twoyofkufpktmpshzkim.supabase.co', pathname: '/storage/v1/object/public/**' },
  },
  // Nada de experimental.appDir (ya no aplica en Next 14)
};

module.exports = nextConfig;
