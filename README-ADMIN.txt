VibeTech · Admin CRUD (Next.js + Supabase)
==========================================

Este paquete agrega un CRUD mínimo de productos en /admin sin tocar tu sitio público.

Archivos agregados:
- middleware.ts
- app/admin/layout.tsx
- app/admin/productos/page.tsx
- app/admin/productos/nuevo/page.tsx
- app/admin/productos/[id]/page.tsx
- lib/admin/supabase.ts
- lib/admin/products.ts

Variables de entorno (Vercel):
- ADMIN_USER           -> usuario para Basic Auth (ej: vibetech)
- ADMIN_PASS           -> contraseña para Basic Auth
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY  (solo server)

SQL no destructivo (opcional, para preparar 'visible' e 'images'):
-----------------------------------------------------------------
alter table public.products
  add column if not exists visible boolean default true,
  add column if not exists images jsonb default '[]'::jsonb;

Checklist de prueba:
1) Deploy con envs configuradas.
2) Visita /admin/productos -> debe pedir usuario/contraseña (Basic Auth).
3) Crea un producto en /admin/productos/nuevo.
4) Verifica que aparece en /productos y su detalle.
5) Edita/borrar desde /admin y verifica cambios.

Notas:
- Las Server Actions usan la SUPABASE_SERVICE_ROLE_KEY del servidor.
- No se tocaron rutas públicas ni componentes del catálogo.
- Cuando quieras múltiples fotos: usa la columna 'images' (array de URLs) y en el frontend muestra galería si images.length > 1.
