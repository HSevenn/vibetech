'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max px-4">
        {/* Fila principal */}
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
            VibeTech
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/" className="btn btn-outline">Inicio</Link>
            <Link href="/productos" className="btn btn-outline">Productos</Link>
            <Link href="/contacto" className="btn btn-outline">Contacto</Link>

            <ThemeToggle />

            {/* Búsqueda escritorio (igual que antes) */}
            <form action="/buscar" className="hidden md:flex items-center gap-2">
              <input
                name="q"
                placeholder="Buscar..."
                className="rounded px-3 py-1 text-sm bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <button className="text-sm opacity-80 hover:opacity-100" aria-label="Buscar">
                🔍
              </button>
            </form>

            {/* Botón para abrir búsqueda en móvil */}
            <button
              type="button"
              onClick={() => setShowSearch((v) => !v)}
              className="md:hidden btn btn-outline px-3"
              aria-label="Abrir búsqueda"
            >
              🔍
            </button>
          </nav>
        </div>

        {/* Búsqueda móvil (solo se muestra cuando se abre) */}
        {showSearch && (
          <form action="/buscar" className="md:hidden flex items-center gap-2 py-2">
            <input
              name="q"
              placeholder="Buscar..."
              className="flex-1 rounded px-3 py-2 text-sm bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <button className="btn btn-outline text-sm" aria-label="Buscar">
              Buscar
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
