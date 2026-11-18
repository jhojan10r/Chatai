import { NavLink } from 'react-router-dom';
import { Compass, Heart, Home, User } from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/explore', label: 'Explorar', icon: Compass },
  { to: '/create-character', label: 'Crear', icon: Heart },
  { to: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="flex">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors',
                  isActive ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
                )
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
