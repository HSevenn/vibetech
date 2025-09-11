// components/ProductCard.tsx
import Link from 'next/link';
import { formatCOP } from '@/lib/format';
import type { Product } from '@/lib/products';

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card overflow-hidden">
      {/* Imagen principal */}
      <img
        src={p.imageUrl || '/og-default.jpg'}
        alt={p.name}
        className="h-48 w-full object-cover"
      />

      <div className="card-body">
        {/* Nombre */}
        <h3 className="text-base font-semibold line-clamp-1">{p.name}</h3>

        {/* Descripción corta */}
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {p.description}
        </p>

        {/* Precio */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            {p.old_price_cents ? (
              <span className="mr-2 text-neutral-400 line-through">
                {formatCOP(p.old_price_cents)}
              </span>
            ) : null}
            <span className="font-semibold">{formatCOP(p.price_cents)}</span>
          </div>

          {/* Link al detalle */}
          <Link
            href={`/productos/${p.slug}`}
            className="btn btn-primary"
          >
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}
