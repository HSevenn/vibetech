// components/ProductCard.tsx
import Link from 'next/link';

function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

export default function ProductCard({
  p,
}: {
  p: {
    slug: string;
    name: string;
    description?: string | null;
    price_cents: number;
    old_price_cents?: number | null;
    imageUrl?: string | null;
  };
}) {
  const discount =
    p.old_price_cents && p.old_price_cents > p.price_cents
      ? Math.max(0, Math.round(100 - (p.price_cents / p.old_price_cents) * 100))
      : null;

  return (
    <article className="card group overflow-hidden">
      {/* Imagen */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={p.imageUrl || '/og-default.jpg'}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="card-body">
        <h3 className="text-base font-semibold line-clamp-2">{p.name}</h3>
        {p.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {p.description}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            {p.old_price_cents ? (
              <span className="text-neutral-400 line-through">
                {formatCOP(p.old_price_cents)}
              </span>
            ) : null}

            <span className="text-base font-semibold">
              {formatCOP(p.price_cents)}
            </span>

            {discount !== null && discount > 0 && (
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-500">
                {discount}% OFF
              </span>
            )}
          </div>

          <Link href={`/productos/${p.slug}`} className="btn btn-primary">
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}
