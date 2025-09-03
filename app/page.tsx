
import site from '@/data/site.json';
import products from '@/data/products.json';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function Home(){
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          {site.brandName} — <span className="text-neutral-400">{site.tagline}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Catálogo minimalista y enfocado a conversión. Productos seleccionados, asistencia directa por WhatsApp y novedades constantes.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/productos" className="btn btn-primary">Ver productos</Link>
          <Link href="/contacto" className="btn btn-outline">Contacto</Link>
        </div>
      </section>
      <section>
        <HeroSlider />
      </section>
      <section className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-semibold">Productos</h2>
        <div className="grid-products">
          {(products as any[]).map((p:any) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>
    </div>
  );
}
