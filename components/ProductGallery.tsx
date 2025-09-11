'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
    );
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl cursor-pointer"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="relative w-16 h-16 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:ring-2 hover:ring-neutral-400"
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
        plugins={[Fullscreen, Zoom]}
      />
    </div>
  );
}
