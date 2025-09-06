// app/page.tsx
import site from '@/data/site.json';
import HeroSlider from '@/components/HeroSlider';
import Link from 'next/link';
import { fetchLatestProducts, fetchFeaturedProducts, publicUrl } from '@/lib/products';

export const dynamic = 'force-dynamic';

// Formateador de precios en COP
function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

export default async function Home() {
  // productos recientes (grid)
  const latest = await fetchLatestProducts(6);
  // productos destacados para el slider
  const featured = await fetchFeaturedProducts(5);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Hero izquierdo (nombre + slogan + CTA) */}
      <section>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          {site.brandName} — <span className="text-neutral-400">{site.tagline}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Catálogo minimalista y enfocado a conversión. Productos seleccionados, asistencia directa por WhatsApp y novedades constantes.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/productos" className="btn btn-primary">Ver productos</Link>
          <Link href="/contacto" className="btn btn-outline">Contacto</Link>
        </div>
      </section>

      {/* Slider derecho (destacados) */}
      <section>
        <HeroSlider/>
      </section>

      {/* Grid de últimos productos */}
      <section className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-semibold">Productos</h2>
        <div className="grid-products">
          {latest.map((p: any) => {
            // si tu fetchLatestProducts ya devuelve imageUrl, úsalo; si no, seguimos calculándola
            const cover =
              (p.imageUrl as string | null) ??
              (Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : '');

            return (
              <Link
                key={p.id}
                href={`/productos/${p.slug}`}
                className="rounded-xl border p-4 block hover:bg-neutral-900/40"
              >
                {cover && (
                  <img
                    src={cover}
                    alt={p.name}
                    className="aspect-[4/3] w-full object-cover rounded-md mb-3"
                    loading="lazy"
                  />
                )}
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{p.description}</p>

                {/* 💰 Precio + (opcional) tachado si hay oferta */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm font-bold">
                    {formatCOP(p.price_cents)}
                  </span>
                  {p.old_price_cents && (
                    <span className="text-xs line-through opacity-60">
                      {formatCOP(p.old_price_cents)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
