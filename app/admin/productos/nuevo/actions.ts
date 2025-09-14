// app/admin/productos/nuevo/actions.ts
'use server';

import { createProduct } from '@/lib/admin/products';
import type { Category } from '@/lib/products';

function parseImages(raw: string): string[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map(String).map(s => s.trim()).filter(Boolean);
  } catch {}
  return raw.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
}

// Coerce seguro a Category
function toCategory(v: FormDataEntryValue | null): Category {
  const s = String(v || '').toLowerCase();
  return (s === 'tecnologia' || s === 'estilo' || s === 'hogar' || s === 'otros')
    ? (s as Category)
    : 'otros';
}

export async function createProductAction(fd: FormData) {
  await createProduct({
    name: String(fd.get('name') || ''),
    slug: String(fd.get('slug') || ''),
    description: String(fd.get('description') || ''),
    price_cents: Number(fd.get('price_cents') || 0),
    old_price_cents: fd.get('old_price_cents') ? Number(fd.get('old_price_cents')) : null,
    images: parseImages(String(fd.get('images') || '')),
    visible: fd.get('visible') === 'on',
    category: toCategory(fd.get('category')),
  });
}
