// app/productos/page.tsx
import Link from 'next/link';
import { fetchProductsByOrder } from '@/lib/products';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const items = await fetchProductsByOrder('newest'); // 'newest' | 'price_asc' | 'price_desc'

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <article key={p.id} className="card">
            <img
              src={p.imageUrl || '/og-default.jpg'}
              alt={p.name}
              className="h-48 w-full object-cover"
            />
            <div className="card-body">
              <h3 className="text-base font-semibold">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">
                  {p.old_price_cents ? (
                    <span className="mr-2 text-neutral-400 line-through">
                      {formatCOP(p.old_price_cents)}
                    </span>
                  ) : null}
                  <span className="font-semibold">{formatCOP(p.price_cents)}</span>
                </div>
                <Link href={`/productos/${p.slug}`} className="btn btn-primary">
                  Ver producto
                </Link>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <p className="text-neutral-500">Sin productos por ahora.</p>
        )}
      </div>
    </main>
  );
}
