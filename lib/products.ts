
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
  images: string[] | null;      // e.g. ['products/led-strip.jpg']
  tags: string[] | null;
  is_active: boolean;
  created_at: string | null;

  // Derivadas
  imageUrl?: string | null;
};

export function publicUrl(path?: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${path}`;
}

function mapRow(row: any): Product {
  const images = Array.isArray(row.images) ? row.images : null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    price_cents: Number(row.price_cents ?? 0),
    old_price_cents: row.old_price_cents === null ? null : Number(row.old_price_cents),
    stock: row.stock ?? null,
    images,
    tags: row.tags ?? null,
    is_active: !!row.is_active,
    created_at: row.created_at ?? null,
    imageUrl: images && images[0] ? publicUrl(images[0]) : null,
  };
}

export async function fetchProducts(opts?: { order?: 'price_asc'|'price_desc'|'newest'|'oldest' }) {
  const order = opts?.order ?? 'newest';
  let q = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (order === 'price_asc') q = q.order('price_cents', { ascending: true });
  else if (order === 'price_desc') q = q.order('price_cents', { ascending: false });
  else if (order === 'oldest') q = q.order('created_at', { ascending: true });
  else q = q.order('created_at', { ascending: false });

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchLatestProducts(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchFeaturedProducts(limit = 6) {
  // intentamos leer de la vista featured_products
  const tryView = await supabase
    .from('featured_products')
    .select('*')
    .limit(limit);
  if (!tryView.error && tryView.data) {
    return tryView.data.map(mapRow);
  }
  // fallback si la vista no existe
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data);
}
