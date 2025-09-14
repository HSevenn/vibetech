// lib/admin/products.ts
'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-server';
import type { Category } from '@/lib/products';

// Guard: valida que un string sea Category
function isCategory(v: any): v is Category {
  return v === 'tecnologia' || v === 'estilo' || v === 'hogar' || v === 'otros';
}
function normalizeCategory(v: any): Category {
  return isCategory(v) ? v : 'otros';
}

// ===== Listar =====
export async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price_cents, old_price_cents, category')
    .order('name', { ascending: true });

  if (error) {
    console.error('listProducts error:', error);
    return [];
  }

  // visible=true solo para la UI previa
  return (data ?? []).map((p) => ({ ...p, visible: true }));
}

// ===== Obtener por id =====
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price_cents, old_price_cents, images, category')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getProductById error:', error);
    throw error;
  }
  if (!data) throw new Error('Producto no encontrado');

  const imageUrl =
    Array.isArray((data as any).images) && (data as any).images.length
      ? (data as any).images[0]
      : null;

  return { ...data, imageUrl, visible: true };
}

// ===== Crear =====
export async function createProduct(input: {
  name: string;
  slug: string;
  description?: string;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null; // primera imagen
  visible?: boolean;        // (campo de UI, no guardamos visible en DB)
  category: Category;
}) {
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    images: input.imageUrl ? [input.imageUrl] : [],
    category: normalizeCategory(input.category), // <- asegura Category válido
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
    visible?: boolean;   // (solo UI)
    images?: string[];   // si usas múltiples
    category: Category;
  }
) {
  const payload: any = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    price_cents: input.price_cents,
    old_price_cents: input.old_price_cents ?? null,
    images: input.images ?? (input.imageUrl ? [input.imageUrl] : []),
    category: normalizeCategory(input.category),
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
