// lib/products.ts
import { supabase } from './supabase';

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  old_price_cents: number | null;
  stock: number;
  images: string[];
  is_active: boolean;
  created_at: string;
};

export type UiProduct = DbProduct & {
  imageUrl?: string;
  imageUrls?: string[];
};

export function publicUrl(path?: string) {
  if (!path) return undefined;
  const { data } = supabase.storage.from('products').getPublicUrl(path);
  return data.publicUrl;
}

export function mapProduct(p: DbProduct): UiProduct {
  const first = Array.isArray(p.images) && p.images.length ? p.images[0] : undefined;
  return {
    ...p,
    imageUrl: publicUrl(first),
    imageUrls: Array.isArray(p.images) ? p.images.map(publicUrl).filter(Boolean) as string[] : []
  };
}

export async function fetchProducts(): Promise<UiProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as DbProduct[]).map(mapProduct);
}

export async function fetchLatestProducts(limit = 3): Promise<UiProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as DbProduct[]).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<UiProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as DbProduct) : null;
}
