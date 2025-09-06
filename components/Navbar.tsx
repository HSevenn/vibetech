'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
          VibeTech
        </Link>

        {/* Navegación */}
        <nav className="flex flex-1 items-center gap-3">
          <Link href="/" className="btn btn-outline">
            Inicio
          </Link>
          <Link href="/productos" className="btn btn-outline">
            Productos
          </Link>
          <Link href="/contacto" className="btn btn-outline">
            Contacto
          </Link>

          {/* Botón de tema */}
          <ThemeToggle />

          {/* Buscador responsivo */}
          <form
            action="/buscar"
            className="flex w-full sm:w-auto items-center gap-2 ml-auto"
          >
            <input
              name="q"
              placeholder="Buscar..."
              className="
                w-full sm:w-48
                rounded px-3 py-1 text-sm
                border border-neutral-300 dark:border-neutral-700
                bg-white dark:bg-neutral-900
                text-neutral-800 dark:text-neutral-200
                placeholder-neutral-500 dark:placeholder-neutral-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
            <button
              type="submit"
              className="px-2 py-1 rounded text-sm border border-neutral-300 dark:border-neutral-700 
                         hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              🔍
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
