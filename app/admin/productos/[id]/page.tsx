// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const p = await getProductById(params.id);

  async function onSave(formData: FormData) {
    'use server';
    const id = params.id;
    await updateProduct(id, {
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || ''),
      price_cents: Number(formData.get('price_cents') || 0),
      old_price_cents: formData.get('old_price_cents')
        ? Number(formData.get('old_price_cents'))
        : null,
      imageUrl: String(formData.get('imageUrl') || ''),
      visible: formData.get('visible') === 'on',
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Editar producto</h1>

      <form action={onSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            defaultValue={p?.name ?? ''}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={p?.slug ?? ''}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
            defaultValue={p?.description ?? ''}
            className="textarea w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Precio (centavos)
            </label>
            <input
              type="number"
              name="price_cents"
              defaultValue={p?.price_cents ?? 0}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Precio anterior (centavos)
            </label>
            <input
              type="number"
              name="old_price_cents"
              defaultValue={p?.old_price_cents ?? ''}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen principal (URL pública)
          </label>
          <input
            type="text"
            name="imageUrl"
            defaultValue={p?.imageUrl ?? ''}
            className="input w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={p?.visible ?? true}
          />
          <span className="text-sm">Visible</span>
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
}
