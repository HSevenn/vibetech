// app/productos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchProductsByOrder, type Category } from '@/lib/products';

export const dynamic = 'force-dynamic';

const CATS: { key?: Category; label: string }[] = [
  { key: undefined, label: 'Todos' },
  { key: 'tecnologia', label: 'Tecnología' },
  { key: 'estilo', label: 'Estilo' },
  { key: 'hogar', label: 'Hogar' },
  { key: 'otros', label: 'Otros' },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { order?: 'newest' | 'price_asc' | 'price_desc'; cat?: string };
}) {
  const order = (searchParams?.order ?? 'newest') as 'newest' | 'price_asc' | 'price_desc';
  const rawCat = (searchParams?.cat ?? '').toLowerCase();

  const category = (['tecnologia', 'estilo', 'hogar', 'otros'] as Category[]).includes(
    rawCat as Category
  )
    ? (rawCat as Category)
    : undefined;

  const items = await fetchProductsByOrder(order, category);

  // helpers de URL
  const urlFor = (cat?: Category, ord?: typeof order) => {
    const params = new URLSearchParams();
    if (cat) params.set('cat', cat);
    if (ord) params.set('order', ord);
    const qs = params.toString();
    return qs ? `/productos?${qs}` : '/productos';
  };

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Header: título + orden */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>

        <div className="text-sm">
          <Link
            href={urlFor(category, 'newest')}
            className={`mr-3 underline-offset-4 ${
              order === 'newest' ? 'font-semibold' : 'hover:underline'
            }`}
          >
            Nuevos
          </Link>
          <Link
            href={urlFor(category, 'price_asc')}
            className={`mr-3 underline-offset-4 ${
              order === 'price_asc' ? 'font-semibold' : 'hover:underline'
            }`}
          >
            Precio ↑
          </Link>
          <Link
            href={urlFor(category, 'price_desc')}
            className={`underline-offset-4 ${
              order === 'price_desc' ? 'font-semibold' : 'hover:underline'
            }`}
          >
            Precio ↓
          </Link>
        </div>
      </div>

      {/* Tabs de categorías */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATS.map(({ key, label }) => {
          const active = key === category || (!key && category === undefined);
          return (
            <Link
              key={label}
              href={urlFor(key, order)}
              className={`rounded-full px-3 py-1 text-sm border transition ${
                active
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid-products">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}

        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No hay productos en esta categoría.</p>
        )}
      </div>
    </main>
  );
}