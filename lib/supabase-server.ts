// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!; // 👈 clave de servicio

if (!url || !service) {
  throw new Error('Missing SUPABASE env vars (URL / SERVICE ROLE KEY)');
}

// Cliente solo-servidor, sin sesión persistente
export const supabaseAdmin = createClient(url, service, {
  auth: { persistSession: false, autoRefreshToken: false },
});
