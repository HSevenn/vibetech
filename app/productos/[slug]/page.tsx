import { fetchProductBySlug } from '@/lib/products';
import { headers } from 'next/headers';

function formatPrice(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

function getBaseUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, '');
  const h = headers();
  const host = h.get('host') || 'localhost:3000';
  const proto = (h.get('x-forwarded-proto') || 'https');
  return `${proto}://${host}`;
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return <main className="container mx-auto px-4 py-10"><h1>Producto no encontrado</h1></main>;
  }

  const url = `${getBaseUrl()}/productos/${product.slug}`;
  const shareText = encodeURIComponent(`${product.name} – ${formatPrice(product.price_cents)} en VibeTech`);
  const shareUrl = encodeURIComponent(url);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg object-cover" />
          ) : (
            <div className="aspect-[4/3] w-full bg-neutral-800 rounded" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="opacity-80 mb-4">{product.description}</p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(product.price_cents)}</span>
            {!!product.old_price_cents && (
              <span className="line-through opacity-60">{formatPrice(product.old_price_cents)}</span>
            )}
          </div>
          <div className="flex gap-3">
            <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank">WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank">X</a>
          </div>
        </div>
      </div>
    </main>
  );
}
