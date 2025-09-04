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
  images: string[];         // p.ej. ['products/led-strip.jpg']
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  // Derivada (URL pública de la primera imagen)
  imageUrl?: string | null;
};

export function publicUrl(path?: string | null) {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(48);

  if (error || !data) return [];
  return data.map((row: any) => ({
    ...row,
    imageUrl: publicUrl(Array.isArray(row.images) ? row.images[0] : null),
  }));
}

export async function fetchLatestProducts(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((row: any) => ({
    ...row,
    imageUrl: publicUrl(Array.isArray(row.images) ? row.images[0] : null),
  }));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return { ...data, imageUrl: publicUrl(Array.isArray(data.images) ? data.images[0] : null) };
}
