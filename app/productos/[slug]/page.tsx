// app/productos/[slug]/page.tsx
import Link from 'next/link';
import { fetchProductBySlug } from '@/lib/products';
import SocialButtons from '@/components/SocialButtons';

export const dynamic = 'force-dynamic';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
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

  // URL absoluta del producto para compartir
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://vibetechvibe.com';
  const url = `${base}/productos/${product.slug}`;

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
          {product.description && (
            <p className="mb-4 text-neutral-600 dark:text-neutral-300">
              {product.description}
            </p>
          )}

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatCOP(product.price_cents)}</span>
            {product.old_price_cents && (
              <span className="text-lg line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 mb-4">
            <Link href="/productos" className="btn btn-outline">
              Volver
            </Link>
          </div>

          {/* Botones transparentes con iconos (compartir + comprar por WA) */}
          <SocialButtons
            productName={product.name}
            productUrl={url}
            whatsappPhone="3014564861"
            instagramUrl="https://www.instagram.com/vibetechcol"
            className="mt-2"
          />
        </div>
      </div>
    </main>
  );
}
