'use client';

import { useCallback } from 'react';
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaLink } from 'react-icons/fa';

type Props = {
  productName: string;
  productUrl: string;        // URL absoluta del producto
  whatsappPhone: string;     // solo dígitos, sin +
  instagramUrl?: string;
  className?: string;
};

export default function SocialButtons({
  productName,
  productUrl,
  whatsappPhone,
  instagramUrl = 'https://www.instagram.com/vibetechcol',
  className,
}: Props) {
  const encodedUrl  = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(`Hola, quiero comprar: ${productName}`);

  const waBuy = `https://wa.me/57${whatsappPhone}?text=${encodedText}%20${encodedUrl}`;
  const waShare = `https://wa.me/?text=${encodeURIComponent(`Mira este producto: ${productName} — ${productUrl}`)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xHref  = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      alert('Link copiado 👍');
    } catch {
      alert('No se pudo copiar el link.');
    }
  }, [productUrl]);

  const btn = 'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-950/5 dark:hover:bg-white/10 transition';

  return (
    <div className={['flex flex-wrap gap-2', className ?? ''].join(' ')}>
      {/* Comprar por WhatsApp */}
      <a href={waBuy} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        <FaWhatsapp /> Comprar por WhatsApp
      </a>

      {/* Volver lo pone la página (no aquí) */}

      {/* Compartir */}
      <a href={waShare} target="_blank" rel="noopener noreferrer" className={btn}>
        <FaWhatsapp /> WhatsApp
      </a>
      <a href={fbHref} target="_blank" rel="noopener noreferrer" className={btn}>
        <FaFacebook /> Facebook
      </a>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={btn}>
        <FaTwitter /> X
      </a>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={btn}>
        <FaInstagram /> Instagram
      </a>
      <button type="button" onClick={copyLink} className={btn}>
        <FaLink /> Copiar link
      </button>
    </div>
  );
}
