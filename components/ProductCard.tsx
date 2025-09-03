
import Link from 'next/link';
import { formatCOP } from '@/lib/format';

export default function ProductCard({ p }: { p: any }){
  return (
    <article className="card">
      <img src={p.image} alt={p.title} className="h-48 w-full object-cover" />
      <div className="card-body">
        <h3 className="text-base font-semibold">{p.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            {p.oldPriceCOP ? (<span className="mr-2 text-neutral-400 line-through">{formatCOP(p.oldPriceCOP)}</span>) : null}
            <span className="font-semibold">{formatCOP(p.priceCOP)}</span>
          </div>
          <Link href={`/producto/${p.slug}`} className="btn btn-primary">Ver producto</Link>
        </div>
      </div>
    </article>
  );
}
