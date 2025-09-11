// app/productos/page.tsx
import Link from 'next/link';
import { fetchProductsByOrder } from '@/lib/products';
import { formatCOP } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { order?: 'price_asc' | 'price_desc' | 'newest' | string };
}) {
  const order =
    (searchParams?.order as 'price_asc' | 'price_desc' | 'newest') || 'newest';

  let products: Awaited<ReturnType<typeof fetchProductsByOrder>> = [];
  try {
    products = await fetchProductsByOrder(order);
  } catch (err) {
    console.error('⚠️ fetchProductsByOrder failed:', err);
    products = [];
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>

        <form>
          <select
            name="order"
            defaultValue={order}
            className="select"
            onChange={(e) => e.currentTarget.form?.submit()}
          >
            <option value="newest">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </form>
      </div>

      <div className="grid-products">
        {products.map((p) => {
          const img = p.imageUrl || '/og-default.jpg';
          const name = p.name || 'Producto';
          const desc = p.description || '';

          return (
            <article key={p.id} className="card">
              {img ? (
                <img
                  src={img}
                  alt={name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 w-full bg-neutral-200 dark:bg-neutral-800" />
              )}

              <div className="card-body">
                <h3 className="text-base font-semibold">{name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {desc}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm">
                    {p.old_price_cents ? (
                      <span className="mr-2 text-neutral-400 line-through">
                        {formatCOP(p.old_price_cents)}
                      </span>
                    ) : null}
                    <span className="font-semibold">
                      {formatCOP(p.price_cents || 0)}
                    </span>
                  </div>
                  <Link
                    href={`/productos/${p.slug}`}
                    className="btn btn-primary"
                  >
                    Ver producto
                  </Link>
                </div>
              </div>
            </article>
          );
        })}

        {products.length === 0 && (
          <p className="text-neutral-500">No hay productos disponibles.</p>
        )}
      </div>
    </main>
  );
}
