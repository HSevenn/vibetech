
'use client';
import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ProductsFilters({ items }: { items: any[] }){
  const [sort, setSort] = useState<'relevance'|'price-asc'|'price-desc'>('relevance');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  const products = useMemo(()=>{
    const arr = [...items];
    const minV = Number(min) || 0;
    const maxV = Number(max) || Infinity;
    const filtered = arr.filter(p => (p.priceCOP??0) >= minV && (p.priceCOP??0) <= maxV);
    if (sort === 'price-asc') return filtered.sort((a,b)=> (a.priceCOP??0) - (b.priceCOP??0));
    if (sort === 'price-desc') return filtered.sort((a,b)=> (b.priceCOP??0) - (a.priceCOP??0));
    return filtered;
  }, [items, sort, min, max]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 border rounded-lg p-4">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Ordenar</label>
          <select value={sort} onChange={e=>setSort(e.target.value as any)} className="select">
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Precio mínimo (COP)</label>
          <input className="input w-36" value={min} onChange={e=>setMin(e.target.value)} placeholder="0" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Precio máximo (COP)</label>
          <input className="input w-36" value={max} onChange={e=>setMax(e.target.value)} placeholder="500000" />
        </div>
      </div>
      <div className="grid-products">
        {products.map((p:any)=> <ProductCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}
