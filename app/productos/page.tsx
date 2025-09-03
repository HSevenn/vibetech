
// app/productos/page.tsx
import { fetchProducts } from '@/lib/products';

export default async function ProductosPage() {
  const products = await fetchProducts();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <article key={p.id} className="rounded-xl border p-4">
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

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold">
                ${(p.price_cents / 100).toLocaleString()}
              </span>
              {p.old_price_cents && (
                <span className="text-sm line-through opacity-60">
                  ${(p.old_price_cents / 100).toLocaleString()}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
