// app/productos/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProductBySlug, publicUrl, type Product } from "@/lib/products";

export const dynamic = "force-dynamic"; // evita cachés 404 mientras agregas productos

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

  // Imagen de portada: usa imageUrl si viene calculada; si no, genera desde images[0]
  const cover =
    (product as any).imageUrl ??
    (Array.isArray(product.images) && product.images[0]
      ? publicUrl(product.images[0])
      : null);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border p-4">
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover rounded-lg"
              loading="eager"
            />
          ) : (
            <div className="aspect-[4/3] w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          )}
        </section>

        <section>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.description && (
            <p className="text-sm opacity-80 mb-6">{product.description}</p>
          )}

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-2xl font-extrabold">
              {formatCOP(product.price_cents)}
            </span>
            {product.old_price_cents && (
              <span className="text-sm line-through opacity-60">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Comprar por WhatsApp
            </a>
            <Link href="/productos" className="btn btn-outline">
              Volver a productos
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
