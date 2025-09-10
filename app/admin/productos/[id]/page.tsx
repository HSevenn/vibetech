// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null;
  images?: string[] | null;
  visible?: boolean | null; // 👈 opcional
};

export const dynamic = 'force-dynamic';

export default async function AdminProductEditPage({
  params,
}: { params: { id: string } }) {
  const raw = await getProductById(params.id);
  const p = raw as AdminProduct;

  async function onSave(formData: FormData) {
    'use server';
    await updateProduct(p.id, {
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || ''),
      price_cents: Number(formData.get('price_cents') || 0),
      old_price_cents: formData.get('old_price_cents')
        ? Number(formData.get('old_price_cents'))
        : null,
      imageUrl: String(formData.get('imageUrl') || ''),
      // si el checkbox viene marcado => true; si no viene => false
      ...(formData.has('visible') ? { visible: true } : { visible: false }),
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">Editar producto</h1>

      <form action={onSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input name="name" defaultValue={p.name} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input name="slug" defaultValue={p.slug} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea
            name="description"
            defaultValue={p.description ?? ''}
            className="textarea w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Precio (COP)</label>
            <input
              type="number"
              name="price_cents"
              defaultValue={p.price_cents}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Precio anterior (COP)</label>
            <input
              type="number"
              name="old_price_cents"
              defaultValue={p.old_price_cents ?? undefined}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Imagen principal (URL)</label>
          <input
            name="imageUrl"
            defaultValue={p.imageUrl ?? ''}
            className="input w-full"
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={!!p.visible ?? true}
          />
          Visible
        </label>

        <div className="pt-2">
          <button className="btn btn-primary" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
