// lib/products.ts
import { supabase } from './supabase';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  old_price_cents: number | null;
  stock: number | null;
  images: string[] | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string | null;
  // derivada para el front
  imageUrl?: string | null;
};

// URL pública para un path de Storage.
// - Si ya es http(s), la devolvemos tal cual.
// - Si es relativo (ej: "products/foto.jpg"), lo convertimos a URL pública.
export function publicUrl(path?: string | null): string | null {
  if (!path) return null;
  const trimmed = String(path).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed; // ya es absoluta
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Asegura que no haya "/" duplicadas
  const clean = trimmed.replace(/^\/+/, '');
  return `${base}/storage/v1/object/public/${clean}`;
}

// Toma el primer elemento del array `images` y lo convierte a URL pública
function firstImageUrl(images?: string[] | null): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  return publicUrl(images[0]);
}

/** Últimos productos (para Home) */
export async function fetchLatestProducts(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at'
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchLatestProducts error:', error.message);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    imageUrl: firstImageUrl(p?.images),
  })) as Product[];
}

/** Productos destacados para el slider (usa la vista `featured_products`) */
export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('featured_products')
    .select(
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at, featured_order'
    )
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchFeaturedProducts error:', error.message);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    imageUrl: firstImageUrl(p?.images),
  })) as Product[];
}

/** Listado con orden (para /productos) */
export async function fetchProductsByOrder(
  order: 'newest' | 'price_asc' | 'price_desc' = 'newest'
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at'
    )
    .eq('is_active', true);

  if (order === 'price_asc') {
    query = query.order('price_cents', { ascending: true, nullsFirst: false });
  } else if (order === 'price_desc') {
    query = query.order('price_cents', { ascending: false, nullsFirst: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(60);
  if (error) {
    console.error('fetchProductsByOrder error:', error.message);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    imageUrl: firstImageUrl(p?.images),
  })) as Product[];
}

/** Producto por slug (detalle) */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at, stock, tags'
    )
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('fetchProductBySlug error:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    ...(data as any),
    imageUrl: firstImageUrl((data as any).images),
  } as Product;
}

