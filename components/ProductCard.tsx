// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { formatCOP } from '@/lib/format';

function getDiscount(p: Product) {
  if (!p.old_price_cents || p.old_price_cents <= p.price_cents) return null;
  const pct = Math.max(0, Math.round(100 - (p.price_cents / p.old_price_cents) * 100));
  return pct > 0 ? pct : null;
}

export default function ProductCard({ p }: { p: Product }) {
  const off = getDiscount(p);
  const img = p.imageUrl || '/og-default.jpg';

  return (
    <Link
      href={`/productos/${p.slug}`}
      className="card block overflow-hidden transition-shadow hover:shadow-lg"
    >
      {/* Imagen con hover-zoom y borde redondeado */}
      <div className="relative m-3 overflow-hidden rounded-xl">
        <div className="relative aspect-[4/3]">
          <Image
            src={img}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 hover:scale-105"
            priority={false}
          />
        </div>
      </div>

      <div className="card-body">
        <h3 className="text-base font-semibold hover:underline">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {p.description ?? ''}
        </p>

        {/* Precio actual + precio tachado + badge de descuento TODO junto */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-semibold">{formatCOP(p.price_cents)}</span>

          {p.old_price_cents && p.old_price_cents > p.price_cents && (
            <>
              <span className="text-sm line-through opacity-60">
                {formatCOP(p.old_price_cents)}
              </span>
              {off !== null && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-500">
                  {off}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
