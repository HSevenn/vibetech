
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/products-db';
import site from '@/data/site.json';
import Link from 'next/link';
import ShareBar from '@/components/ShareBar';
import ProductJsonLd from '@/components/ProductJsonLd';
import { formatCOP } from '@/lib/format';
import { notFound } from 'next/navigation';

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProductBySlug(params.slug);
  if (!p) return { title: 'Producto no encontrado • VibeTech' };
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${base}/producto/${p.slug}`;
  return {
    title: `${p.title} • VibeTech`,
    description: p.excerpt ?? 'Producto de VibeTech',
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url,
      images: p.image ? [{ url: p.image, width: 1200, height: 630, alt: p.title }] : [],
      // ! No poner type: 'product' en Next 14
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.excerpt,
      images: p.image ? [p.image] : [],
    },
  };
}

export default function ProductDetail({ params }: Params){
  const p = getProductBySlug(params.slug);
  if(!p){ notFound(); }
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${base}/producto/${p.slug}`;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card">
        <img src={p.image} alt={p.title} className="h-[400px] w-full object-cover"/>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{p.title}</h1>
        <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
        <div className="mt-4 text-2xl font-semibold">
          {p.oldPriceCOP ? (<span className="mr-3 text-xl text-neutral-400 line-through">{formatCOP(p.oldPriceCOP)}</span>) : null}
          <span>{formatCOP(p.priceCOP)}</span>
        </div>
        <div className="mt-6 flex gap-3">
          <a className="btn btn-primary" target="_blank" href={`https://wa.me/57${site.whatsapp}?text=${encodeURIComponent('Hola! Me interesa ' + p.title)}`}>Comprar por WhatsApp</a>
          <Link href="/productos" className="btn btn-outline">Volver</Link>
        </div>
        <div className="mt-6">
          <ShareBar title={p.title} />
        </div>
        <ProductJsonLd p={p} url={url} />
      </div>
    </div>
  );
}
