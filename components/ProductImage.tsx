// components/ProductImage.tsx
type Props = {
  src?: string | null;
  alt: string;
};

/** Normaliza la URL:
 * - si viene null/'' usa un placeholder
 * - encodeURI para espacios y caracteres raros
 */
function normalizeSrc(src?: string | null) {
  const FALLBACK = '/og-default.jpg';
  if (!src) return FALLBACK;

  // si ya es absoluta o relativa, solo saneamos
  try {
    // encode espacios, paréntesis, etc.
    const encoded = encodeURI(src);
    // si encoded ya forma una URL válida, devuélvela
    // (esto no rompe paths relativos)
    return encoded;
  } catch {
    return FALLBACK;
  }
}

export default function ProductImage({ src, alt }: Props) {
  const finalSrc = normalizeSrc(src);

  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden border bg-neutral-100 dark:bg-neutral-900">
      <img
        src={finalSrc}
        alt={alt}
        className="w-full h-full object-contain"
        loading="eager"
        // Si falla la carga, muestra el placeholder
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.src.endsWith('/og-default.jpg')) return;
          img.src = '/og-default.jpg';
        }}
      />
    </div>
  );
}
