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
  // ✅ Solo se marca agotado si stock === 0
  const agotado = p.stock === 0;
  const off = getDiscount(p);

  return (
    <Link
      href={`/productos/${p.slug}`}
      className={`block relative rounded-lg overflow-hidden border bg-white transition hover:shadow-sm ${
        agotado ? 'opacity-90' : ''
      }`}
    >
      {/* Imagen principal */}
      <div className="relative aspect-square">
        <Image
          src={p.imageUrl || '/placeholder.png'}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />

        {/* Franja difuminada AGOTADO */}
        {agotado && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="backdrop-blur-md bg-black/40 px-6 py-2 rounded-md">
              <span className="text-white font-bold text-lg md:text-xl tracking-wide">
                AGOTADO
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium line-clamp-2">{p.name}</h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatCOP(p.price_cents)}</span>

          {p.old_price_cents && p.old_price_cents > p.price_cents && (
            <>
              <span className="text-xs text-neutral-500 line-through">
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
