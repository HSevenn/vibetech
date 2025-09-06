'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchFeaturedProducts, publicUrl } from '@/lib/products';

type Item = { slug: string; name: string; imageUrl?: string | null; images?: string[] | null };

export default function HeroSlider() {
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchFeaturedProducts(6);
        // si por alguna razón imageUrl no viene, construimos desde images[0]
        const normalized = (list ?? [])
          .map(p => ({
            ...p,
            imageUrl: p.imageUrl ?? (Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : null),
          }))
          .filter(p => !!p.imageUrl) // solo con imagen
          .map(p => ({ slug: p.slug, name: p.name, imageUrl: p.imageUrl }));

        if (mounted) {
          setItems(normalized);
          console.log('[HeroSlider] destacados:', normalized.length);
        }
      } catch (e) {
        console.error('[HeroSlider] error:', e);
        if (mounted) setItems([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => setI(v => (v + 1) % items.length), 4500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [items.length]);

  const prev = () => setI(v => (v - 1 + (items.length || 1)) % (items.length || 1));
  const next = () => setI(v => (v + 1) % (items.length || 1));
  const current = items[i];

  // Esqueleto si aún no hay elementos
  if (!current) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="aspect-[16/10] animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[16/10] relative">
        <img
          src={current.imageUrl!}
          alt={current.name}
          className="h-full w-full object-cover"
          loading="eager"
        />

        {/* Botones internos ocultos, los dejamos por si luego quieres activarlos */}
        {false && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <button onClick={prev} className="btn btn-outline">←</button>
            <button onClick={next} className="btn btn-outline">→</button>
          </div>
        )}

        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <Link href={`/productos/${current.slug}`} className="btn btn-primary">Ver producto</Link>
        </div>
      </div>
    </div>
  );
}
