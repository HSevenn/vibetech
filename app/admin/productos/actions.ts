// app/admin/productos/actions.ts
'use server';

import { createProduct } from '@/lib/admin/products';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/** Slug simple a partir del nombre (sin dependencias). */
function slugify(input: string) {
  return input
    .normalize('NFD')                 // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')     // todo lo que no sea [a-z0-9] -> '-'
    .replace(/(^-|-$)+/g, '');       // bordes
}

/** Normaliza una URL de imagen (acepta absoluta o relativa). */
function normalizeImageUrl(raw: string | null | undefined) {
  const v = (raw || '').trim();
  if (!v) return '';
  // Permitimos tanto absoluta (https://...) como relativa (/algo o products/...)
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/')) return v;
  return `/${v}`;
}

export async function createProductAction(formData: FormData) {
  // Recoger campos
  const name = String(formData.get('name') ?? '').trim();
  let slug = String(formData.get('slug') ?? '').trim();
  const description = String(formData.get('description') ?? '');
  const price_cents = Number(formData.get('price_cents') ?? 0);
  const old_price_cents_raw = formData.get('old_price_cents');
  const old_price_cents =
    old_price_cents_raw === null || old_price_cents_raw === ''
      ? null
      : Number(old_price_cents_raw);
  const imageUrl = normalizeImageUrl(String(formData.get('imageUrl') ?? ''));
  const visible = formData.get('visible') === 'on';

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }
  if (!slug) slug = slugify(name);

  await createProduct({
    name,
    slug,
    description,
    price_cents,
    old_price_cents,
    imageUrl,
    visible, // si tu tabla no tiene `visible`, el lib lo ignora sin romper
  });

  // Refrescar la lista y volver al listado
  revalidatePath('/admin/productos');
  redirect('/admin/productos');
}
