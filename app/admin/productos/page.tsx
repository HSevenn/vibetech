// app/admin/productos/page.tsx
import { listProducts, deleteProduct } from '@/lib/admin/products';

export const dynamic = 'force-dynamic';

type AdminRow = {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  old_price_cents: number | null;
  imageUrl: string | null;
  visible?: boolean | null; // 👈 opcional, por si la columna no existe aún
};

export default async function AdminProductsPage() {
  let items: AdminRow[] = [];

  try {
    items = await listProducts();
  } catch (e) {
    console.error('AdminProductsPage listProducts failed:', e);
    items = [];
  }

  // 🧹 Acción de borrado en el servidor (una sola vez)
  async function onDelete(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    if (!id) return;
    await deleteProduct(id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <a href="/admin/productos/nuevo" className="btn btn-primary">Nuevo</a>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/40">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-right">Precio</th>
              <th className="px-3 py-2 text-center">Visible</th>
              <th className="px-3 py-2 w-40"></th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-neutral-500">{p.slug}</td>
                <td className="px-3 py-2 text-right">
                  {(p.price_cents / 1).toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  })}
                </td>
                <td className="px-3 py-2 text-center">
                  {typeof p.visible === 'boolean' ? (p.visible ? 'Sí' : 'No') : '—'}
                </td>
                <td className="px-3 py-2 text-right">
                  <a className="underline mr-4" href={`/admin/productos/${p.id}`}>
                    Editar
                  </a>

                  {/* Borrar (solo una acción server) */}
                  <form action={onDelete} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-red-600 underline">
                      Borrar
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-neutral-500" colSpan={5}>
                  Sin productos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
