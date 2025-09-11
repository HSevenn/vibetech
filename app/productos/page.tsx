// app/productos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchProductsByOrder } from '@/lib/products';

export const dynamic = 'force-dynamic';

type Order = 'newest' | 'price_asc' | 'price_desc';

function orderLabel(o: Order) {
  switch (o) {
    case 'price_asc':
      return 'Menor precio';
    case 'price_desc':
      return 'Mayor precio';
    default:
      return 'Nuevos';
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { order?: Order };
}) {
  const order: Order =
    (searchParams.order as Order) || ('newest' as Order);

  const products = await fetchProductsByOrder(order);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>

        {/* Selector de orden simple (links) */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Ordenar:</span>
          {(['newest', 'price_asc', 'price_desc'] as Order[]).map((o) => (
            <Link
              key={o}
              href={`/productos?order=${o}`}
              className={`px-3 py-1 rounded border ${
                o === order
                  ? 'border-neutral-900 dark:border-neutral-100'
                  : 'border-neutral-300 dark:border-neutral-700 text-muted-foreground'
              }`}
            >
              {orderLabel(o)}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid-products">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-10 text-muted-foreground">
          No hay productos para mostrar.
        </p>
      )}
    </main>
  );
}
