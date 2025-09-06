// lib/products.ts
import { supabase } from './supabase';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  old_price_cents: number | null;
  stock?: number | null;
  images: string[] | null;           // p.ej. ['products/led-strip.jpg']
  tags?: string[] | null;
  is_active: boolean;
  created_at: string | null;

  // Derivadas para el front
  imageUrl?: string | null;
};

// ===== Util =====
export function publicUrl(path?: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${path}`;
}

function addImageUrl(rows: any[] | null | undefined): Product[] {
  return (rows ?? []).map((p: any) => ({
    ...p,
    imageUrl: publicUrl(p?.images?.[0] ?? null),
  })) as Product[];
}

// ===== Listados =====

// Últimos productos (Home)
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
  return addImageUrl(data);
}

// Destacados para el slider
// (si creaste la vista `featured_products`, puedes cambiar 'products' por 'featured_products'
// y quitar el .eq('is_featured', true))
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
  return addImageUrl(data);
}

// Listado con orden (página /productos)
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
  return addImageUrl(data);
}

// Alias para compatibilidad con import { fetchProducts } (no escribas otra función)
export { fetchProductsByOrder as fetchProducts };

// ===== Detalle =====
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
