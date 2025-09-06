
import Link from 'next/link';

// app/productos/page.tsx
import { fetchProducts } from '@/lib/products';
function formatPrice(cents: number) {
  return cents.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}

export default async function ProductosPage({ searchParams }: { searchParams?: { order?: string } }) {
  const order = (searchParams?.order as 'price_asc'|'price_desc'|'newest'|undefined) ?? 'newest';
  const products = await fetchProducts({ order });

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <Link key={p.id} href={`/productos/${p.slug}`} className="rounded-xl border p-4">
            {Array.isArray(p.images) && p.images[0] && (
              <img
                src={p.images[0].startsWith('http') ? p.images[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${p.images[0]}`}
                alt={p.name}
                className="aspect-[4/3] w-full object-cover rounded-md mb-3"
                loading="lazy"
              />
            )}
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm opacity-80 line-clamp-2">{p.description}</p>

           <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold">
                {formatPrice(p.price_cents)}
              </span>
              {p.old_price_cents && (
                <span className="text-sm line-through opacity-60">
                  {formatPrice(p.old_price_cents)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
