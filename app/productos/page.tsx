
import { listProducts } from '@/lib/products-db';
import ProductsFilters from '@/components/ProductsFilters';

export const metadata = {
  title: 'Productos • VibeTech',
  description: 'Catálogo con filtros y orden por precio'
};

export default function ProductosPage(){
  const items = listProducts();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Todos los productos</h1>
      <ProductsFilters items={items} />
    </div>
  );
}
