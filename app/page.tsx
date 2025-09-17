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
  // 👇 Ahora controlas manualmente estos 6 con homepage_featured / homepage_featured_order
  const homepage = await fetchHomepageProducts(6);
  // productos destacados para el slider (por si lo usas luego)
  const featured = await fetchFeaturedProducts(5);
  void featured; // evita warning por variable no usada si no la renderizas aún

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
          {homepage.map((p: any) => {
            // Usa imageUrl si viene; si no, construye desde el primer path del bucket
            const cover =
              (p.imageUrl as string | null) ??
              (Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : '');

            // Calcula % de descuento si hay precio anterior válido
            const discount =
              p.old_price_cents && p.old_price_cents > p.price_cents
                ? Math.max(0, Math.round(100 - (p.price_cents / p.old_price_cents) * 100))
                : null;

            return (
              <Link
                key={p.id}
                href={`/productos/${p.slug}`}
                className="rounded-xl border p-4 block hover:bg-neutral-900/40"
              >
                {/* ⬇️ ENVOLTURA mínima para poder dibujar el cartel sin cambiar tu estilo */}
                <div className="relative">
                  {cover && (
                    <img
                      src={cover}
                      alt={p.name}
                      className="aspect-[4/3] w-full object-cover rounded-md mb-3"
                      loading="lazy"
                    />
                  )}

                  {/* Cartel AGOTADO, mismo estilo que en catálogo/detalle */}
                  {p.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="backdrop-blur-md bg-black/40 px-6 py-2 rounded-md">
                        <span className="text-white font-bold text-lg tracking-wide">AGOTADO</span>
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{p.description}</p>

                {/* 💰 Precio + (opcional) tachado + badge de descuento */}
                <div className="mt-2 flex items-center gap-2">
                  {/* Precio actual (más marcado) */}
                  <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
                    {formatCOP(p.price_cents)}
                  </span>

                  {/* Precio anterior más pequeño y discreto */}
                  {p.old_price_cents && (
                    <span className="text-xs line-through text-neutral-500 dark:text-neutral-400">
                      {formatCOP(p.old_price_cents)}
                    </span>
                  )}

                  {/* Badge de descuento con alto contraste */}
                  {discount !== null && discount > 0 && (
                    <span
                      className="
                        ml-1 text-[12px] font-bold px-2 py-0.5 rounded-md
                        bg-emerald-500 text-white shadow-sm
                        dark:bg-emerald-400 dark:text-neutral-900
                      "
                    >
                      {discount}% OFF
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
        </div>
      </section>
    </div>
  );
}
