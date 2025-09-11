// components/ProductCard.tsx
import Link from 'next/link';
import { formatCOP } from '@/lib/format';

type CardProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price_cents: number;
  old_price_cents?: number | null;
  imageUrl?: string | null;
};

export default function ProductCard({ p }: { p: CardProduct }) {
  const discount =
    p.old_price_cents && p.old_price_cents > p.price_cents
      ? Math.max(0, Math.round(100 - (p.price_cents / p.old_price_cents) * 100))
      : null;

  return (
    <Link href={`/productos/${p.slug}`} className="block group">
      <article className="card hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl m-3">
          <img
            src={p.imageUrl ?? '/og-default.jpg'}
            alt={p.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>

        <div className="card-body pt-0">
          <h3 className="text-base font-semibold group-hover:underline">
            {p.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {p.description ?? ''}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-lg font-bold">{formatCOP(p.price_cents)}</span>

            {p.old_price_cents ? (
              <span className="text-sm line-through opacity-60">
                {formatCOP(p.old_price_cents)}
              </span>
            ) : null}

            {discount !== null && discount > 0 && (
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-500">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
