'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between gap-6 px-4">
        {/* Brand */}
        <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
          VibeTech
        </Link>

        {/* Nav + search (desktop) */}
        <nav className="hidden md:flex items-center gap-3">
          <Link href="/" className="btn btn-outline">Inicio</Link>
          <Link href="/productos" className="btn btn-outline">Productos</Link>
          <Link href="/contacto" className="btn btn-outline">Contacto</Link>
          <ThemeToggle />

          {/* Search (desktop, corto) */}
          <form action="/buscar" className="ml-2 flex items-center gap-2">
            <input
              name="q"
              placeholder="Buscar..."
              className="
                w-52 lg:w-56
                bg-white dark:bg-neutral-900
                border border-neutral-200 dark:border-neutral-800
                rounded-md px-3 py-1.5 text-sm
                placeholder:text-neutral-500
                shadow-inner
                focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-800
              "
            />
            <button
              className="
                rounded-md px-3 py-1.5 text-sm
                border border-neutral-300 dark:border-neutral-700
                bg-white/80 dark:bg-neutral-900/80
                hover:bg-neutral-50 dark:hover:bg-neutral-800
              "
              aria-label="Buscar"
            >
              🔍
            </button>
          </form>
        </nav>
      </div>

      {/* Search (mobile, debajo del navbar) */}
      <div className="md:hidden px-4 pb-3">
        <form action="/buscar" className="flex items-center gap-2">
          <input
            name="q"
            placeholder="Buscar..."
            className="
              flex-1
              bg-white dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-800
              rounded-md px-3 py-2 text-sm
              placeholder:text-neutral-500
              shadow-inner
              focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-800
            "
          />
          <button
            className="
              rounded-md px-3 py-2 text-sm
              border border-neutral-300 dark:border-neutral-700
              bg-white/80 dark:bg-neutral-900/80
              hover:bg-neutral-50 dark:hover:bg-neutral-800
            "
          >
            Buscar
          </button>
        </form>
      </div>
    </header>
  );
}
