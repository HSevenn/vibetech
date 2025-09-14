// app/admin/productos/nuevo/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProduct } from '@/lib/admin/products';
import type { Category } from '@/lib/products';

// helper por si no tecleas el slug
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function createProductAction(fd: FormData) {
  const name = String(fd.get('name') || '');
  const slugInput = String(fd.get('slug') || '');
  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const category = (String(fd.get('category') || 'otros') as Category);
  const imageUrl = String(fd.get('imageUrl') || '');

  await createProduct({
    name,
    slug,
    description: String(fd.get('description') || ''),
    price_cents: Number(fd.get('price_cents') || 0),
    old_price_cents: fd.get('old_price_cents')
      ? Number(fd.get('old_price_cents'))
      : null,
    imageUrl,
    visible: fd.get('visible') === 'on',
    category, // 👈 importante
  });

  // refresca el listado y vuelve
  revalidatePath('/admin/productos');
  redirect('/admin/productos');
}
