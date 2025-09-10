// app/admin/productos/nuevo/page.tsx
import { createProduct } from '@/lib/admin/products';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default function NewProductPage() {
  async function onCreate(formData: FormData) {
    'use server';

    // ✅ leer y normalizar campos
    const name = String(formData.get('name') || '').trim();
    const slug = String(formData.get('slug') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const price_cents = Number(formData.get('price_cents') || 0);
    const old_price_raw = formData.get('old_price_cents');
    const old_price_cents =
      old_price_raw === null || old_price_raw === ''
        ? null
        : Number(old_price_raw);

    const imageUrlRaw = String(formData.get('imageUrl') || '').trim();
    const visible = formData.get('visible') === 'on';

    // ✅ validaciones mínimas (evita excepciones raras en cliente)
    if (!name || !slug || !Number.isFinite(price_cents) || price_cents <= 0) {
      // vuelve a la lista con señal de error (sin romper la página)
      redirect('/admin/productos?error=validacion');
    }

    // permitir rutas relativas o absolutas
    const imageUrl = imageUrlRaw || '';

    try {
      await createProduct({
        name,
        slug,
        description,
        price_cents,
        old_price_cents,
        imageUrl,
        visible,
      });

      // revalidar listado y volver
      revalidatePath('/admin/productos');
      redirect('/admin/productos');
    } catch (err) {
      console.error('createProduct failed:', err);
      redirect('/admin/productos?error=crear');
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>

      <form action={onCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input name="name" type="text" className="input w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input name="slug" type="text" className="input w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" className="textarea w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Precio (centavos)
            </label>
            <input
              name="price_cents"
              type="number"
              min={0}
              step={1}
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Precio anterior (centavos)
            </label>
            <input
              name="old_price_cents"
              type="number"
              min={0}
              step={1}
              className="input w-full"
              placeholder="Opcional"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen principal (URL)
          </label>
          <input
            name="imageUrl"
            type="url"
            className="input w-full"
            placeholder="https://.../products/archivo.jpg o /products/archivo.jpg"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Pega la URL pública de Supabase Storage o una ruta relativa servida
            desde tu dominio.
          </p>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked />
          <span className="text-sm">Visible</span>
        </label>

        <div className="pt-2">
          <button type="submit" className="btn btn-primary">
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
