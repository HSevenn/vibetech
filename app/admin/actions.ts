'use server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = String(formData.get('name') || '');
  const slug = String(formData.get('slug') || '').toLowerCase();
  const price_cents = Number(formData.get('price_cents') || 0);
  if (!name || !slug || !price_cents) return { ok: false, message: 'Campos requeridos faltantes' };

  let images: string[] = [];
  const file = formData.get('image') as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop();
    const filePath = `uploads/${slug}-${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();
    await supabaseAdmin.storage.from('products').upload(filePath, buffer, { contentType: file.type, upsert: true });
    images = [filePath];
  }

  const { error } = await supabaseAdmin.from('products').insert({ name, slug, price_cents, images, is_active: true });
  if (error) return { ok: false, message: error.message };

  revalidatePath('/');
  revalidatePath('/productos');
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return { ok: false, message: error.message };
  revalidatePath('/productos');
  return { ok: true };
}
