import Link from 'next/link';
import { fetchProductBySlug, publicUrl } from '@/lib/products';

function formatCOP(cents: number) {
  const pesos = cents / 100;
  return pesos.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await fetchProductBySlug(params.slug);
  if (!p) return { title: 'Producto no encontrado • VibeTech' };
  return { title: `${p.name} • VibeTech` };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await fetchProductBySlug(params.slug);
  if (!p) {
    return <main className="container mx-auto px-4 py-10">Producto no encontrado</main>;
  }

  const images: string[] = Array.isArray(p.images) ? p.images : [];
  const urls = images.map((path) => publicUrl(path) || '');
  const main = urls[0] || '';

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/productos/${p.slug}` || '';
  const shareText = encodeURIComponent(`${p.name} - ${formatCOP(p.price_cents)} en VibeTech`);
  const shareUrl = encodeURIComponent(pageUrl);

  return (
    <main className="container mx-auto px-4 py-10">
      <Link href="/productos" className="text-sm opacity-70 hover:opacity-100">← Volver</Link>

      <div className="grid gap-8 md:grid-cols-2 mt-6">
        <div>
          {main ? (
            <img src={main} alt={p.name} className="w-full rounded-lg object-cover" />
          ) : (
            <div className="aspect-[4/3] w-full rounded-lg bg-neutral-800" />
          )}

          {urls.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {urls.slice(1).map((u, i) => (
                <img key={i} src={u} alt={`${p.name} ${i + 2}`} className="w-full aspect-square object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="mt-2 opacity-80">{p.description}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatCOP(p.price_cents)}</span>
            {p.old_price_cents ? (
              <span className="line-through opacity-60">{formatCOP(p.old_price_cents)}</span>
            ) : null}
          </div>

          <p className="mt-2 text-sm opacity-70">Stock: {p.stock}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a className="rounded bg-neutral-800 px-3 py-2 text-sm"
               href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
               target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="rounded bg-neutral-800 px-3 py-2 text-sm"
               href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
               target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className="rounded bg-neutral-800 px-3 py-2 text-sm"
               href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
               target="_blank" rel="noopener noreferrer">X</a>
            <button onClick={() => navigator.clipboard.writeText(pageUrl)}
              className="rounded bg-neutral-800 px-3 py-2 text-sm">Copiar link</button>
          </div>
        </div>
      </div>
    </main>
  );
}
