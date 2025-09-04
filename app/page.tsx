// app/page.tsx
import Link from 'next/link';
import { fetchLatestProducts } from '@/lib/products';

export default async function HomePage() {
  const latest = await fetchLatestProducts(1);
  const featured = latest[0];

  return (
    <main className="container mx-auto px-4 py-16">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="block">VibeTech —</span>
            <span className="block mt-2">Tecnología que vibra</span>
            <span className="block">contigo</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-80 max-w-[52ch]">
            Catálogo minimalista y enfocado a conversión. Productos seleccionados,
            asistencia directa por WhatsApp y novedades constantes para tu día a día.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/productos" className="rounded-md bg-white text-black px-4 py-2 font-medium">Ver productos</Link>
            <Link href="#contacto" className="rounded-md border px-4 py-2 font-medium">Contacto</Link>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-blue-500 to-blue-700 p-6 md:p-10">
          <div className="mb-4 inline-block rounded-md bg-black/40 px-3 py-1 text-sm">
            {featured ? featured.name : 'VibeTech • Demo'}
          </div>
          <div className="aspect-[16/9] w-full rounded-xl bg-black/20 flex items-center justify-center text-4xl md:text-5xl text-white/90">
            VibeTech • Demo 1
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="rounded-lg border px-3 py-2" aria-label="Anterior">←</button>
              <button className="rounded-lg border px-3 py-2" aria-label="Siguiente">→</button>
            </div>
            <div className="flex gap-3">
              <Link
                href={featured ? `/productos/${featured.slug}` : '/productos'}
                className="rounded-md bg-white text-black px-4 py-2 font-medium"
              >
                Ver producto
              </Link>
              <a href="https://wa.me/573001234567" target="_blank" className="rounded-md border px-4 py-2 font-medium">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
