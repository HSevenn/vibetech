// app/admin/productos/nuevo/page.tsx
import { createProduct } from '@/lib/admin/products';

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function onCreate(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '').trim();
  const slug = slugify(String(formData.get('slug') || name));
  await createProduct({
    name,
    slug,
    description: String(formData.get('description') || ''),
    price_cents: Number(formData.get('price_cents') || 0),
    old_price_cents: Number(formData.get('old_price_cents') || 0) || null,
    imageUrl: String(formData.get('imageUrl') || '') || null,
    visible: formData.get('visible') === 'on',
  });
}

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Nuevo producto</h1>
      <form action={onCreate} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input name="name" className="input w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug (opcional)</label>
          <input name="slug" className="input w-full" placeholder="se genera si lo dejas vacío" />
        </div>
        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea name="description" className="textarea w-full" rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Precio (COP)</label>
            <input name="price_cents" type="number" min="0" className="input w-full" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Precio anterior (COP)</label>
            <input name="old_price_cents" type="number" min="0" className="input w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Imagen principal (URL)</label>
          <input name="imageUrl" className="input w-full" placeholder="https://..." />
          <p className="text-xs text-neutral-500 mt-1">Luego añadiremos uploader. Por ahora pega la URL (Supabase Storage o dominio propio).</p>
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked /> Visible
        </label>

        <div className="pt-2">
          <button className="btn btn-primary">Crear</button>
          <a href="/admin/productos" className="btn btn-outline ml-2">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
