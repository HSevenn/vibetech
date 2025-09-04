// app/productos/[slug]/page.tsx
import Link from 'next/link';
import { fetchProductBySlug } from '@/lib/products';

function formatPrice(cents: number) {
  return (cents).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p>Producto no encontrado.</p>
        <Link className="mt-4 inline-flex rounded-md border px-4 py-2" href="/productos">Volver</Link>
      </main>
    );
  }

  const image = product.imageUrls?.[0] ?? product.imageUrl;
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/productos/${product.slug}`;

  const wa = `https://wa.me/573001234567?text=${encodeURIComponent(`Hola, me interesa: ${product.name} - ${pageUrl}`)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(product.name)}`;
  const ig = `https://www.instagram.com/?url=${encodeURIComponent(pageUrl)}`;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="rounded-xl overflow-hidden border bg-black/10">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-auto object-cover" />
          ) : (
            <div className="aspect-[4/3] w-full" />
          )}
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-base opacity-80">{product.description}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price_cents)}</span>
            {!!product.old_price_cents && (
              <span className="text-base line-through opacity-60">{formatPrice(product.old_price_cents)}</span>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <a className="rounded-md bg-white text-black px-4 py-2 font-medium" href={wa} target="_blank">Comprar por WhatsApp</a>
            <Link className="rounded-md border px-4 py-2 font-medium" href="/productos">Volver</Link>
          </div>

          {/* Botones sociales transparentes */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} target="_blank" className="rounded-md border px-4 py-2">WhatsApp</a>
            <a href={fb} target="_blank" className="rounded-md border px-4 py-2">Facebook</a>
            <a href={tw} target="_blank" className="rounded-md border px-4 py-2">X</a>
            <a href={ig} target="_blank" className="rounded-md border px-4 py-2">Instagram</a>
            <button
              onClick={() => navigator.clipboard?.writeText(pageUrl)}
              className="rounded-md border px-4 py-2"
            >
              Copiar link
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
