'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchFeaturedProducts, publicUrl } from '@/lib/products';

type Item = {
  slug: string;
  name: string;
  imageUrl?: string | null;
  images?: string[] | null;
  price_cents: number;
  old_price_cents?: number | null;
};

// Formateador COP
function formatCOP(cents: number) {
  return cents.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}

export default function HeroSlider() {
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchFeaturedProducts(6);
        const normalized: Item[] = (list ?? [])
          .map((p: any) => ({
            ...p,
            imageUrl:
              p.imageUrl ??
              (Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : null),
          }))
          .filter((p: Item) => !!p.imageUrl)
          .map((p: any) => ({
            slug: p.slug,
            name: p.name,
            imageUrl: p.imageUrl,
            price_cents: p.price_cents,
            old_price_cents: p.old_price_cents ?? null,
          }));

        if (mounted) setItems(normalized);
      } catch (e) {
        console.error('[HeroSlider] error:', e);
        if (mounted) setItems([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setI((v) => (v + 1) % items.length), 4500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [items.length]);

  const prev = () => setI((v) => (v - 1 + (items.length || 1)) % (items.length || 1));
  const next = () => setI((v) => (v + 1) % (items.length || 1));
  const current = items[i];

  if (!current) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="aspect-[16/10] animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      </div>
    );
  }

  // % descuento si aplica
  const discount =
    current.old_price_cents && current.old_price_cents > current.price_cents
      ? Math.max(0, Math.round(100 - (current.price_cents / current.old_price_cents) * 100))
      : null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[16/10] relative">
        <img
          src={current.imageUrl!}
          alt={current.name}
          className="h-full w-full object-cover"
          loading="eager"
        />

        {/* Controles minimalistas */}
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full backdrop-blur bg-white/50 dark:bg-neutral-900/40 border border-white/60 dark:border-neutral-800 px-2.5 py-2 shadow-sm hover:bg-white/70 dark:hover:bg-neutral-900/60 transition"
        >
          ←
        </button>
        <button
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full backdrop-blur bg-white/50 dark:bg-neutral-900/40 border border-white/60 dark:border-neutral-800 px-2.5 py-2 shadow-sm hover:bg-white/70 dark:hover:bg-neutral-900/60 transition"
        >
          →
        </button>

        {/* Overlay inferior con gradiente: nombre + precios + badge + CTA */}
        <div
          className="
            absolute inset-x-0 bottom-0
            bg-gradient-to-t from-black/70 via-black/30 to-transparent
            px-4 sm:px-5 py-3 sm:py-4
            text-white
            flex items-end justify-between gap-3
          "
        >
          <div className="min-w-0">
            <h3 className="truncate text-base sm:text-lg font-semibold drop-shadow-md">
              {current.name}
            </h3>

            <div className="mt-0.5 flex items-center gap-2">
              {/* Precio actual más grande */}
              <span className="text-lg sm:text-xl font-bold drop-shadow">
                {formatCOP(current.price_cents)}
              </span>

              {/* Precio anterior pequeño y tachado */}
              {current.old_price_cents ? (
                <span className="text-xs sm:text-sm line-through opacity-80">
                  {formatCOP(current.old_price_cents)}
                </span>
              ) : null}

              {/* Badge de descuento (mismo look que en cards) */}
              {discount !== null && discount > 0 && (
                <span className="ml-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-green-900/30 text-green-400">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/productos/${current.slug}`}
            className="
              btn btn-outline
              bg-white/90 text-neutral-900 hover:bg-white
              dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-900
              whitespace-nowrap
            "
          >
            Ver producto
          </Link>
        </div>
      </div>
    </div>
  );
}
