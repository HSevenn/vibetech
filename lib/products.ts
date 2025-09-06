
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

  images: string[] | null;

  tags: string[] | null;

  is_active: boolean;

  created_at: string | null;

  // derivada para el front

  imageUrl?: string | null;

};



// URL pública de un archivo del bucket "public"

export function publicUrl(path?: string | null): string | null {

  if (!path) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return `${base}/storage/v1/object/public/${path}`;

}



/** Últimos productos (para Home) */

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



  return (data ?? []).map((p: any) => ({

    ...p,

    imageUrl: publicUrl(p?.images?.[0] ?? null),

  })) as Product[];

}



/** Productos destacados para el slider (usa la vista `featured_products`) */

export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {

  const { data, error } = await supabase

    .from('featured_products')

    .select('id, slug, name, description, price_cents, old_price_cents, images, is_active, created_at, featured_order')

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



/** Listado con orden (para /productos) */

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



/** Producto por slug (detalle) */

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



  const p: any = data;

  return {

    ...p,

    imageUrl: publicUrl(p?.images?.[0] ?? null),

  } as Product;

}



/** Wrapper compatible con `fetchProducts({ order })` */

export async function fetchProducts(params?: {

  order?: 'newest' | 'price_asc' | 'price_desc';

}) {

  return fetchProductsByOrder(params?.order ?? 'newest');

}

