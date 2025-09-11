// app/productos/[slug]/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/products';
import ShareButtons from '@/components/ShareButtons';
import ProductGallery from '@/components/ProductGallery';

const BASE = 'https://www.vibetechvibe.com';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

type Props = { params: { slug: string } };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'Este producto no existe en VibeTech.',
    };
  }

  const canonical = `${BASE}/productos/${product.slug}`;
  return {
    title: product.name,
    description: product.description || 'Descubre este producto en VibeTech.',
    alternates: { canonical },
  };
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
  const discount =
    product.old_price_cents && product.old_price_cents > product.price_cents
      ? Math.max(0, Math.round(100 - (product.price_cents / product.old_price_cents) * 100))
      : null;

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [`${BASE}/og-default.jpg`];

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description || "",
    sku: product.id,
    brand: { "@type": "Brand", name: "VibeTech" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "COP",
      price: (product.price_cents / 100).toFixed(0),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      {/* 👇 JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galería */}
        <div>
          <ProductGallery images={images} alt={product.name} />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">{product.description}</p>

          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl font-bold">{formatCOP(product.price_cents)}</span>
            {product.old_price_cents && (
              <span className="text-sm line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
            {discount !== null && discount > 0 && (
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-500">
                {discount}% OFF
              </span>
            )}
          </div>

          <ShareButtons
            url={url}
            productName={product.name}
            waMessage={`Hola, quiero comprar el producto "${product.name}"\nPrecio: ${formatCOP(
              product.price_cents
            )}\n${url}`}
          />
        </div>
      </div>
    </main>
  );
}
