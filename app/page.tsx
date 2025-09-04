// app/page.tsx
import Link from 'next/link'
import { fetchLatestProducts, formatPrice, publicUrl } from '@/lib/products'

export default async function HomePage() {
  const latest = await fetchLatestProducts(1)
  const featured = latest[0]

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="grid gap-10 lg:grid-cols-2 items-center">
        {/* Texto grande a la izquierda */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            VibeTech —<br />
            <span className="opacity-80">Tecnología que vibra</span><br />
            contigo
          </h1>

          <p className="mt-6 text-lg opacity-80 max-w-xl">
            Catálogo minimalista y enfocado a conversión. Productos seleccionados,
            asistencia directa por WhatsApp y novedades constantes para tu día a día.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/productos"
              className="rounded-md bg-white text-black px-5 py-3 font-semibold hover:opacity-90"
            >
              Ver productos
            </Link>

            <Link
              href="/#contacto"
              className="rounded-md border border-white/30 px-5 py-3 font-semibold hover:bg-white/10"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Tarjeta grande/slide a la derecha (SIN botones dentro) */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          {featured ? (
            <article className="rounded-2xl overflow-hidden">
              <Link href={`/productos/${featured.slug}`} className="block">
                <img
                  src={featured.imageUrl}
                  alt={featured.name}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover rounded-2xl"
                />
              </Link>

              <div className="px-1">
                <h3 className="mt-4 text-xl font-semibold">{featured.name}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{featured.description}</p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold">{formatPrice(featured.price_cents)}</span>
                  {featured.old_price_cents && (
                    <span className="text-sm line-through opacity-60">
                      {formatPrice(featured.old_price_cents)}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ) : (
            <div className="aspect-[16/10] rounded-xl bg-white/5 grid place-items-center">
              <span className="opacity-60">Sin productos aún</span>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}