'use client';

import { useMemo, useState, useRef } from 'react';

type Props = {
  images: string[];   // URLs absolutas o relativas
  alt: string;        // texto alternativo base
};

export default function ProductGallery({ images, alt }: Props) {
  const pics = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []).slice(0, 12),
    [images]
  );
  const [idx, setIdx] = useState(0);

  // Gestos touch (deslizar)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) prev();     // swipe derecha -> foto anterior
    if (dx < -40) next();    // swipe izquierda -> siguiente
    touchStartX.current = null;
  };

  const prev = () => setIdx((i) => (i - 1 + pics.length) % pics.length);
  const next = () => setIdx((i) => (i + 1) % pics.length);

  if (pics.length === 0) {
    return <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />;
  }

  return (
    <div className="w-full">
      {/* Imagen principal */}
      <div
        className="relative overflow-hidden rounded-lg border aspect-[4/3] bg-white dark:bg-neutral-900"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={pics[idx]}
          src={pics[idx]}
          alt={`${alt} (${idx + 1}/${pics.length})`}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />

        {pics.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur hover:bg-black/60"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur hover:bg-black/60"
              aria-label="Siguiente"
            >
              ›
            </button>

            <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {pics.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'} `}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tiras de miniaturas */}
      {pics.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {pics.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded border ${
                i === idx ? 'ring-2 ring-neutral-900 dark:ring-white' : ''
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={src} alt={`${alt} miniatura ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
