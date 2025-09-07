// components/ProductImage.tsx
type Props = {
  src: string;
  alt: string;
};

export default function ProductImage({ src, alt }: Props) {
  return (
    <div className="w-full aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
