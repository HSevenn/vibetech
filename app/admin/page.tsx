import { fetchProducts } from '@/lib/products';
import { createProduct, deleteProduct } from './actions';

export default async function AdminPage() {
  const products = await fetchProducts();
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Productos</h1>
      <form action={createProduct} className="grid gap-3 mb-10" encType="multipart/form-data">
        <input name="name" placeholder="Nombre" className="border px-2 py-1" required />
        <input name="slug" placeholder="slug" className="border px-2 py-1" required />
        <input name="price_cents" placeholder="Precio en centavos" type="number" className="border px-2 py-1" required />
        <input type="file" name="image" />
        <button className="px-4 py-2 border">Crear</button>
      </form>
      <div className="grid gap-3">
        {products.map(p => (
          <form key={p.id} action={async () => { 'use server'; await deleteProduct(p.id); }} className="border p-3 flex justify-between">
            <span>{p.name}</span>
            <button className="border px-2 py-1">Eliminar</button>
          </form>
        ))}
      </div>
    </main>
  );
}
