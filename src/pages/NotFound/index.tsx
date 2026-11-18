import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Page } from '@/components/common/Page';

export default function NotFoundPage() {
  return (
    <Page>
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-bold text-white">Página no encontrada</h1>
        <p className="text-sm text-neutral-400">
          La dirección que buscas no existe o ha cambiado.
        </p>
        <Link
          to="/"
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Ir al inicio
        </Link>
      </div>
    </Page>
  );
}
