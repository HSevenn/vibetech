// app/admin/productos/nuevo/page.tsx
import { createProduct } from '@/lib/admin/products';
import type { Category } from '@/lib/products';

const CATS: { key: Category; label: string }[] = [
  { key: 'tecnologia', label: 'Tecnología' },
  { key: 'estilo', label: 'Estilo' },
  { key: 'hogar', label: 'Hogar' },
  { key: 'otros', label: 'Otros' },
];

export default function NewProductPage() {
  async function onCreate(formData: FormData) {
    'use server';

    await createProduct({
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || ''),
      price_cents: Number(formData.get('price_cents') || 0),
      old_price_cents: formData.get('old_price_cents')
        ? Number(formData.get('old_price_cents'))
        : null,
      imageUrl: String(formData.get('imageUrl') || ''),
      category: (String(formData.get('category') || 'tecnologia') as Category),
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>

      <form action={onCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input type="text" name="name" className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" name="slug" className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" className="textarea" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio (centavos)</label>
            <input type="number" name="price_cents" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio anterior (centavos)</label>
            <input type="number" name="old_price_cents" className="input" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen principal (URL pública)</label>
          <input type="text" name="imageUrl" className="input" />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select name="category" className="select">
            {CATS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Podrás editarla luego desde “Editar producto”.
          </p>
        </div>

        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}