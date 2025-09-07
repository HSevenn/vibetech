'use client';

import Link from 'next/link';
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLink,
} from 'react-icons/fa';

type Props = {
  url: string;          // URL canónica del producto (ej: https://www.vibetechvibe.com/productos/slug)
  productName: string;  // Nombre del producto
  waMessage: string;    // Mensaje para el botón "Comprar por WhatsApp"
};

export default function ShareButtons({ url, productName, waMessage }: Props) {
  // ✅ Asegura URL limpia (sin ?query ni #hash)
  const cleanUrl = (() => {
    try {
      const u = new URL(url);
      u.search = '';
      u.hash = '';
      return u.toString();
    } catch {
      // por si llega relativa o malformada
      return url.split('?')[0].split('#')[0];
    }
  })();

  // CTA compra directa
  const waBuyHref = `https://wa.me/573014564861?text=${encodeURIComponent(waMessage)}`;

  // Compartir en WhatsApp: mensaje + salto de línea + URL limpia
  const waShareText = `Mira este producto: ${productName}\n${cleanUrl}`;
  const waShareHref = `https://wa.me/?text=${encodeURIComponent(waShareText)}`;

  // Otras redes con URL canónica limpia
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(productName)}`;
  const igHref = 'https://www.instagram.com/vibetechcol';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanUrl);
    } catch { /* noop */ }
  };

  return (
    <div>
      {/* CTA principal */}
      <div className="flex gap-3 mb-6">
        <a href={waBuyHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Comprar por WhatsApp
        </a>
        <Link href="/productos" className="btn btn-outline">
          Volver
        </Link>
      </div>

      {/* Botones de compartir */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={waShareHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-green-500 text-green-500 hover:bg-green-500/10 flex items-center gap-2"
        >
          <FaWhatsapp /> WhatsApp
        </a>

        <a
          href={fbHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500/10 flex items-center gap-2"
        >
          <FaFacebook /> Facebook
        </a>

        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-sky-400 text-sky-400 hover:bg-sky-400/10 flex items-center gap-2"
        >
          <FaTwitter /> X
        </a>

        <a
          href={igHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-pink-500 text-pink-500 hover:bg-pink-500/10 flex items-center gap-2"
        >
          <FaInstagram /> Instagram
        </a>

        <button
          onClick={copyLink}
          className="px-4 py-2 rounded-lg border border-gray-400 text-gray-400 hover:bg-gray-400/10 flex items-center gap-2"
        >
          <FaLink /> Copiar link
        </button>
      </div>
    </div>
  );
}
