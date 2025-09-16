// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { formatCOP } from '@/lib/format';

function getDiscount(p: Product) {
  if (!p.old_price_cents || p.old_price_cents <= p.price_cents) return null;
  const pct = Math.max(
    0,
    Math.round(100 - (p.price_cents / p.old_price_cents) * 100)
  );
  return pct > 0 ? pct : null;
}

export default function ProductCard({ p }: { p: Product }) {
  const off = getDiscount(p);
  const img = p.imageUrl || '/og-default.jpg';

  // ➜ AÑADIDO: bandera para mostrar el cartel solo si stock === 0
  const agotado = p.stock === 0;

  return (
    <Link
      href={`/productos/${p.slug}`}
      className="group block rounded-xl border border-transparent bg-white dark:bg-neutral-900 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-xl select-none"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <Image
          src={img}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          priority={false}
        />

        {/* ➜ AÑADIDO: cartel AGOTADO (sin tocar tu diseño) */}
        {agotado && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="backdrop-blur-md bg-black/40 px-6 py-2 rounded-md">
              <span className="text-white font-bold text-lg tracking-wide">AGOTADO</span>
            </div>
          </div>
        )}
      </div>

      {/* Texto */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
          {p.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {p.description ?? ''}
        </p>

        {/* Precio + descuento */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {formatCOP(p.price_cents)}
          </span>

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
