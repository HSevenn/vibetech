// components/ProductImage.tsx
type Props = {
  src: string;
  alt: string;
};

export default function ProductImage({ src, alt }: Props) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden border bg-neutral-100 dark:bg-neutral-900">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
