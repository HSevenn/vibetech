
import Link from 'next/link';
import { fetchProductBySlug, publicUrl } from '@/lib/products';

function formatCOP(cents: number) {
  return (cents || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await fetchProductBySlug(params.slug);
  if (!p) return { title: 'Producto no encontrado • VibeTech' };
  return { title: `${p.name} • VibeTech` };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await fetchProductBySlug(params.slug);
  if (!p) return null;

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/productos/${p.slug}`;
  const shareText = encodeURIComponent(`Mira este producto: ${p.name}`);
  const shareUrl = encodeURIComponent(pageUrl);
  const mainImg = Array.isArray(p.images) && p.images[0]
    ? (p.images[0].startsWith('http') ? p.images[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${p.images[0]}`)
    : null;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {mainImg ? (
            <img src={mainImg} alt={p.name} className="w-full rounded-xl border object-cover" />
          ) : (
            <div className="aspect-video w-full rounded-xl border" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          {p.description && <p className="mt-2 opacity-80">{p.description}</p>}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatCOP(p.price_cents)}</span>
            {p.old_price_cents ? <span className="text-base line-through opacity-60">{formatCOP(p.old_price_cents)}</span> : null}
          </div>

          <div className="mt-5 flex gap-3">
            <a className="rounded-md border px-3 py-2 text-sm"
               href={`https://wa.me/573014564861?text=${encodeURIComponent(`Hola! Estoy interesado en: ${p.name} — ${pageUrl}`)}`}
               target="_blank" rel="noopener noreferrer">Comprar por WhatsApp</a>
            <Link href="/productos" className="rounded-md border px-3 py-2 text-sm">Volver</Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a className="rounded border px-3 py-2 text-sm"
               href={`https://wa.me/?text=${encodeURIComponent(`Mira este producto: ${p.name} — ${pageUrl}`)}`}
               target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="rounded border px-3 py-2 text-sm"
               href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
               target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className="rounded border px-3 py-2 text-sm"
               href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
               target="_blank" rel="noopener noreferrer">X</a>
            <a className="rounded border px-3 py-2 text-sm"
               href={`https://www.instagram.com/?url=${shareUrl}`}
               target="_blank" rel="noopener noreferrer">Instagram</a>
            <button onClick={() => navigator.clipboard.writeText(pageUrl)}
              className="rounded border px-3 py-2 text-sm">Copiar link</button>
          </div>
        </div>
      </div>
    </main>
  );
}
