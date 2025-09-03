
'use client';
import Link from 'next/link';
import products from '@/data/products.json';
import { useEffect, useRef, useState } from 'react';

export default function HeroSlider(){
  const items = products as any[];
  const [i, setI] = useState(0);
  const timer = useRef<any>(null);
  useEffect(()=>{ timer.current = setInterval(()=>setI(v=>(v+1)%items.length), 4500); return ()=>clearInterval(timer.current); },[items.length]);
  const prev = ()=> setI(v => (v - 1 + items.length) % items.length);
  const next = ()=> setI(v => (v + 1) % items.length);
  const current = items[i];
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[16/10] relative">
        <img src={current.image} alt={current.title} className="h-full w-full object-cover" />
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <button onClick={prev} className="btn btn-outline">←</button>
          <button onClick={next} className="btn btn-outline">→</button>
        </div>
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <Link href={`/producto/${current.slug}`} className="btn btn-primary">Ver producto</Link>
        </div>
      </div>
    </div>
  );
}
