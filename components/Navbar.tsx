'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max px-4">
        {/* Fila principal del navbar */}
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
            VibeTech
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/" className="btn btn-outline">Inicio</Link>
            <Link href="/productos" className="btn btn-outline">Productos</Link>
            <Link href="/contacto" className="btn btn-outline">Contacto</Link>
            <ThemeToggle />

            {/* Buscador SOLO escritorio */}
            <form action="/buscar" className="hidden md:flex items-center gap-2">
              <input
                name="q"
                placeholder="Buscar..."
                className="rounded px-3 py-1 text-sm w-48 lg:w-64 bg-neutral-200 dark:bg-neutral-800"
              />
              <button className="text-sm opacity-80 hover:opacity-100">🔍</button>
            </form>
          </nav>
        </div>

        {/* Buscador SOLO móvil (debajo del navbar) */}
        <form action="/buscar" className="md:hidden mt-2 mb-3 flex items-center gap-2">
          <input
            name="q"
            placeholder="Buscar..."
            className="flex-1 rounded px-3 py-2 text-sm bg-neutral-200 dark:bg-neutral-800"
          />
          <button className="btn btn-outline text-sm">Buscar</button>
        </form>
      </div>
    </header>
  );
}
