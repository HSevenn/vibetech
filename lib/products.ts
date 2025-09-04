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
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  imageUrl?: string | null;
};

function pathToPublicUrl(path: string | null | undefined) {
  if (!path) return null;
  const { data } = supabase.storage.from('products').getPublicUrl(path);
  return data.publicUrl || null;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[fetchProducts] error:', error.message);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    imageUrl: pathToPublicUrl(Array.isArray(p.images) ? p.images[0] : null),
  }));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('[fetchProductBySlug] error:', error.message);
    return null;
  }

  const p: any = data;
  return {
    ...p,
    imageUrl: pathToPublicUrl(Array.isArray(p.images) ? p.images[0] : null),
  };
}
