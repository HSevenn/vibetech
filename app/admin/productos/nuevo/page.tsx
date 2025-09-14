// /app/admin/productos/nuevo/page.tsx

'use client';

import { createProductAction } from '@/app/admin/actions';

export default function NuevoProductoPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo producto</h1>

      <form action={createProductAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug (opcional)</label>
          <input
            type="text"
            name="slug"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio (centavos)</label>
          <input
            type="number"
            name="price_cents"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio anterior (centavos, opcional)</label>
          <input
            type="number"
            name="old_price_cents"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">URL de Imagen</label>
          <input
            type="text"
            name="imageUrl"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Visible</label>
          <input type="checkbox" name="visible" />
        </div>

        {/* 👇 Nuevo campo de Categoría */}
        <div>
          <label className="block text-sm font-medium">Categoría</label>
          <select
            name="category"
            defaultValue="tecnologia"
            className="w-full border p-2 rounded"
          >
            <option value="tecnologia">Tecnología</option>
            <option value="estilo">Estilo</option>
            <option value="hogar">Hogar</option>
            <option value="otros">Otros</option>
          </select>
        </div>

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
