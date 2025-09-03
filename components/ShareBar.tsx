
'use client';
import { useEffect, useState } from 'react';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiCopy } from 'react-icons/fi';

export default function ShareBar({ title }: { title: string }) {
  const [href, setHref] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') setHref(window.location.href);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      alert('Enlace copiado ✅');
    } catch {
      alert('No se pudo copiar');
    }
  };

  const encoded = encodeURIComponent(href);
  const encodedText = encodeURIComponent(`${title} • ${href}`);

  const btn = 'flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition';

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copy} className={`${btn} hover:bg-neutral-100 dark:hover:bg-neutral-800`}>
        <FiCopy /> Copiar link
      </button>
      <a
        className={`${btn} text-green-600 border-green-600 hover:bg-green-50`}
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
      >
        <FaWhatsapp /> WhatsApp
      </a>
      <a
        className={`${btn} text-blue-600 border-blue-600 hover:bg-blue-50`}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
      >
        <FaFacebook /> Facebook
      </a>
      <a
        className={`${btn} text-black border-black hover:bg-neutral-200 dark:hover:bg-neutral-700`}
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`}
        target="_blank"
      >
        <FaXTwitter /> X
      </a>
    </div>
  );
}
