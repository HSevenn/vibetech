// app/productos/[slug]/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/products';
import ShareButtons from '@/components/ShareButtons';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

type Props = { params: { slug: string } };

// evita cachés problemáticos en Vercel/ISR cuando agregas productos
export const dynamic = 'force-dynamic';

// Metadatos Open Graph/Twitter para la vista previa en WhatsApp/Facebook/X
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
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
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description ?? 'Descubre este producto en VibeTech.',
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'VibeTech',
      description: 'Catálogo de tecnología que vibra contigo.',
    };
  }
}

export default async function ProductPage({ params }: Props) {
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
  const waMessage =
    `Hola, quiero comprar el producto "${product.name}".\n` +
    (shortDesc ? `Descripción: ${shortDesc}\n` : '') +
    `Precio: ${formatCOP(product.price_cents)}\n¿Está disponible?\n${url}`;

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
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatCOP(product.price_cents)}</span>
            {product.old_price_cents && (
              <span className="text-lg line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
          </div>

          {/* Botones (cliente) */}
          <ShareButtons url={url} productName={product.name} waMessage={waMessage} />
        </div>
      </div>
    </main>
  );
}
