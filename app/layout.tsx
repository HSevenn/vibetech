import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VibeTech — Tecnología que vibra contigo',
  description: 'Catálogo minimalista con enfoque a conversión.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',

  // Open Graph (fallback global)
  openGraph: {
    siteName: 'VibeTech',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/og-default.jpg',  // servido desde /public
        width: 1200,
        height: 630,
        alt: 'VibeTech — Tecnología que vibra contigo',
      },
    ],
  },

  // Twitter Card (usa la misma imagen)
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },

  // Favicons
  icons: {
    icon: [
      { url: '/vibetech_icon.ico?v=2' },
      { url: '/vibetech_icon_16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/vibetech_icon_32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/vibetech_icon_48.png?v=2', sizes: '48x48', type: 'image/png' },
      { url: '/vibetech_icon_192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/vibetech_icon_512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/vibetech_icon_180.png?v=2' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="container-max py-8 px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
