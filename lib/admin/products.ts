// lib/admin/products.ts
'use server';

import { supabase } from '@/lib/supabase';

/** Lista productos para el panel (orden seguro por nombre) */
export async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price_cents, old_price_cents, imageUrl, visible')
    .order('name', { ascending: true });

  if (error) {
    console.error('listProducts error:', error);
    return [];
  }
  return data ?? [];
}

/** Trae un producto por id para el editor */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price_cents, old_price_cents, imageUrl, visible')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getProductById error:', error);
    throw error;
  }
  if (!data) throw new Error('Producto no encontrado');
  return data;
}

/** Crea producto */
export async function createProduct(input: {
  name: string;
  slug: string;
  description?: string;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null;
  visible?: boolean;
}) {
  const { error } = await supabase.from('products').insert([
    {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      price_cents: input.price_cents,
      old_price_cents: input.old_price_cents ?? null,
      imageUrl: input.imageUrl ?? null,
      visible: input.visible ?? true,
    },
  ]);

  if (error) {
    console.error('createProduct error:', error);
    throw error;
  }
}

/** Actualiza producto */
export async function updateProduct(
  id: string,
  input: {
    name: string;
    slug: string;
    description?: string;
    price_cents: number;
    old_price_cents?: number | null;
    imageUrl?: string | null;
    visible?: boolean;
  }
) {
  const { error } = await supabase
    .from('products')
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      price_cents: input.price_cents,
      old_price_cents: input.old_price_cents ?? null,
      imageUrl: input.imageUrl ?? null,
      visible: input.visible ?? true,
    })
    .eq('id', id);

  if (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
}

/** 🔥 FALTABA: borra producto */
export async function deleteProduct(id: string) {
  // Si también tienes tabla featured_products relacionada por product_id,
  // puedes limpiar primero allí (opcional):
  // await supabase.from('featured_products').delete().eq('product_id', id);

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('deleteProduct error:', error);
    throw error;
  }
}
