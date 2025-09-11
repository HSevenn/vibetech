'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const wrap = useRef<HTMLDivElement | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
    );
  }

  // helpers
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // keyboard navigation when focused
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  // touch swipe (simple)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    let startX = 0;
    let isTouching = false;

    const onStart = (e: TouchEvent) => {
      isTouching = true;
      startX = e.touches[0].clientX;
    };
    const onMove = (e: TouchEvent) => {
      if (!isTouching) return;
      const dx = e.touches[0].clientX - startX;
      // umbral ~50px
      if (dx > 50) {
        prev();
        isTouching = false;
      } else if (dx < -50) {
        next();
        isTouching = false;
      }
    };
    const onEnd = () => (isTouching = false);

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd);

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Principal + arrows */}
      <div
        ref={wrap}
        tabIndex={0}
        className="relative aspect-square overflow-hidden rounded-xl outline-none"
      >
        {/* Imagen (click -> abre lightbox en la foto actual) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0"
          aria-label="Abrir galería"
        >
          <Image
            key={index}
            src={images[index]}
            alt={`${alt} (${index + 1}/${images.length})`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </button>

        {/* Flecha izquierda */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-2 backdrop-blur-sm hover:bg-black/50 focus:ring-2 focus:ring-white"
              aria-label="Anterior"
            >
              ‹
            </button>
            {/* Flecha derecha */}
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-2 backdrop-blur-sm hover:bg-black/50 focus:ring-2 focus:ring-white"
              aria-label="Siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-md border transition ${
                i === index
                  ? 'border-neutral-900 dark:border-neutral-100'
                  : 'border-neutral-200 hover:ring-2 hover:ring-neutral-400 dark:border-neutral-700'
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox opcional */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        on={{ view: ({ index: i }) => setIndex(i) }}
        slides={images.map((src) => ({ src }))}
        plugins={[Fullscreen, Zoom]}
      />
    </div>
  );
}
