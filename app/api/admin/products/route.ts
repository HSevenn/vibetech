import { NextResponse } from 'next/server';

function isAuthed(req: Request) {
  const secret = req.headers.get('x-admin-secret') || '';
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();

    const required = ['slug','name','price_cents','images'];
    for (const k of required) {
      if (k === 'images') {
        if (!Array.isArray(body.images) || body.images.length === 0) {
          return NextResponse.json({ error: 'Falta images' }, { status: 400 });
        }
      } else if (!body[k]) {
        return NextResponse.json({ error: `Falta ${k}` }, { status: 400 });
      }
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        slug: body.slug,
        name: body.name,
        description: body.description ?? '',
        price_cents: Number(body.price_cents),
        old_price_cents: body.old_price_cents ? Number(body.old_price_cents) : null,
        stock: Number(body.stock ?? 0),
        images: body.images,
        tags: body.tags ?? null,
        is_active: body.is_active !== false,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: await res.text() }, { status: 500 });
    }
    const created = await res.json();
    return NextResponse.json(created[0] ?? { ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
