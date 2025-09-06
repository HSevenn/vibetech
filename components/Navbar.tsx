'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar(){
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      {/* fila superior: logo + botones + búsqueda (solo desktop) */}
      <div className="container-max flex items-center justify-between gap-4 px-4 h-16">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
          VibeTech
        </Link>

        {/* Botones (visibles en móvil y desktop) */}
        <nav className="flex items-center gap-3">
          <Link href="/" className="btn btn-outline">Inicio</Link>
          <Link href="/productos" className="btn btn-outline">Productos</Link>
          <Link href="/contacto" className="btn btn-outline">Contacto</Link>
          <ThemeToggle />

          {/* 🔍 Búsqueda en desktop (compacta + sombra interna como antes) */}
          <form action="/buscar" className="hidden md:flex items-center gap-2">
            <input
              name="q"
              placeholder="Buscar..."
              className="w-48 lg:w-56 bg-white dark:bg-neutral-900 shadow-inner rounded px-3 py-1 text-sm"
            />
            <button className="text-sm opacity-80 hover:opacity-100">🔍</button>
          </form>
        </nav>
      </div>

      {/* 🔍 Búsqueda en móvil (debajo del navbar) */}
      <div className="md:hidden px-4 pb-3">
        <form action="/buscar" className="flex items-center gap-2">
          <input
            name="q"
            placeholder="Buscar..."
            className="flex-1 bg-white dark:bg-neutral-900 shadow-inner rounded px-3 py-2 text-sm"
          />
          <button className="px-3 py-2 border rounded text-sm">Buscar</button>
        </form>
      </div>
    </header>
  );
}
