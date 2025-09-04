
// lib/products.ts
import { createClient } from '@supabase/supabase-js';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  old_price_cents: number | null;
  stock: number;
  images: string[]; // paths en Storage (products/...)
  is_active: boolean;
  created_at: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

// Helpers
export function publicUrl(path: string) {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${url}/storage/v1/object/public/${clean}`;
}

// Listado completo
export async function fetchProducts(): Promise<(Product & { imageUrl?: string })[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(p => ({
    ...p,
    imageUrl: Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : undefined,
  })) as any;
}

// Detalle por slug
export async function fetchProductBySlug(slug: string): Promise<(Product & { imageUrl?: string }) | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!data) return null;

  return {
    ...(data as Product),
    imageUrl: Array.isArray(data.images) && data.images[0] ? publicUrl(data.images[0]) : undefined,
  };
}

// Últimos 8 para la Home
export async function fetchLatestProducts(): Promise<(Product & { imageUrl?: string })[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) throw error;

  return (data ?? []).map(p => ({
    ...p,
    imageUrl: Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : undefined,
  })) as any;
}
