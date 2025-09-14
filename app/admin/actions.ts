'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProduct } from '@/lib/admin/products';
import type { Category } from '@/lib/products';

// Pequeño helper por si no tecleas el slug
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

  // 🔥 Categoría (desde el <select name="category">)
  const raw = String(fd.get('category') || '').trim();
  const allowed: Category[] = ['tecnologia', 'estilo', 'hogar', 'otros'];
  const category: Category = allowed.includes(raw as Category)
    ? (raw as Category)
    : 'otros';

  await createProduct({
    name,
    slug,
    description: String(fd.get('description') || ''),
    price_cents: Number(fd.get('price_cents') || 0),
    old_price_cents: fd.get('old_price_cents')
      ? Number(fd.get('old_price_cents'))
      : null,
    imageUrl: String(fd.get('imageUrl') || ''),
    visible: fd.get('visible') === 'on',
    category, // ✅ ahora se envía y desaparece el error de TS
  });

  // refresca la lista y vuelve al listado
  revalidatePath('/admin/productos');
  redirect('/admin/productos');
}
