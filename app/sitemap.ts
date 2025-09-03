
import { listProducts } from '@/lib/products-db';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const staticEntries = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/productos`, lastModified: new Date() },
    { url: `${base}/contacto`, lastModified: new Date() },
  ];
  const productEntries = listProducts().map(p => ({ url: `${base}/producto/${p.slug}`, lastModified: new Date() }));
  return [...staticEntries, ...productEntries];
}
