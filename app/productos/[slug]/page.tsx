// app/productos/[slug]/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/products';
import ShareButtons from '@/components/ShareButtons';
import ProductGallery from '@/components/ProductGallery'; // ⬅️ galería nueva

const BASE = 'https://www.vibetechvibe.com';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

// URL absoluta (para OG y para la galería)
function toAbsolute(src?: string | null) {
  if (!src) return '';
  try {
    const u = new URL(src);
    return u.toString();
  } catch {
    return `${BASE}${src.startsWith('/') ? src : `/${src}`}`;
  }
}

type Props = { params: { slug: string } };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await fetchProductBySlug(params.slug);

    if (!product) {
      const notFoundUrl = `${BASE}/productos/${params.slug}`;
      return {
        title: 'Producto no encontrado',
        description: 'Este producto no existe en VibeTech.',
        alternates: { canonical: notFoundUrl },
        openGraph: {
          type: 'website',
          url: notFoundUrl,
          siteName: 'VibeTech',
          title: 'Producto no encontrado',
          description: 'Este producto no existe en VibeTech.',
          images: [{ url: `${BASE}/og-default.jpg`, width: 1200, height: 630 }],
          locale: 'es_CO',
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Producto no encontrado',
          description: 'Este producto no existe en VibeTech.',
          images: [`${BASE}/og-default.jpg`],
        },
      };
    }

    const canonical = `${BASE}/productos/${product.slug}`;
    const title = product.name;
    const desc = (product.description?.trim() || 'Descubre este producto en VibeTech.').slice(0, 180);

    // Preferimos la 1ª de "images" si existe, si no, imageUrl; y si no, og-default
    const imagesArr: string[] =
      Array.isArray((product as any).images) && (product as any).images.length
        ? (product as any).images.map(toAbsolute).filter(Boolean)
        : (product.imageUrl ? [toAbsolute(product.imageUrl)] : []);
    const ogImg = imagesArr[0] || `${BASE}/og-default.jpg`;

    return {
      title,
      description: desc,
      alternates: { canonical },
      openGraph: {
        type: 'website',
        url: canonical,
        siteName: 'VibeTech',
        title,
        description: desc,
        images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
        locale: 'es_CO',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
        images: [ogImg],
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

  const url = `${BASE}/productos/${product.slug}`;

  const shortDesc =
    (product.description || '').trim().slice(0, 140) +
    ((product.description || '').length > 140 ? '…' : '');

  const waMessage =
    `Hola, quiero comprar el producto "${product.name}".\n` +
    (shortDesc ? `Descripción: ${shortDesc}\n` : '') +
    `Precio: ${formatCOP(product.price_cents)}\n¿Está disponible?\n${url}`;

  // Descuento
  const discount =
    product.old_price_cents && product.old_price_cents > product.price_cents
      ? Math.max(0, Math.round(100 - (product.price_cents / product.old_price_cents) * 100))
      : null;

  // Imágenes para la galería (múltiples o única)
  const images: string[] =
    Array.isArray((product as any).images) && (product as any).images.length
      ? (product as any).images.map(toAbsolute).filter(Boolean)
      : (product.imageUrl ? [toAbsolute(product.imageUrl)] : []);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galería / Imagen */}
        <div>
          {images.length > 0 ? (
            <ProductGallery images={images} alt={product.name} />
          ) : (
            <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>

          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatCOP(product.price_cents)}
            </span>

            {product.old_price_cents && (
              <span className="text-sm line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}

            {discount !== null && discount > 0 && (
              <span
                className="ml-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-500"
              >
                {discount}% OFF
              </span>
            )}
          </div>

          <ShareButtons url={url} productName={product.name} waMessage={waMessage} />
        </div>
      </div>
    </main>
  );
}
