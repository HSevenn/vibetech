// components/ProductImage.tsx
type Props = {
  src: string;
  alt: string;
};

// Convierte cualquier ruta a URL absoluta válida
function toAbsolute(src?: string | null): string {
  if (!src) return '/og-default.jpg'; // fallback
  const trimmed = String(src).trim();

  // si ya es absoluta (http/https), la usamos directo
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // si es relativa, la convertimos a pública en Supabase
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const clean = trimmed.replace(/^\/+/, ''); // quita / iniciales
  return `${base}/storage/v1/object/public/${clean}`;
}

export default function ProductImage({ src, alt }: Props) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden border bg-neutral-100 dark:bg-neutral-900">
      <img
        src={toAbsolute(src)}
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
