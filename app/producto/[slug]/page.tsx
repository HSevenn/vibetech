// app/productos/[slug]/page.tsx
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic"; // evita errores por ISR/SSG con slugs nuevos

function formatCOP(val?: number | null) {
  if (val == null) return null;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);
}

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return notFound();

  const price = formatCOP(product.price_cents);
  const oldPrice = formatCOP(product.old_price_cents);

  // images: jsonb en BD -> puede venir null/undefined
  const imgs: string[] = Array.isArray(product.images) ? product.images : [];
  const img0 = imgs[0];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibetechvibe.com";
  const url = `${baseUrl}/productos/${product.slug}`;
  const text = encodeURIComponent(`${product.name} — ${price ?? ""}`);
  const share = {
    wa: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
    ig: url, // Instagram no tiene share web; dejamos link (o copiar)
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl overflow-hidden bg-black/10">
          {img0 ? (
            <img
              src={img0}
              alt={product.name}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          ) : (
            <div className="aspect-video grid place-items-center opacity-60">
              Sin imagen
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.description && (
            <p className="mt-2 opacity-80">{product.description}</p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            {price && <span className="text-2xl font-bold">{price}</span>}
            {oldPrice && (
              <span className="opacity-60 line-through">{oldPrice}</span>
            )}
          </div>

          {/* Botones – mantienen tu estilo; solo enlaces seguros */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn" href={share.wa} target="_blank">WhatsApp</a>
            <a className="btn" href={share.fb} target="_blank">Facebook</a>
            <a className="btn" href={share.x} target="_blank">X</a>
            <a className="btn" href={share.ig} target="_blank">Instagram</a>
            <button
              className="btn"
              onClick={() => navigator.clipboard?.writeText(url)}
            >
              Copiar link
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
