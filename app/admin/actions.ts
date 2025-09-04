
// app/admin/actions.ts
'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function createProduct(formData: FormData): Promise<void> {
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const price_cents = Number(formData.get('price_cents') ?? 0);
  const old_price_cents_raw = formData.get('old_price_cents');
  const old_price_cents = old_price_cents_raw ? Number(old_price_cents_raw) : null;
  const stock = Number(formData.get('stock') ?? 0);
  const is_active = formData.get('is_active') === 'on';

  const files = formData.getAll('images') as File[];
  const supabase = createClient(url, serviceKey);

  const imagePaths: string[] = [];
  for (const file of files) {
    if (!file || typeof file === 'string' || file.size === 0) continue;

    const ext = (file.type?.split('/')[1] || 'bin').toLowerCase();
    const filename = `${slug}-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const objectPath = `products/${filename}`;

    const { error: upErr } = await supabase.storage.from('products').upload(objectPath, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });
    if (upErr) throw upErr;

    imagePaths.push(objectPath);
  }

  const { error: insErr } = await supabase.from('products').insert({
    name,
    slug,
    description,
    price_cents,
    old_price_cents,
    stock,
    images: imagePaths,
    is_active,
  });

  if (insErr) throw insErr;

  revalidatePath('/');
  revalidatePath('/productos');
  redirect('/admin?ok=1');
}
