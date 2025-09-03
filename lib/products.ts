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
  images: string[];         // p.ej. ["products/led-strip.jpg"]
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  imageUrl?: string | null; // derivada
};

const publicUrl = (path?: string | null) =>
  path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`
    : null;

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    imageUrl: publicUrl(p.images?.[0] ?? null),
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
  return { ...data, imageUrl: publicUrl(data.images?.[0] ?? null) };
}
