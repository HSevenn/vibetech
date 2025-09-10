'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-server';

// ===== Listar =====
export async function listProducts() {
  // NO pedimos imageUrl porque no existe en tu tabla; y visible puede no existir.
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price_cents, old_price_cents') // 👈 columnas reales
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
    .select('id, name, slug, description, price_cents, old_price_cents, images') // usa images JSONB
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getProductById error:', error);
    throw error;
  }
  if (!data) throw new Error('Producto no encontrado');
  // compat: expón imageUrl principal si hace falta
  const imageUrl =
    Array.isArray((data as any).images) && (data as any).images.length
      ? (data as any).images[0]
      : null;

  return { ...data, imageUrl };
}

// ===== Crear =====
export async function createProduct(input: {
  name: string;
  slug: string;
  description?: string;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null; // lo guardamos como primer elemento de images
  visible?: boolean;
}) {
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    images: input.imageUrl ? [input.imageUrl] : [], // 👈 a JSONB
    // si tienes columna visible en products, descomenta:
    // visible: input.visible ?? true,
  };

  const { error } = await supabase.from('products').insert([payload]);

  if (error) {
    console.error('createProduct error:', error);
    throw error;
  }
}

// ===== Actualizar =====
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
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    images: input.imageUrl ? [input.imageUrl] : [],
    // visible: input.visible ?? true,
  };

  const { error } = await supabase.from('products').update(payload).eq('id', id);
  if (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
}

// ===== Borrar (con limpieza de featured_products) =====
export async function deleteProduct(id: string) {
  // Si tu FK featured_products.product_id → products.id NO tiene ON DELETE CASCADE,
  // borramos primero las relaciones:
  await supabase.from('featured_products').delete().eq('product_id', id);

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('deleteProduct products error:', error);
    throw error;
  }
}
