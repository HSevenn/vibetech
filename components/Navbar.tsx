
'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar(){
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between gap-6 px-4">
        <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">VibeTech</Link>
        <nav className="flex items-center gap-3">
          <Link href="/" className="btn btn-outline">Inicio</Link>
          <Link href="/productos" className="btn btn-outline">Productos</Link>
          <Link href="/contacto" className="btn btn-outline">Contacto</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
