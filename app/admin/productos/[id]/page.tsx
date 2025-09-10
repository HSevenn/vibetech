// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const p = await getProductById(params.id);

  async function onUpdate(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '').trim();
    const slug = slugify(String(formData.get('slug') || name));
    await updateProduct(p.id, {
      name,
      slug,
      description: String(formData.get('description') || ''),
      price_cents: Number(formData.get('price_cents') || 0),
      old_price_cents: Number(formData.get('old_price_cents') || 0) || null,
      imageUrl: String(formData.get('imageUrl') || '') || null,
      visible: formData.get('visible') === 'on',
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Editar producto</h1>
      <form action={onUpdate} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input name="name" className="input w-full" defaultValue={p.name} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input name="slug" className="input w-full" defaultValue={p.slug} />
        </div>
        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea name="description" className="textarea w-full" rows={4} defaultValue={p.description || ''} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Precio (COP)</label>
            <input name="price_cents" type="number" min="0" className="input w-full" defaultValue={p.price_cents} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Precio anterior (COP)</label>
            <input name="old_price_cents" type="number" min="0" className="input w-full" defaultValue={p.old_price_cents || ''} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Imagen principal (URL)</label>
          <input name="imageUrl" className="input w-full" defaultValue={p.imageUrl || ''} />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked={p.visible ?? true} /> Visible
        </label>

        <div className="pt-2">
          <button className="btn btn-primary">Guardar</button>
          <a href="/admin/productos" className="btn btn-outline ml-2">Volver</a>
        </div>
      </form>
    </div>
  );
}
