// app/admin/productos/nuevo/page.tsx
import { createProductAction } from './actions';

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>

      <form action={createProductAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input name="name" className="input w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input name="slug" className="input w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" className="textarea w-full" rows={4}/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio (centavos)</label>
            <input type="number" name="price_cents" className="input w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio anterior (centavos)</label>
            <input type="number" name="old_price_cents" className="input w-full" />
          </div>
        </div>

        {/* 👇 varias imágenes */}
        <div>
          <label className="block text-sm font-medium mb-1">Imágenes (una URL por línea)</label>
          <textarea
            name="images"
            className="textarea w-full"
            rows={4}
            placeholder={`https://.../foto1.jpg\n/products/foto2.jpg`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Pega URLs públicas de Supabase Storage o rutas relativas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked />
          <span className="text-sm">Visible</span>
        </div>

        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}
