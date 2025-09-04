
// app/admin/page.tsx
import { createProduct } from './actions';

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Productos</h1>

      <form action={createProduct} className="grid gap-3 mb-10" encType="multipart/form-data">
        <input name="name" placeholder="Nombre" className="border px-2 py-1" required />
        <input name="slug" placeholder="slug" className="border px-2 py-1" required />
        <textarea name="description" placeholder="Descripción" className="border px-2 py-1" />

        <input name="price_cents" placeholder="Precio en centavos" type="number" className="border px-2 py-1" required />
        <input name="old_price_cents" placeholder="Precio anterior (centavos)" type="number" className="border px-2 py-1" />
        <input name="stock" placeholder="Stock" type="number" className="border px-2 py-1" defaultValue={0} />

        <input name="images" type="file" accept="image/*" multiple className="border px-2 py-1" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked /> Activo
        </label>

        <button className="bg-blue-600 text-white rounded px-4 py-2 w-max">
          Guardar
        </button>
      </form>
    </main>
  );
}
