'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-server';

// ===== Listar =====
export async function listProducts() {
  // No pedimos imageUrl porque no existe como columna; y 'visible' no está en tu tabla.
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price_cents, old_price_cents') // columnas reales
    .order('name', { ascending: true });

  if (error) {
    console.error('listProducts error:', error);
    return [];
  }

  // Añadimos visible=true por compatibilidad con la UI
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

  // imagen principal derivada
  const imageUrl =
    Array.isArray((data as any).images) && (data as any).images.length
      ? (data as any).images[0]
      : null;

  // ⚠️ Tu tabla no tiene 'visible', así que lo exponemos con un fallback.
  return { ...data, imageUrl, visible: true };
}

// ===== Crear =====
export async function createProduct(input: {
  name: string;
  slug: string;
  description?: string | null;
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
    images: input.imageUrl ? [input.imageUrl] : [], // a JSONB
    // Si agregas columna 'visible' en 'products', descomenta:
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
    description?: string | null;
    price_cents: number;
    old_price_cents?: number | null;
    imageUrl?: string | null; // si viene, reemplaza la principal
    visible?: boolean;
  }
) {
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    // Solo tocar 'images' si nos mandan imageUrl; así no la vacías sin querer
    ...(input.imageUrl !== undefined
      ? { images: input.imageUrl ? [input.imageUrl] : [] }
      : {}),
    // Si agregas columna 'visible', descomenta:
    // visible: input.visible ?? true,
  };

  const { error } = await supabase.from('products').update(payload).eq('id', id);
  if (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
}

// ===== Borrar (limpiando featured_products si no hay ON DELETE CASCADE) =====
export async function deleteProduct(id: string) {
  // Si tu FK featured_products.product_id → products.id NO tiene ON DELETE CASCADE,
  // borra primero las relaciones para evitar errores de integridad:
  const { error: featErr } = await supabase
    .from('featured_products')
    .delete()
    .eq('product_id', id);
  if (featErr) {
    // Si la tabla no existe o no hay FK, no pasa nada; solo log
    console.warn('featured_products cleanup:', featErr.message);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('deleteProduct products error:', error);
    throw error;
  }
}
