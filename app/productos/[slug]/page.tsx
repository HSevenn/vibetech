// app/productos/[slug]/page.tsx
import Link from 'next/link';
import { fetchProductBySlug } from '@/lib/products';
import type { Metadata } from 'next';
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLink,
} from 'react-icons/fa';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

type Props = {
  params: { slug: string };
};

// 🟢 Genera metadatos dinámicos para WhatsApp, Facebook, X, etc.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'Este producto no existe en VibeTech.',
    };
  }

  const url = `https://vibetechvibe.com/productos/${product.slug}`;

  return {
    title: product.name,
    description: product.description ?? 'Descubre este producto en VibeTech.',
    openGraph: {
      title: product.name,
      description: product.description ?? 'Descubre este producto en VibeTech.',
      url,
      siteName: 'VibeTech',
      images: product.imageUrl
        ? [{ url: product.imageUrl, width: 800, height: 600, alt: product.name }]
        : [],
      locale: 'es_CO',
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description ?? 'Descubre este producto en VibeTech.',
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Link href="/productos" className="btn btn-outline mt-6">
          Volver a productos
        </Link>
      </main>
    );
  }

  const url = `https://vibetechvibe.com/productos/${product.slug}`;
  const shortDesc =
    (product.description || '').trim().slice(0, 140) +
    ((product.description || '').length > 140 ? '…' : '');

  const waMessage = `Hola, quiero comprar el producto "${product.name}".
${shortDesc ? `Descripción: ${shortDesc}\n` : ''}Precio: ${formatCOP(product.price_cents)}
¿Está disponible?
${url}`;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-lg border object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">{product.description}</p>

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatCOP(product.price_cents)}</span>
            {product.old_price_cents && (
              <span className="text-lg line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
          </div>

          {/* Botón principal */}
          <div className="flex gap-3 mb-6">
            <a
              href={`https://wa.me/573014564861?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Comprar por WhatsApp
            </a>
            <Link href="/productos" className="btn btn-outline">
              Volver
            </Link>
          </div>

          {/* Botones de compartir */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Mira este producto: ${product.name} — ${url}`
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
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}&text=${encodeURIComponent(product.name)}`}
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
              onClick={() => navigator.clipboard.writeText(url)}
              className="px-4 py-2 rounded-lg border border-gray-400 text-gray-400 hover:bg-gray-400/10 flex items-center gap-2"
            >
              <FaLink /> Copiar link
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
