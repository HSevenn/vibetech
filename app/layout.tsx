
import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VibeTech — Tecnología que vibra contigo',
  description: 'Catálogo minimalista con enfoque a conversión.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: { siteName: 'VibeTech', locale: 'es_CO', type: 'website' },
  twitter: { card: 'summary_large_image' }
};

export default function RootLayout({ children }: { children: React.ReactNode }){
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
