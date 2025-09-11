// app/admin/productos/nuevo/page.tsx
import { createProductAction } from '@/app/admin/productos/actions';

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>

      <form action={createProductAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            placeholder="ej: mi-producto-unico"
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
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
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Precio anterior (centavos)
            </label>
            <input
              type="number"
              name="old_price_cents"
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen principal (URL)
          </label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://..."
            className="input w-full"
          />
          <p className="text-xs text-muted-foreground">
            Pega la URL pública de Supabase Storage o una ruta servida desde tu dominio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked />
          <span className="text-sm">Visible</span>
        </div>

        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>
    </div>
  );
}
