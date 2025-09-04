'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: '',
    name: '',
    description: '',
    price_cents: 0,
    old_price_cents: 0,
    stock: 0,
    is_active: true,
    tags_text: '',
  });

  async function uploadImages() {
    setMsg(null);
    if (!secret) return setMsg('Ingresa ADMIN_SECRET');
    if (!files.length) return setMsg('Adjunta una o más imágenes');
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-secret': secret },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) return setMsg(`Error al subir: ${data.error || 'desconocido'}`);
    setPaths(data.paths || []);
    setMsg(`Subidas ${data.paths?.length || 0} imágenes`);
  }

  async function createProduct() {
    setMsg(null);
    if (!secret) return setMsg('Ingresa ADMIN_SECRET');
    if (!paths.length) return setMsg('Primero sube imágenes');

    const tags = form.tags_text.split(',').map(s => s.trim()).filter(Boolean);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify({ ...form, images: paths, tags: tags.length ? tags : null }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(`Error al crear: ${data.error || 'desconocido'}`);
    setMsg('¡Producto creado!');
    setForm({ slug:'', name:'', description:'', price_cents:0, old_price_cents:0, stock:0, is_active:true, tags_text:'' });
    setFiles([]);
    setPaths([]);
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin – Crear producto</h1>
      {msg && <p className="mb-4">{msg}</p>}

      <div className="mb-4 max-w-md">
        <input type="password" className="w-full bg-neutral-900 rounded p-2" placeholder="ADMIN_SECRET"
          value={secret} onChange={e=>setSecret(e.target.value)} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <input className="bg-neutral-900 rounded p-2 w-full" placeholder="slug"
            value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} />
          <input className="bg-neutral-900 rounded p-2 w-full" placeholder="name"
            value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <textarea className="bg-neutral-900 rounded p-2 w-full" placeholder="description"
            value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <input type="number" className="bg-neutral-900 rounded p-2 w-full" placeholder="price_cents (ej: 10000000 para $100.000)"
            value={form.price_cents} onChange={e=>setForm({...form, price_cents:Number(e.target.value)})} />
          <input type="number" className="bg-neutral-900 rounded p-2 w-full" placeholder="old_price_cents (opcional)"
            value={form.old_price_cents} onChange={e=>setForm({...form, old_price_cents:Number(e.target.value)})} />
          <input type="number" className="bg-neutral-900 rounded p-2 w-full" placeholder="stock"
            value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} />
          <input className="bg-neutral-900 rounded p-2 w-full" placeholder="tags (coma-separadas)"
            value={form.tags_text} onChange={e=>setForm({...form, tags_text:e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} />
            Activo
          </label>
        </section>

        <section className="space-y-3">
          <input type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files || []))}
            className="bg-neutral-900 rounded p-2 w-full" />
          <button onClick={uploadImages} className="rounded bg-white/10 px-4 py-2">Subir imágenes</button>

          {paths.length > 0 && (
            <div className="text-sm opacity-80">
              <div className="mb-2">Imágenes subidas:</div>
              <ul className="list-disc ml-5">{paths.map((p,i)=>(<li key={i}>{p}</li>))}</ul>
            </div>
          )}

          <button onClick={createProduct} className="rounded bg-white px-4 py-2 text-black">Crear producto</button>
        </section>
      </div>
    </main>
  );
}
