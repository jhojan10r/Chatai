import { Heart, User } from 'lucide-react';
import { Page } from '@/components/common/Page';
import { Placeholder } from '@/components/common/Placeholder';

export default function ProfilePage() {
  return (
    <Page>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">
        Mi perfil
      </h1>
      <Placeholder
        icon={<User className="h-6 w-6" />}
        title="Perfil en construcción"
        description="Aquí podrás crear tu cuenta, iniciar sesión y ver tus personajes favoritos y el historial de tus conversaciones. Se activará en una fase posterior."
      />
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500">
        <Heart className="h-4 w-4 text-emerald-400" />
        Tus favoritos se guardan en este dispositivo por ahora.
      </p>
    </Page>
  );
}
