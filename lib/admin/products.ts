'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-server';

// ===== Listar =====
export async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price_cents, old_price_cents')
    .order('name', { ascending: true });

  if (error) {
    console.error('listProducts error:', error);
    return [];
  }

  // añadimos visible=true por compatibilidad con la UI
  return (data ?? []).map((p) => ({ ...p, visible: true }));
}

// ===== Obtener por id =====
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price_cents, old_price_cents, images')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getProductById error:', error);
    throw error;
  }
  if (!data) throw new Error('Producto no encontrado');

  const imgs = Array.isArray((data as any).images) ? (data as any).images : [];
  const imageUrl = imgs.length ? imgs[0] : null;

  // visible solo para la UI del admin
  return { ...data, images: imgs, imageUrl, visible: true };
}

// ========= Tipos de entrada (con images) =========
type CreateProductInput = {
  name: string;
  slug: string;
  description?: string | null;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null;   // compat
  images?: string[] | null;   // 👈 NUEVO
  visible?: boolean;          // si algún día agregas la columna
};

type UpdateProductInput = {
  name: string;
  slug: string;
  description?: string | null;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null;   // compat
  images?: string[] | null;   // 👈 NUEVO
  visible?: boolean;
};

function normStr(v?: string | null) {
  const s = (v ?? '').trim();
  return s.length ? s : null;
}

function buildImagesArray(images?: string[] | null, imageUrl?: string | null) {
  const arr = (images ?? []).map((s) => s?.trim()).filter(Boolean) as string[];
  if (!arr.length && imageUrl && imageUrl.trim()) arr.push(imageUrl.trim());
  return arr;
}

// ===== Crear =====
export async function createProduct(input: CreateProductInput) {
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: normStr(input.description),
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    images: buildImagesArray(input.images, input.imageUrl), // 👈 guarda múltiples
    // is_active / visible si lo manejas en DB:
    // is_active: input.visible ?? true,
  };

  const { error } = await supabase.from('products').insert([payload]);
  if (error) {
    console.error('createProduct error:', error);
    throw error;
  }
}

// ===== Actualizar =====
export async function updateProduct(id: string, input: UpdateProductInput) {
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: normStr(input.description),
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    images: buildImagesArray(input.images, input.imageUrl), // 👈 guarda múltiples
    // is_active: input.visible ?? true,
  };

  const { error } = await supabase.from('products').update(payload).eq('id', id);
  if (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
}

// ===== Borrar =====
export async function deleteProduct(id: string) {
  await supabase.from('featured_products').delete().eq('product_id', id);

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('deleteProduct products error:', error);
    throw error;
  }
}
