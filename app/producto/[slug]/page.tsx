// app/productos/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProductBySlug, publicUrl } from "@/lib/products";

export const dynamic = "force-dynamic";

function formatCOP(val?: number | null) {
  if (val == null) return null;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);
}

export default async function ProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return notFound();

  // Usa imageUrl si viene desde lib, si no, arma la pública con el primer path del array
  const cover =
    product.imageUrl ??
    (Array.isArray(product.images) && product.images[0]
      ? publicUrl(product.images[0])
      : null);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen / galería */}
        <div className="rounded-xl border p-4">
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
          ) : (
            <div className="aspect-[4/3] w-full rounded-md bg-neutral-800" />
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          {product.description && (
            <p className="mb-4 text-sm opacity-80">{product.description}</p>
          )}

          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {formatCOP(product.price_cents)}
            </span>
            {product.old_price_cents && (
              <span className="text-sm line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Link href="/contacto" className="btn btn-primary">
              Comprar por WhatsApp
            </Link>
            <Link href="/productos" className="btn btn-outline">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
