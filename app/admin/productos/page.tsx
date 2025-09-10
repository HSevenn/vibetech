// app/admin/productos/page.tsx
import { listProducts, deleteProduct } from '@/lib/admin/products';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let items: any[] = [];
  let loadError: string | null = null;

  try {
    items = await listProducts();
  } catch (e: any) {
    // Esto evita el 500 y deja un mensaje visible
    console.error('ADMIN /productos -> listProducts failed:', e);
    loadError = 'Error cargando productos. Revisa los Function Logs en Vercel.';
  }

  async function onDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deleteProduct(id);
  }

  if (loadError) {
    return (
      <div className="p-4 border rounded bg-red-50 text-red-700">
        <h1 className="text-lg font-semibold mb-2">Productos</h1>
        <p className="mb-3">{loadError}</p>
        <a href="/admin/productos" className="btn btn-outline">Reintentar</a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Productos</h1>
        <a href="/admin/productos/nuevo" className="btn btn-primary">Nuevo</a>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2">Visible</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">
                  {(p.price_cents / 1).toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  })}
                </td>
                <td className="px-3 py-2">{p.visible ? 'Sí' : 'No'}</td>
                <td className="px-3 py-2 text-right">
                  <a className="underline mr-3" href={`/admin/productos/${p.id}`}>Editar</a>
                  <form action={onDelete} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-red-600 underline" type="submit">Borrar</button>
                  </form>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-neutral-500" colSpan={4}>
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
