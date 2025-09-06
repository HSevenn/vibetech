
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [openSearch, setOpenSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Enfocar el input al abrir el buscador móvil
  useEffect(() => {
    if (openSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between gap-6 px-4">
        <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
          VibeTech
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="btn btn-outline">Inicio</Link>
          <Link href="/productos" className="btn btn-outline">Productos</Link>
          <Link href="/contacto" className="btn btn-outline">Contacto</Link>

          {/* Desktop: buscador visible desde md */}
          <form action="/buscar" className="hidden md:flex items-center gap-2">
            <input
              name="q"
              placeholder="Buscar..."
              className="rounded px-3 py-1 text-sm bg-neutral-100 text-neutral-900 border border-neutral-300
                         dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700"
            />
            <button className="text-sm opacity-80 hover:opacity-100" aria-label="Buscar">🔍</button>
          </form>

          <ThemeToggle />

          {/* Móvil: botón de lupa (sólo < md) */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg px-2 py-1
                       border border-neutral-300 text-neutral-700
                       dark:border-neutral-700 dark:text-neutral-200"
            onClick={() => setOpenSearch(true)}
            aria-label="Abrir búsqueda"
          >
            🔍
          </button>
        </nav>
      </div>

      {/* Capa de búsqueda móvil */}
      {openSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute left-0 right-0 top-0 bg-white dark:bg-neutral-950 border-b
                          border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <form action="/buscar" className="flex items-center gap-2">
              <input
                ref={inputRef}
                name="q"
                placeholder="Buscar productos…"
                className="flex-1 rounded px-3 py-2 text-base bg-neutral-100 text-neutral-900 border border-neutral-300
                           dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700"
              />
              <button
                className="btn btn-primary"
                aria-label="Buscar"
                onClick={() => setOpenSearch(false)}
              >
                Buscar
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setOpenSearch(false)}
                aria-label="Cerrar búsqueda"
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
  );
}
