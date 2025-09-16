import ProductCard from '@/components/ProductCard';
import { fetchHomepageProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function HomeFeaturedGrid() {
  const products = await fetchHomepageProducts(6);

  return (
    <section className="mt-8">
      {/* Si ya tienes un título propio en Home, puedes quitar este h2 */}
      {/* <h2 className="text-2xl font-bold mb-4">Destacados</h2> */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
