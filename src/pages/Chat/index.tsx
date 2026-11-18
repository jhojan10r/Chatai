import { MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/common/Page';
import { Placeholder } from '@/components/common/Placeholder';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Page>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">
        Conversación
      </h1>
      <Placeholder
        icon={<MessageCircle className="h-6 w-6" />}
        title={id ? `Chat con: ${id}` : 'Chat no encontrado'}
        description="Aquí podrás conversar con el personaje. Los mensajes se guardarán en el historial de la conversación. Se activará en una fase posterior."
      />
    </Page>
  );
}
