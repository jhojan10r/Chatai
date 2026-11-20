import { useState } from 'react';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { CHARACTER_LIMITS, type CharacterExampleDialogue } from '@/types';
import type { CharacterFormState } from '../types';
import { TextAreaField } from './FormField';
import { cn } from '@/utils/cn';

interface ConversationSectionProps {
  form: CharacterFormState;
  errors: Partial<Record<string, string>>;
  update: <K extends keyof CharacterFormState>(field: K, value: CharacterFormState[K]) => void;
}

/** Sección D: comportamiento conversacional. Configura al personaje; no ejecuta IA todavía. */
export function ConversationSection({ form, errors, update }: ConversationSectionProps) {
  const [dialogueDraft, setDialogueDraft] = useState<{ user: string; character: string }>({ user: '', character: '' });

  const addDialogue = () => {
    const user = dialogueDraft.user.trim();
    const character = dialogueDraft.character.trim();
    if (!user || !character) return;
    update('exampleDialogues', [...form.exampleDialogues, { user, character }]);
    setDialogueDraft({ user: '', character: '' });
  };

  const removeDialogue = (index: number) => {
    update(
      'exampleDialogues',
      form.exampleDialogues.filter((_, i) => i !== index)
    );
  };

  const canAddDialogue = dialogueDraft.user.trim().length > 0 && dialogueDraft.character.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <TextAreaField
        label="Saludo inicial"
        required
        value={form.greeting}
        onChange={(v) => update('greeting', v)}
        placeholder="El primer mensaje que enviará tu personaje al empezar una conversación..."
        hint="Da la bienvenida y marca el tono. Máximo 400 caracteres."
        error={errors.greeting}
        rows={3}
        counter={{ value: form.greeting, limit: CHARACTER_LIMITS.greeting }}
      />

      <TextAreaField
        label="Estilo de respuesta"
        value={form.responseStyle}
        onChange={(v) => update('responseStyle', v)}
        placeholder="Ej. Respuestas breves y evocadoras, con preguntas que invitan a reflexionar."
        hint="Cómo estructura sus respuestas."
        rows={2}
      />

      <TextAreaField
        label="Instrucciones del personaje"
        value={form.characterInstructions}
        onChange={(v) => update('characterInstructions', v)}
        placeholder="Ej. Mantén siempre el tono sereno. Nunca reveles secretos..."
        hint="Pautas internas que el personaje debe seguir."
        rows={3}
      />

      <TextAreaField
        label="Reglas de conversación"
        value={form.conversationGuidelines}
        onChange={(v) => update('conversationGuidelines', v)}
        placeholder="Ej. Habla en primera persona. No salgas de tu rol. Contenido apropiado para adolescentes."
        hint="Límites y formato de la conversación."
        rows={3}
      />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-neutral-200">
          Ejemplos de diálogo
          <span className="ml-2 text-xs font-normal text-neutral-500">Opcional, muy recomendado</span>
        </p>
        <p className="text-xs leading-relaxed text-neutral-500">
          Muestran cómo debería responder tu personaje. Estos datos configuran al personaje;
          la conversación con inteligencia artificial llegará en fases posteriores.
        </p>

        {form.exampleDialogues.length > 0 && (
          <ul className="flex flex-col gap-3">
            {form.exampleDialogues.map((dialogue, index) => (
              <li
                key={index}
                className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900/70 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[11px] font-medium text-neutral-300">
                    Ejemplo {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDialogue(index)}
                    aria-label={`Eliminar ejemplo ${index + 1}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition active:scale-90 md:hover:bg-red-500/10 md:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-neutral-400">
                  <span className="font-semibold text-neutral-300">Usuario:</span> {dialogue.user}
                </p>
                <p className="text-xs leading-relaxed text-emerald-300/90">
                  <span className="font-semibold text-emerald-400">Personaje:</span> {dialogue.character}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/50 p-3">
          <TextAreaField
            label="Mensaje del usuario"
            value={dialogueDraft.user}
            onChange={(v) => setDialogueDraft((d) => ({ ...d, user: v }))}
            placeholder="¿Qué le preguntarías a tu personaje?"
            rows={2}
          />
          <TextAreaField
            label="Respuesta del personaje"
            value={dialogueDraft.character}
            onChange={(v) => setDialogueDraft((d) => ({ ...d, character: v }))}
            placeholder="Cómo respondería tu personaje..."
            rows={2}
          />
          <button
            type="button"
            onClick={addDialogue}
            disabled={!canAddDialogue}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-95',
              canAddDialogue ? 'bg-emerald-600 text-white md:hover:bg-emerald-500' : 'bg-neutral-800 text-neutral-500'
            )}
          >
            <MessageSquarePlus className="h-4 w-4" />
            Añadir ejemplo
          </button>
        </div>
      </div>
    </div>
  );
}
