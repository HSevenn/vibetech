// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';
import { redirect } from 'next/navigation';

type Params = { params: { id: string } };

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: Params) {
  const p = await getProductById(params.id);

  async function onSave(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const slug = String(formData.get('slug') || '');
    const description =
      (formData.get('description')?.toString().trim() || '') || null;

    const price_cents = Number(formData.get('price_cents') || 0) || 0;
    const old_price_centsRaw = formData.get('old_price_cents')?.toString().trim();
    const old_price_cents =
      old_price_centsRaw === '' || old_price_centsRaw == null
        ? null
        : Number(old_price_centsRaw) || null;

    const imageUrl = (formData.get('imageUrl')?.toString().trim() || '') || null;

    await updateProduct(p.id, {
      name,
      slug,
      description,
      price_cents,
      old_price_cents,
      imageUrl,
      // visible no existe en tu tabla; si la agregas, podrías leerlo así:
      // visible: formData.get('visible') === 'on',
    });

    redirect('/admin/productos');
  }

  return (
    <form action={onSave} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <input
          name="name"
          defaultValue={p.name}
          className="w-full input"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Slug</label>
        <input
          name="slug"
          defaultValue={p.slug}
          className="w-full input"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          name="description"
          defaultValue={p.description ?? ''}   // 👈 aquí el fix
          rows={6}
          className="w-full textarea"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Precio (centavos)</label>
          <input
            name="price_cents"
            type="number"
            min={0}
            step={1}
            defaultValue={p.price_cents}
            className="w-full input"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Precio anterior (centavos)</label>
          <input
            name="old_price_cents"
            type="number"
            min={0}
            step={1}
            defaultValue={p.old_price_cents ?? ''}
            className="w-full input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Imagen principal (URL pública)</label>
        <input
          name="imageUrl"
          defaultValue={p.imageUrl ?? ''}      // usa primer elemento de images
          className="w-full input"
          placeholder="products/archivo.jpg"
        />
      </div>

      {/* Si en tu tabla agregas una columna boolean 'visible',
          entonces descomenta este bloque y también en updateProduct */}
      {false && (
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={true} // p.visible !== false
          />
          Visible
        </label>
      )}

      <div className="flex gap-3 pt-2">
        <button className="btn btn-primary" type="submit">Guardar</button>
        <a href="/admin/productos" className="btn btn-outline">Cancelar</a>
      </div>
    </form>
  );
}
