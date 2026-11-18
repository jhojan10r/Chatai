import { NavLink, Link } from 'react-router-dom';
import { Compass, Search, Sparkles, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-base">RoleTalk</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/explore"
            aria-label="Buscar personajes"
            className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <Search className="h-5 w-5" strokeWidth={1.8} />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                )
              }
            >
              <Compass className="h-4 w-4" />
              Explorar
            </NavLink>
            <NavLink
              to="/create-character"
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                )
              }
            >
              Crear personaje
            </NavLink>
          </nav>
          <NavLink
            to="/profile"
            aria-label="Mi perfil"
            className={({ isActive }) =>
              cn(
                'flex h-11 w-11 items-center justify-center rounded-full transition',
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              )
            }
          >
            <User className="h-5 w-5" strokeWidth={1.8} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
