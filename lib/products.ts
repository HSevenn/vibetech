// lib/products.ts
import { supabase } from './supabase';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  old_price_cents: number | null;
  stock: number;
  images: string[] | null;
  is_active: boolean | null;
  created_at?: string;
};

export function publicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  const clean = path.replace(/^\//, '');
  return `${base}/storage/v1/object/public/${clean}`;
}

export async function fetchProducts(): Promise<(Product & { imageUrl?: string })[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((p: any) => ({
    ...p,
    imageUrl: p.images?.[0] ? publicUrl(p.images[0]) : undefined,
  }));
}

export async function fetchLatestProducts(limit: number = 6): Promise<(Product & { imageUrl?: string })[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((p: any) => ({
    ...p,
    imageUrl: p.images?.[0] ? publicUrl(p.images[0]) : undefined,
  }));
}

export async function fetchProductBySlug(slug: string): Promise<Product & { imageUrl?: string }> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;

  return {
    ...(data as any),
    imageUrl: (data as any)?.images?.[0] ? publicUrl((data as any).images[0]) : undefined,
  };
}
