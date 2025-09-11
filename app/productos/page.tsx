// app/productos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchProductsByOrder } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { order?: 'newest' | 'price_asc' | 'price_desc' };
}) {
  const order = (searchParams?.order ?? 'newest') as
    | 'newest'
    | 'price_asc'
    | 'price_desc';

  const items = await fetchProductsByOrder(order);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>

        <div className="text-sm">
          <Link
            href="/productos?order=newest"
            className={`mr-3 underline-offset-4 ${
              order === 'newest' ? 'font-semibold' : 'hover:underline'
            }`}
          >
            Nuevos
          </Link>
          <Link
            href="/productos?order=price_asc"
            className={`mr-3 underline-offset-4 ${
              order === 'price_asc' ? 'font-semibold' : 'hover:underline'
            }`}
          >
            Precio ↑
          </Link>
          <Link
            href="/productos?order=price_desc"
            className={`underline-offset-4 ${
              order === 'price_desc' ? 'font-semibold' : 'hover:underline'
            }`}
          >
            Precio ↓
          </Link>
        </div>
      </div>

      <div className="grid-products">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}
