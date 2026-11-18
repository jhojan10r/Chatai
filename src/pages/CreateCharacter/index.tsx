import { UserRoundPlus } from 'lucide-react';
import { Page } from '@/components/common/Page';
import { Placeholder } from '@/components/common/Placeholder';

export default function CreateCharacterPage() {
  return (
    <Page>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">
        Crear personaje
      </h1>
      <Placeholder
        icon={<UserRoundPlus className="h-6 w-6" />}
        title="Creador en construcción"
        description="Aquí podrás diseñar tu propio personaje: nombre, imagen, personalidad, historia de fondo, saludo inicial y etiquetas. Se activará en una fase posterior."
      />
    </Page>
  );
}
