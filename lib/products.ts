// lib/products.ts
import { supabase } from './supabase';

export type Category = 'tecnologia' | 'estilo' | 'hogar' | 'otros';

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
  category?: Category; // 👈 nuevo (view featured_products quizá no la tenga)
  imageUrl?: string | null; // derivada
};

// URL pública para un path de Storage.
export function publicUrl(path?: string | null): string | null {
  if (!path) return null;
  const trimmed = String(path).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const clean = trimmed.replace(/^\/+/, '');
  return `${base}/storage/v1/object/public/${clean}`;
}

function firstImageUrl(images?: string[] | null): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  return publicUrl(images[0]);
}

/** Últimos productos (para Home) */
export async function fetchLatestProducts(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      // 👇 AÑADIDO: stock
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at, category, stock'
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

/** Productos destacados para el slider (vista `featured_products`) */
export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('featured_products')
    .select(
      // OJO: esta vista puede no tener category
      // (no agrego 'stock' aquí para evitar error si la vista no lo expone)
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

/** Listado con orden + categoría (para /productos) */
export async function fetchProductsByOrder(
  order: 'newest' | 'price_asc' | 'price_desc' = 'newest',
  category?: Category
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(
      // 👇 AÑADIDO: stock (clave para que el cartel se vea en el grid)
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at, category, stock'
    )
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

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
      'id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at, stock, tags, category'
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
