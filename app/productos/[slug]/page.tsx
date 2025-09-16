// app/productos/[slug]/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchProductBySlug, publicUrl } from '@/lib/products';
import ShareButtons from '@/components/ShareButtons';
import ProductGallery from '@/components/ProductGallery';

export const dynamic = 'force-dynamic';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

function getDiscount(price_cents: number, old_price_cents: number | null) {
  if (!old_price_cents || old_price_cents <= price_cents) return null;
  const pct = Math.max(0, Math.round(100 - (price_cents / old_price_cents) * 100));
  return pct > 0 ? pct : null;
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Producto no encontrado | VibeTech',
      description: 'No encontramos este producto.',
    };
  }
  const title = `${product.name} | VibeTech`;
  const description =
    product.description ??
    `Descubre ${product.name} en VibeTech. Envíos rápidos en Colombia.`;
  const image = product.imageUrl || '/og.png';
  const url = `${publicUrl}/productos/${product.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image }],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-sm text-neutral-600">Producto no encontrado.</p>
        <Link href="/productos" className="text-sm underline">Volver al catálogo</Link>
      </main>
    );
  }

  const agotado = (product.stock ?? 0) <= 0;
  const discount = getDiscount(product.price_cents, product.old_price_cents);
  const url = `${publicUrl}/productos/${product.slug}`;
  const waMessage = `Hola VibeTech, me interesa el ${product.name}. ${url}`;

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Link href="/productos" className="text-sm text-neutral-500 hover:underline">
          ← Ver más productos
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Galería + Overlay AGOTADO */}
        <div className="relative">
          <ProductGallery images={product.images || []} />

          {agotado && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="backdrop-blur-md bg-black/40 px-6 py-2 rounded-md">
                <span className="text-white text-2xl font-bold tracking-wide">AGOTADO</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold">{formatCOP(product.price_cents)}</span>
            {product.old_price_cents && product.old_price_cents > product.price_cents && (
              <>
                <span className="text-sm text-neutral-500 line-through">
                  {formatCOP(product.old_price_cents)}
                </span>
                {discount !== null && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-500">
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-sm text-neutral-700 whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Botones / compartir */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Si tienes algún CTA de compra, puedes deshabilitarlo así:
            <button className="px-5 py-3 rounded-md bg-black text-white disabled:opacity-40" disabled={agotado}>
              {agotado ? 'No disponible' : 'Comprar por WhatsApp'}
            </button> */}
            <ShareButtons url={url} productName={product.name} waMessage={waMessage} />
          </div>
        </div>
      </div>
    </main>
  );
}
        
