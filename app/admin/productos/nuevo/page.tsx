// app/admin/productos/nuevo/page.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewProductPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [visible, setVisible] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function createOnServer(fd: FormData) {
    'use server';
    const { createProduct } = await import('@/lib/admin/products');
    await createProduct({
      name: String(fd.get('name') || ''),
      slug: String(fd.get('slug') || ''),
      description: String(fd.get('description') || ''),
      price_cents: Number(fd.get('price_cents') || 0),
      old_price_cents: fd.get('old_price_cents') ? Number(fd.get('old_price_cents')) : null,
      imageUrl: String(fd.get('imageUrl') || ''),
      visible: String(fd.get('visible')) === 'on',
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const finalSlug = slug.trim() || toSlug(name);
    if (!name.trim() || !finalSlug) {
      setErr('Nombre y Slug son obligatorios.');
      return;
    }
    if (price === '' || isNaN(Number(price))) {
      setErr('Precio inválido.');
      return;
    }

    const fd = new FormData(e.currentTarget);
    fd.set('slug', finalSlug);

    startTransition(async () => {
      try {
        await createOnServer(fd);
        router.replace('/admin/productos');
      } catch (error: any) {
        setErr(error?.message || 'No se pudo crear el producto.');
      }
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>

      {err && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input className="input w-full" name="name" value={name}
                 onChange={(e)=>setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug <span className="opacity-60">(si lo dejas vacío se genera automáticamente)</span>
          </label>
          <input className="input w-full" name="slug" value={slug}
                 onChange={(e)=>setSlug(e.target.value)} placeholder="mi-producto" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea className="textarea w-full" name="description"
                    value={description} onChange={(e)=>setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio (centavos)</label>
            <input className="input w-full" name="price_cents" type="number"
                   value={price} onChange={(e)=>setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio anterior (centavos)</label>
            <input className="input w-full" name="old_price_cents" type="number"
                   value={oldPrice} onChange={(e)=>setOldPrice(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen principal (URL)
          </label>
          <input className="input w-full" name="imageUrl" value={imageUrl}
                 onChange={(e)=>setImageUrl(e.target.value)}
                 placeholder="https://... o /products/archivo.jpg" />
          <p className="text-xs opacity-70 mt-1">
            Pega la URL pública (Supabase Storage) o una ruta relativa servida desde tu dominio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="visible" checked={visible}
                 onChange={(e)=>setVisible(e.target.checked)} />
          <span className="text-sm">Visible</span>
        </div>

        <button disabled={pending} className="btn btn-primary" type="submit">
          {pending ? 'Creando…' : 'Crear'}
        </button>
      </form>
    </div>
  );
}
