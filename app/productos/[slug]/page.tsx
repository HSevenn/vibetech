// app/productos/[slug]/page.tsx
import Link from 'next/link'
import { fetchProductBySlug, formatPrice, publicUrl } from '@/lib/products'

type Props = { params: { slug: string } }

export default async function ProductDetailPage({ params }: Props) {
  const product = await fetchProductBySlug(params.slug)
  if (!product) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p>Producto no encontrado.</p>
        <Link href="/productos" className="underline">Volver</Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Imagen principal */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full object-cover"
            style={{ aspectRatio: '16/10' }}
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-extrabold">{product.name}</h1>
          <p className="mt-2 opacity-80">{product.description}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price_cents)}</span>
            {product.old_price_cents && (
              <span className="text-lg line-through opacity-60">
                {formatPrice(product.old_price_cents)}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/productos" className="rounded-md border border-white/30 px-4 py-2 font-semibold hover:bg-white/10">
              Volver
            </Link>
          </div>

          {/* Botones sociales transparentes */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${product.name} — ${formatPrice(product.price_cents)} · ${publicUrl(`/productos/${product.slug}`)}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-md border border-white/30 px-4 py-2 font-semibold hover:bg-white/10"
            >
              WhatsApp
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl(`/productos/${product.slug}`))}`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-md border border-white/30 px-4 py-2 font-semibold hover:bg-white/10"
            >
              Facebook
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl(`/productos/${product.slug}`))}&text=${encodeURIComponent(product.name)}`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-md border border-white/30 px-4 py-2 font-semibold hover:bg-white/10"
            >
              X
            </a>

            <button
              onClick={async () => {
                await navigator.clipboard.writeText(publicUrl(`/productos/${product.slug}`))
                alert('Link copiado')
              }}
              className="rounded-md border border-white/30 px-4 py-2 font-semibold hover:bg-white/10"
            >
              Copiar link
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}