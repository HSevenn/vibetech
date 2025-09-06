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
  images: string[] | null;   // p.ej. ['products/led-strip.jpg']
  tags: string[] | null;
  is_active: boolean;
  created_at: string | null;

  // Derivadas (opcionales en el front)
  imageUrl?: string | null;
};

// URL pública desde el path del bucket
export function publicUrl(path?: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${path}`;
}

// Productos DESTACADOS para el slide
export async function fetchFeaturedProducts(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchFeaturedProducts error:', error.message);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    imageUrl: publicUrl(p?.images?.[0] ?? null),
  })) as Product[];
}

// Listar productos con orden (para /productos)
export async function fetchProductsByOrder(
  order: 'newest' | 'price_asc' | 'price_desc' = 'newest'
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
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
    imageUrl: publicUrl(p?.images?.[0] ?? null),
  })) as Product[];
}

// 1 producto por slug (para página de detalle)
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('fetchProductBySlug error:', error.message);
    return null;
  }
  if (!data) return null;

  const p: any = data;
  return {
    ...p,
    imageUrl: publicUrl(p?.images?.[0] ?? null),
  } as Product;
}

// Compatibilidad con importaciones existentes:
export { fetchProductsByOrder as fetchProducts };

/** Devuelve la URL pública de un archivo del bucket `public` en Supabase Storage */
export function publicUrl(path?: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${path}`;
}

/** Últimos productos activos (para Home) */
export async function fetchLatestProducts(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchLatestProducts error:', error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

/** Producto por slug (detalle) */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('fetchProductBySlug error:', error.message);
    return null;
  }

  return data as Product;
}

/** Productos destacados para el slider (usa la vista `featured_products`) */
export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('featured_products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchFeaturedProducts error:', error.message);
    return [];
  }

  return (data ?? []) as Product[];
}
// Devuelve la lista de productos con ordenamiento
export async function fetchProductsByOrder(
  order: 'newest' | 'price_asc' | 'price_desc' = 'newest'
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at')
    .eq('is_active', true);

  if (order === 'price_asc') {
    query = query.order('price_cents', { ascending: true, nullsFirst: false });
  } else if (order === 'price_desc') {
    query = query.order('price_cents', { ascending: false, nullsFirst: false });
  } else {
    // newest
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(60);
  if (error) {
    console.error('fetchProductsByOrder error:', error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

// Wrapper compatible con page.tsx
export async function fetchProducts(params?: {
  order?: 'newest' | 'price_asc' | 'price_desc';
}) {
  return fetchProductsByOrder(params?.order);
}



