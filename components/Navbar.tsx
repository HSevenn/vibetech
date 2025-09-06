'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-2">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href="/"
            className="text-lg md:text-xl font-semibold tracking-tight"
          >
            VibeTech
          </Link>
        </div>

        {/* Navegación + buscador */}
        <nav className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn btn-outline">
              Inicio
            </Link>
            <Link href="/productos" className="btn btn-outline">
              Productos
            </Link>
            <Link href="/contacto" className="btn btn-outline">
              Contacto
            </Link>
            <ThemeToggle />
          </div>

          {/* Buscador */}
          <form
            action="/buscar"
            className="flex w-full md:w-auto items-center gap-2 mt-2 md:mt-0"
          >
            <input
              name="q"
              placeholder="Buscar..."
              className="w-full md:w-64 rounded px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
            <button className="text-sm opacity-80 hover:opacity-100">🔍</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
