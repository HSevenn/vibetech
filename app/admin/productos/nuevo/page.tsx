// /app/admin/productos/nuevo/page.tsx
'use client';

import { createProductAction } from '@/app/admin/actions';

export default function NuevoProductoPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo producto</h1>

      <form action={createProductAction} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Ej: Cargador MagSafe 15W"
            className="w-full border p-2 rounded"
            autoComplete="off"
          />
        </div>

        {/* Slug (opcional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Slug (opcional)</label>
          <input
            type="text"
            name="slug"
            placeholder="cargador-magsafe-15w"
            className="w-full border p-2 rounded"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Si lo dejas vacío, se generará automáticamente a partir del nombre.
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
            placeholder="Breve descripción del producto…"
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Precio actual (centavos) */}
        <div>
          <label className="block text-sm font-medium mb-1">Precio (centavos)</label>
          <input
            type="number"
            name="price_cents"
            required
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="Ej: 129900 (equivale a $129.900 COP)"
            className="w-full border p-2 rounded"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Ingresa el valor en centavos. Ej: <strong>129900</strong> = $129.900 COP
          </p>
        </div>

        {/* Precio anterior (centavos, opcional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Precio anterior (centavos, opcional)
          </label>
          <input
            type="number"
            name="old_price_cents"
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="Ej: 159900"
            className="w-full border p-2 rounded"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Solo si hubo descuento. Debe ser mayor al precio actual para mostrar % OFF.
          </p>
        </div>

        {/* Imagen principal (URL pública, opcional) */}
        <div>
          <label className="block text-sm font-medium mb-1">URL de imagen (opcional)</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://.../products/mi-foto.jpg"
            className="w-full border p-2 rounded"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Puedes pegar una URL pública (Supabase Storage, etc.). Luego podrás añadir más imágenes desde editar.
          </p>
        </div>

        {/* Visible */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked />
          <span className="text-sm">Visible</span>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            name="category"
            defaultValue="tecnologia"
            required
            className="w-full border p-2 rounded"
          >
            <option value="tecnologia">Tecnología</option>
            <option value="estilo">Estilo</option>
            <option value="hogar">Hogar</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear producto
        </button>
      </form>
    </div>
  );
}
