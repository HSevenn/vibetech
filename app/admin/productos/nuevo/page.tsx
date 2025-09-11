// app/admin/productos/nuevo/page.tsx
import { createProductAction } from '../actions';

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>

      <form action={createProductAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input type="text" name="name" className="input w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            placeholder="(opcional, se genera desde el nombre)"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" className="textarea w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Precio (centavos)
            </label>
            <input type="number" name="price_cents" className="input w-full" />
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
            Imagen principal (URL pública)
          </label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://... o /products/archivo.jpg"
            className="input w-full"
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked />
          <span className="text-sm">Visible</span>
        </label>

        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}

