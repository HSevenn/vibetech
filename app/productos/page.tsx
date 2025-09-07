// app/productos/page.tsx
import Link from 'next/link';
import { fetchProducts } from '@/lib/products';

function formatPrice(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

type Order = 'price_asc' | 'price_desc' | 'newest';

export default async function ProductosPage({
  searchParams,
}: {
  searchParams?: { order?: string };
}) {
  // Valida el parámetro ?order=
  const raw = searchParams?.order;
  const order: Order =
    raw === 'price_asc' || raw === 'price_desc' || raw === 'newest'
      ? raw
      : 'newest';

  const products = await fetchProducts({ order });

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Encabezado con título y filtros */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-3xl font-bold">Productos</h1>

        {/* Desktop: botones */}
        <div className="hidden sm:flex gap-2 text-sm">
          <Link
            href="/productos?order=newest"
            className={`px-3 py-1 rounded border ${
              order === 'newest'
                ? 'border-neutral-500 text-neutral-100'
                : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Más nuevos
          </Link>
          <Link
            href="/productos?order=price_asc"
            className={`px-3 py-1 rounded border ${
              order === 'price_asc'
                ? 'border-neutral-500 text-neutral-100'
                : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Precio ↑
          </Link>
          <Link
            href="/productos?order=price_desc"
            className={`px-3 py-1 rounded border ${
              order === 'price_desc'
                ? 'border-neutral-500 text-neutral-100'
                : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Precio ↓
          </Link>
        </div>

        {/* Móvil: select + aplicar */}
        <form action="/productos" className="sm:hidden flex items-center gap-2">
          <select
            name="order"
            defaultValue={order}
            className="rounded border border-neutral-800 bg-transparent px-3 py-1 text-sm"
          >
            <option value="newest">Más nuevos</option>
            <option value="price_asc">Precio ↑</option>
            <option value="price_desc">Precio ↓</option>
          </select>
          <button className="px-3 py-1 rounded border border-neutral-800 text-sm">
            Aplicar
          </button>
        </form>
      </div>

      {/* Grid de productos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          // % de descuento si hay precio anterior válido
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
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="aspect-[4/3] w-full object-cover rounded-md mb-3"
                loading="lazy"
              />
            )}

            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm opacity-80 line-clamp-2">{p.description}</p>

            {/* 💰 Precio + tachado + % OFF */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {formatPrice(p.price_cents)}
              </span>
              {p.old_price_cents && (
                <span className="text-sm line-through opacity-60">
                  {formatPrice(p.old_price_cents)}
                </span>
              )}
              {discount !== null && discount > 0 && (
                <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-400">
                  {discount}% OFF
                </span>
              )}
            </div>
          </Link>
        );
      })}
      </div>
    </main>
  );
}
