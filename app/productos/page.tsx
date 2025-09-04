// app/productos/page.tsx
import { fetchProducts } from '@/lib/products';

function formatPrice(cents: number) {
  return (cents).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

export default async function ProductosPage() {
  const products = await fetchProducts();

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Productos</h1>
        {/* Ordenamiento client-side simple */}
        {/* Si ya tienes un componente de filtros, puedes reemplazar esto */}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
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
              <span className="text-lg font-bold">{formatPrice(p.price_cents)}</span>
              {!!p.old_price_cents && (
                <span className="text-sm line-through opacity-60">{formatPrice(p.old_price_cents)}</span>
              )}
            </div>

            <a
              href={`/productos/${p.slug}`}
              className="mt-3 inline-flex rounded-md border px-3 py-2 text-sm font-medium"
            >
              Ver detalle
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
