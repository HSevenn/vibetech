// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const p = await getProductById(params.id);

  async function onSubmit(formData: FormData) {
    'use server';

    const input = {
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || ''),
      price_cents: Number(formData.get('price_cents') || 0),
      old_price_cents: formData.get('old_price_cents')
        ? Number(formData.get('old_price_cents'))
        : null,
      imageUrl: String(formData.get('imageUrl') || ''),
      visible: formData.get('visible') ? true : false,
    };

    await updateProduct(params.id, input);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Editar producto</h1>

      <form action={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre</label>
          <input
            type="text"
            name="name"
            defaultValue={p.name}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={p.slug}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Descripción</label>
          <textarea
            name="description"
            defaultValue={p.description || ''}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Precio</label>
          <input
            type="number"
            name="price_cents"
            defaultValue={p.price_cents}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Precio anterior</label>
          <input
            type="number"
            name="old_price_cents"
            defaultValue={p.old_price_cents ?? ''}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Imagen (URL)</label>
          <input
            type="text"
            name="imageUrl"
            defaultValue={p.imageUrl || ''}
            className="input input-bordered w-full"
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={p.visible ?? true}
          />
          Visible
        </label>

        <div>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  );
}
