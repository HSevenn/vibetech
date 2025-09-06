'use client';

import Link from 'next/link';
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLink,
} from 'react-icons/fa';
import { useCallback, useState } from 'react';

type Props = {
  url: string;
  productName: string;
  waMessage: string; // mensaje para “Comprar por WhatsApp”
};

export default function ShareButtons({ url, productName, waMessage }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [url]);

  return (
    <div className="space-y-3">
      {/* Botón principal */}
      <div className="flex gap-3">
        <a
          href={`https://wa.me/573014564861?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Comprar por WhatsApp
        </a>
        <Link href="/productos" className="btn btn-outline">Volver</Link>
      </div>

      {/* Compartir (estilo transparente) */}
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Mira este producto: ${productName} — ${url}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-green-500 text-green-500 hover:bg-green-500/10 flex items-center gap-2"
        >
          <FaWhatsapp /> WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500/10 flex items-center gap-2"
        >
          <FaFacebook /> Facebook
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(productName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-sky-400 text-sky-400 hover:bg-sky-400/10 flex items-center gap-2"
        >
          <FaTwitter /> X
        </a>

        <a
          href="https://www.instagram.com/vibetechcol"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-pink-500 text-pink-500 hover:bg-pink-500/10 flex items-center gap-2"
        >
          <FaInstagram /> Instagram
        </a>

        <button
          onClick={copy}
          className="px-4 py-2 rounded-lg border border-gray-400 text-gray-400 hover:bg-gray-400/10 flex items-center gap-2"
        >
          <FaLink /> {copied ? '¡Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
