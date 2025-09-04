import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function fetchByName(q: string) {
  if (!q) return [];
  const u = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`);
  u.searchParams.set('name', `ilike.*${q}*`);
  u.searchParams.set('is_active', 'eq.true');
  u.searchParams.set('order', 'created_at.desc');
  const res = await fetch(u.toString(), {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

function publicUrl(path?: string) {
  if (!path) return '';
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export default async function BuscarPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim();
  const results = await fetchByName(q);

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Buscar</h1>
      <form action="/buscar" method="get" className="mb-6 flex gap-2">
        <input name="q" defaultValue={q} className="bg-neutral-900 rounded p-2 w-full max-w-lg" placeholder="Buscar por nombre..." />
        <button className="rounded bg-white/10 px-4">Buscar</button>
      </form>

      {!q && <p className="opacity-70">Escribe algo arriba para buscar.</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p: any) => {
          const cover = Array.isArray(p.images) && p.images[0] ? publicUrl(p.images[0]) : '';
          return (
            <Link key={p.id} href={`/productos/${p.slug}`} className="rounded-xl border p-4 block hover:bg-neutral-900/40">
              {cover && <img src={cover} alt={p.name} className="aspect-[4/3] w-full object-cover rounded-md mb-3" />}
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm opacity-80 line-clamp-2">{p.description}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
