/** @type {import('next').NextConfig} */
const nextConfig = {
  // Si en algún lugar usas <Image>, permite URLs públicas de Supabase Storage:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Puedes dejarlo en true si no quieres optimización de Next/Image;
    // si no usas <Image>, no afecta.
    unoptimized: true,
  },
  // Nada de experimental.appDir: ya es el comportamiento por defecto en Next 13/14
};

module.exports = nextConfig;
