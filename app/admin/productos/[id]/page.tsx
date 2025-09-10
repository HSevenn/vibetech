// app/admin/productos/[id]/page.tsx
import { getProductById, updateProduct } from '@/lib/admin/products';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  old_price_cents: number | null;
  imageUrl: string | null;
  images?: string[] | null;
  visible: boolean; // 👈 faltaba en tu tipo
};

type Props = { params: { id: string } };

export default async function EditProductPage({ params }: Props) {
  const p = (await getProductById(params.id)) as AdminProduct;

  async function save(formData: FormData) {
    'use server';

    const name = String(formData.get('name') ?? '').trim();
    const slug = String(formData.get('slug') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim() || null;
    const price_cents = Number(formData.get('price_cents') ?? 0) || 0;
    const old_price_raw = formData.get('old_price_cents');
    const old_price_cents =
      old_price_raw === null || old_price_raw === ''
        ? null
        : Number(old_price_raw);
    const imageUrl =
      (String(formData.get('imageUrl') ?? '').trim() || null) as string | null;

    // Checkbox: viene como "on" si está marcado, o null si no
    const visible = formData.get('visible') === 'on';

    await updateProduct(p.id, {
      name,
      slug,
      description,
      price_cents,
      old_price_cents,
      imageUrl,
      visible,
    });

    redirect('/admin/productos');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar producto</h1>

      <form action={save} className="grid gap-4 max-w-2xl">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Nombre</span>
          <input
            name="name"
            defaultValue={p.name}
            required
            className="input"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Slug</span>
          <input
            name="slug"
            defaultValue={p.slug}
            required
            className="input"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Descripción</span>
          <textarea
            name="description"
            defaultValue={p.description ?? ''}
            rows={5}
            className="textarea"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Precio (centavos)</span>
            <input
              name="price_cents"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={p.price_cents}
              className="input"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Precio anterior (centavos)</span>
            <input
              name="old_price_cents"
              type="number"
              min={0}
              step={1}
              defaultValue={p.old_price_cents ?? ''}
              className="input"
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Imagen principal (URL pública)</span>
          <input
            name="imageUrl"
            defaultValue={p.imageUrl ?? ''}
            placeholder="/products/mi-imagen.jpg o URL absoluta"
            className="input"
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="visible"
            // Si en DB no existiera o es null, lo mostramos marcado.
            defaultChecked={p.visible !== false}
          />
          Visible
        </label>

        <div className="pt-2 flex gap-3">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <a href="/admin/productos" className="btn btn-outline">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
