'use client';

import { useState } from 'react';

type Props = {
  images?: string[] | null;     // 👈 ahora recibe el array de imágenes
  alt: string;
  fallback?: string | null;     // opcional: por si quieres enviar imageUrl único
};

// Convierte una ruta relativa de Storage (ej: "products/1.jpg")
// a URL pública absoluta de Supabase.
// Si ya viene absoluta (http/https), la deja igual.
function toPublicUrl(path?: string | null): string | null {
  if (!path) return null;
  const s = String(path).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const clean = s.replace(/^\/+/, ''); // sin / iniciales duplicados
  return `${base}/storage/v1/object/public/${clean}`;
}

export default function ProductImage({ images, alt, fallback }: Props) {
  // Normalizamos todas las rutas
  const normalized = (images ?? [])
    .map(toPublicUrl)
    .filter((u): u is string => !!u);

  // Si no hay imágenes, usamos el fallback (imageUrl)
  if (!normalized.length) {
    const f = toPublicUrl(fallback);
    if (f) normalized.push(f);
  }

  // Si aún no hay, mostramos un placeholder
  if (!normalized.length) {
    return (
      <div className="w-full aspect-square rounded-lg border bg-neutral-100 dark:bg-neutral-900" />
    );
  }

  const [idx, setIdx] = useState(0);
  const go = (n: number) => setIdx((old) => (old + n + normalized.length) % normalized.length);

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-neutral-100 dark:bg-neutral-900">
        <img
          src={normalized[idx]}
          alt={`${alt} (${idx + 1}/${normalized.length})`}
          className="w-full h-full object-contain"  // contain para que no se corte
          loading="eager"
        />

        {/* Flechas (opcionales) */}
        {normalized.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-1 text-sm"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(+1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-1 text-sm"
              aria-label="Siguiente"
            >
              ›
            </button>
          </>
        )}

        {/* Indicador 1/3 */}
        {normalized.length > 1 && (
          <span className="absolute left-2 top-2 rounded bg-black/40 px-2 py-0.5 text-xs text-white">
            {idx + 1}/{normalized.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {normalized.length > 1 && (
        <div className="flex gap-2">
          {normalized.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded border ${
                i === idx ? 'ring-2 ring-neutral-500 dark:ring-neutral-300' : ''
              }`}
              aria-label={`Miniatura ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
