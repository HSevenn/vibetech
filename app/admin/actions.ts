'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createProduct(formData: FormData): Promise<void> {
  // Basic "auth": require cookie to match ADMIN_SECRET (optional)
  const required = process.env.ADMIN_SECRET;
  const cookieVal = cookies().get('admin')?.value;
  if (required && cookieVal !== required) {
    throw new Error('Unauthorized');
  }

  const name = String(formData.get('name') || '').trim();
  const slug = String(formData.get('slug') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const price_cents = Number(formData.get('price_cents') || 0);
  const old_price_cents = formData.get('old_price_cents') ? Number(formData.get('old_price_cents')) : null;
  const stock = Number(formData.get('stock') || 0);
  const is_active = (formData.get('is_active') ?? 'on') ? true : false;

  // Upload any images passed in the "images" input (multiple)
  const files = formData.getAll('images');
  const imagePaths: string[] = [];

  for (const f of files) {
    if (typeof File !== 'undefined' && f instanceof File && f.size > 0) {
      const ab = await f.arrayBuffer();
      const bytes = new Uint8Array(ab);
      const ext = (f.name.split('.').pop() || 'jpg').toLowerCase();
      const baseName = (slug || name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const fileName = `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabaseAdmin
        .storage
        .from('products')
        .upload(fileName, bytes, { contentType: f.type || 'image/jpeg', upsert: false });

      if (upErr) {
        throw new Error(upErr.message);
      }
      imagePaths.push(`products/${fileName}`);
    }
  }

  const { error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      slug,
      description,
      price_cents,
      old_price_cents,
      stock,
      images: imagePaths,
      is_active
    });

  if (error) throw new Error(error.message);

  // Revalidate pages
  revalidatePath('/');
  revalidatePath('/productos');
}
