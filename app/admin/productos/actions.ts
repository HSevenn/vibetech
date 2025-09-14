// app/admin/productos/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProduct } from '@/lib/admin/products';
import type { Category } from '@/lib/products';

// Slug helper
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Coerce seguro a Category
function toCategory(v: FormDataEntryValue | null): Category {
  const s = String(v || '').toLowerCase();
  return (s === 'tecnologia' || s === 'estilo' || s === 'hogar' || s === 'otros')
    ? (s as Category)
    : 'otros';
}

export async function createProductAction(fd: FormData) {
  const name = String(fd.get('name') || '');
  let slug = String(fd.get('slug') || '');
  if (!slug) slug = slugify(name);

  await createProduct({
    name,
    slug,
    description: String(fd.get('description') || ''),
    price_cents: Number(fd.get('price_cents') || 0),
    old_price_cents: fd.get('old_price_cents') ? Number(fd.get('old_price_cents')) : null,
    imageUrl: String(fd.get('imageUrl') || ''), // si en el futuro usas images[], cambia acá
    visible: fd.get('visible') === 'on',
    category: toCategory(fd.get('category')),   // 👈 clave
  });

  revalidatePath('/admin/productos');
  redirect('/admin/productos');
}
