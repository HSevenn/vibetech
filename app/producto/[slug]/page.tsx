// app/producto/[slug]/page.tsx
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/products";

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen principal */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              Sin imagen
            </div>
          )}
        </div>

        {/* Info del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-400 mb-4">{product.description}</p>

          <div className="mb-6">
            <span className="text-2xl font-semibold text-green-400">
              {formatCOP(product.price_cents)}
            </span>
            {product.old_price_cents && (
              <span className="ml-3 text-lg line-through text-gray-500">
                {formatCOP(product.old_price_cents)}
              </span>
            )}
          </div>

          {/* Botones de contacto */}
          <div className="flex flex-wrap gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/573001112233?text=Hola! Estoy interesado en el producto: ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 transition"
            >
              Comprar por WhatsApp
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/vibetech"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 text-gray-300 px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Facebook
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/vibetech"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 text-gray-300 px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              X
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/vibetech"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 text-gray-300 px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic"; // evita errores con slugs nuevos

function formatCOP(val: number | null) {
  if (val == null) return null;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);
}
