// app/page.tsx
import site from '@/data/site.json';
import HeroSlider from '@/components/HeroSlider';
import Link from 'next/link';
import { fetchHomepageProducts, fetchFeaturedProducts, publicUrl } from '@/lib/products';

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
  // 6 de portada (los controlas con homepage_featured / homepage_featured_order)
  const homepage = await fetchHomepageProducts(6);
  // Slider (si lo usas)
  const featured = await fetchFeaturedProducts(5);
  void featured;

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
        <HeroSlider />
      </section>

      {/* Grid de productos principales (control manual de 6) */}
      <section className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-semibold">Productos</h2>
        <div className="grid-products">
          {homepage.map((p) => {
            const cover =
              (p as any).imageUrl ??
              (Array.isArray((p as any).images) && (p as any).images[0]
                ? publicUrl((p as any).images[0])
                : '');

            const discount =
              (p as any).old_price_cents && (p as any).old_price_cents > (p as any).price_cents
                ? Math.max(0, Math.round(100 - ((p as any).price_cents / (p as any).old_price_cents) * 100))
                : null;

            return (
              <Link
                key={(p as any).id}
                href={`/productos/${(p as any).slug}`}
                className="rounded-xl border p-4 block hover:bg-neutral-900/40"
              >
                {/* Envoltura mínima para poder pintar el cartel */}
                <div className="relative">
                  {cover ? (
                    <img
                      src={cover as string}
                      alt={(p as any).name}
                      className="aspect-[4/3] w-full object-cover rounded-md mb-3"
                      loading="lazy"
                    />
                  ) : null}

                  {/* Cartel AGOTADO */}
                  {(p as any).stock === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="backdrop-blur-md bg-black/40 px-6 py-2 rounded-md">
                        <span className="text-white font-bold text-lg tracking-wide">AGOTADO</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <h3 className="font-semibold">{(p as any).name}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{(p as any).description}</p>

                {/* 💰 Precio + (opcional) tachado + badge de descuento */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
                    {formatCOP((p as any).price_cents)}
                  </span>

                  {(p as any).old_price_cents ? (
                    <span className="text-xs line-through text-neutral-500 dark:text-neutral-400">
                      {formatCOP((p as any).old_price_cents)}
                    </span>
                  ) : null}

                  {discount !== null && discount > 0 ? (
                    <span
                      className="
                        ml-1 text-[12px] font-bold px-2 py-0.5 rounded-md
                        bg-emerald-500 text-white shadow-sm
                        dark:bg-emerald-400 dark:text-neutral-900
                      "
                    >
                      {discount}% OFF
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
