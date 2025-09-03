
import data from '@/data/products.json';

export type Product = {
  slug: string;
  title: string;
  priceCOP: number;
  oldPriceCOP?: number;
  image?: string;
  excerpt?: string;
  stock?: number;
  tags?: string[];
};

export function listProducts(): Product[] {
  return (data as Product[]);
}

export function getProductBySlug(slug: string): Product | undefined {
  return (data as Product[]).find(p => p.slug === slug);
}
