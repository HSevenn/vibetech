// components/ProductCard.tsx
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { formatCOP } from '@/lib/format';

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card overflow-hidden">
      {/* Imagen principal */}
      <div className="h-48 w-full bg-neutral-100 dark:bg-neutral-800">
        <img
          src={p.imageUrl ?? '/og-default.jpg'}
          alt={p.name}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <h3 className="text-base font-semibold">{p.name}</h3>

        {p.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {p.description}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            {p.old_price_cents ? (
              <span className="mr-2 text-neutral-400 line-through">
                {formatCOP(p.old_price_cents)}
              </span>
            ) : null}
            <span className="font-semibold">{formatCOP(p.price_cents)}</span>
          </div>

          {/* OJO: la ruta correcta es /productos/[slug] */}
          <Link href={`/productos/${p.slug}`} className="btn btn-primary">
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}
