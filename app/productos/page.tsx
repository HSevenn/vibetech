// app/productos/page.tsx
import ProductCard from '@/components/ProductCard';
import { fetchProductsByOrder, type Product } from '@/lib/products';

// Si quieres que se regenere en cada request
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Puedes cambiar 'newest' por 'price_asc' o 'price_desc'
  const items: Product[] = await fetchProductsByOrder('newest');

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Sin productos por ahora.</p>
      ) : (
        <div className="grid-products">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}
