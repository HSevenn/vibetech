// lib/admin/products.ts
'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from './supabase';

export type AdminProductInput = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null;
  visible?: boolean;
  images?: string[]; // for future gallery
};

export async function listProducts() {
  const supabase = adminClient();
  const { data, error } = await supabase
    .from('products')
    .select('id,name,slug,price_cents,old_price_cents,visible,imageUrl,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProductById(id: string) {
  const supabase = adminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(input: AdminProductInput) {
  const supabase = adminClient();
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    imageUrl: input.imageUrl ?? null,
    visible: input.visible ?? true,
  };
  if (input.images) payload.images = input.images;
  const { error } = await supabase.from('products').insert(payload);
  if (error) throw error;
  revalidatePath('/productos');
  revalidatePath('/admin/productos');
}

export async function updateProduct(id: string, input: AdminProductInput) {
  const supabase = adminClient();
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    imageUrl: input.imageUrl ?? null,
    visible: input.visible ?? true,
  };
  if (input.images) payload.images = input.images;
  const { error } = await supabase.from('products').update(payload).eq('id', id);
  if (error) throw error;
  revalidatePath('/productos');
  revalidatePath(`/productos/${input.slug}`);
  revalidatePath('/admin/productos');
}

export async function deleteProduct(id: string) {
  const supabase = adminClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/productos');
  revalidatePath('/admin/productos');
}
