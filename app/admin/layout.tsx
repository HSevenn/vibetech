// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <header className="border-b px-4 py-3 flex items-center justify-between">
          <b>VibeTech · Admin</b>
          <nav className="text-sm">
            <a className="underline" href="/admin/productos">Productos</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
