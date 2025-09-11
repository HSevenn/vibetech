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
      className="
        group block rounded-2xl border border-neutral-200 bg-white shadow-sm
        transition-all duration-300
        hover:shadow-xl hover:border-neutral-300
        dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300
        select-none cursor-pointer
      "
    >
      {/* Imagen con zoom sutil al hover */}
      <div className="relative m-3 overflow-hidden rounded-xl">
        <div className="relative aspect-[4/3]">
          <Image
            src={img}
            alt={p.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={false}
          />
        </div>
      </div>

      <div className="p-4">
        {/* Título: no seleccionable y subrayado al hover */}
        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:underline">
          {p.name}
        </h3>

        {/* Extracto / descripción corta */}
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {p.description ?? ''}
        </p>

        {/* Precio + tachado + badge JUNTOS (como la portada) */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[1.25rem] leading-none font-bold tracking-tight">
            {formatCOP(p.price_cents)}
          </span>

          {p.old_price_cents && p.old_price_cents > p.price_cents && (
            <>
              <span className="text-sm line-through opacity-60">
                {formatCOP(p.old_price_cents)}
              </span>
              {off !== null && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded
                             bg-green-900/30 text-green-500"
                >
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
