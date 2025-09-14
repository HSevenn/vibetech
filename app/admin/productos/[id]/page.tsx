// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';
import type { Category } from '@/lib/products';

const CATS: { key: Category; label: string }[] = [
  { key: 'tecnologia', label: 'Tecnología' },
  { key: 'estilo', label: 'Estilo' },
  { key: 'hogar', label: 'Hogar' },
  { key: 'otros', label: 'Otros' },
];

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const p = await getProductById(params.id);

  async function onSave(formData: FormData) {
    'use server';

    const parseImages = (raw: string): string[] =>
      raw
        .split(/\r?\n|,/)
        .map(s => s.trim())
        .filter(Boolean);

    await updateProduct(params.id, {
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || ''),
      price_cents: Number(formData.get('price_cents') || 0),
      old_price_cents: formData.get('old_price_cents')
        ? Number(formData.get('old_price_cents'))
        : null,
      images: parseImages(String(formData.get('images') || '')),
      category: (String(formData.get('category') || p?.category || 'tecnologia') as Category),
    });
  }

  const imagesText = Array.isArray(p.images) && p.images.length
    ? p.images.join('\n')
    : (p.imageUrl ?? '');

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Editar producto</h1>

      <form action={onSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input type="text" name="name" defaultValue={p?.name ?? ''} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" name="slug" defaultValue={p?.slug ?? ''} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" defaultValue={p?.description ?? ''} className="textarea w-full" rows={4}/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio (centavos)</label>
            <input type="number" name="price_cents" defaultValue={p?.price_cents ?? 0} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio anterior (centavos)</label>
            <input type="number" name="old_price_cents" defaultValue={p?.old_price_cents ?? ''} className="input w-full" />
          </div>
        </div>

        {/* Varias imágenes */}
        <div>
          <label className="block text-sm font-medium mb-1">Imágenes (una URL por línea)</label>
          <textarea
            name="images"
            defaultValue={imagesText}
            className="textarea w-full"
            rows={4}
            placeholder={`https://.../foto1.jpg\nproducts/foto2.jpg`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Pega URLs públicas de Supabase o rutas relativas (<code>products/archivo.jpg</code>).
          </p>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select name="category" defaultValue={p?.category ?? 'tecnologia'} className="select">
            {CATS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}