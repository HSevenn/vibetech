import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function isAuthed(req: Request) {
  const secret = req.headers.get('x-admin-secret') || '';
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const form = await req.formData();
    const files = form.getAll('files') as File[];
    if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const uploaded: string[] = [];
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('products').upload(key, buf, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      uploaded.push(`products/${key}`);
    }
    return NextResponse.json({ paths: uploaded });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
