
'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchFeaturedProducts } from '@/lib/products';

type Item = { slug: string; name: string; imageUrl?: string | null };

export default function HeroSlider(){
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const timer = useRef<any>(null);

  useEffect(()=>{
    let mounted = true;
    (async () => {
      try{
        const list = await fetchFeaturedProducts(6);
        const normalized = list
          .filter(p => p.imageUrl)
          .map(p => ({ slug: p.slug, name: p.name, imageUrl: p.imageUrl }));
        if (mounted) setItems(normalized);
      }catch(e){
        // si falla, dejamos items vacío; el contenedor no se rompe
        if (mounted) setItems([]);
      }
    })();
    return ()=>{ mounted = false; }
  },[]);

  useEffect(()=>{
    if (!items.length) return;
    timer.current = setInterval(()=>setI(v => (v+1) % items.length), 4500);
    return ()=> clearInterval(timer.current);
  },[items.length]);

  const prev = ()=> setI(v => (v - 1 + (items.length||1)) % (items.length||1));
  const next = ()=> setI(v => (v + 1) % (items.length||1));
  const current = items[i];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[16/10] relative">
        {current?.imageUrl ? (
          <img src={current.imageUrl!} alt={current.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800" />
        )}
        {/* Ocultamos los botones de navegación dentro del slide */}
        {false && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <button onClick={prev} className="btn btn-outline">←</button>
            <button onClick={next} className="btn btn-outline">→</button>
          </div>
        )}
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          {current ? (
            <Link href={`/productos/${current.slug}`} className="btn btn-primary">Ver producto</Link>
          ) : (
            <Link href={`/productos`} className="btn btn-primary">Ver producto</Link>
          )}
        </div>
      </div>
    </div>
  );
}
