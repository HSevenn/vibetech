
export default function ProductJsonLd({ p, url }: { p: any; url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.excerpt,
    image: p.image ? [p.image] : [],
    brand: { "@type": "Brand", name: "VibeTech" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "COP",
      price: String(p.priceCOP),
      availability: (p.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
