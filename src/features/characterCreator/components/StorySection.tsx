import { CHARACTER_LIMITS } from '@/types';
import type { CharacterFormState } from '../types';
import { TextField, TextAreaField } from './FormField';
import { TagInput } from './TagInput';

interface StorySectionProps {
  form: CharacterFormState;
  errors: Partial<Record<string, string>>;
  update: <K extends keyof CharacterFormState>(field: K, value: CharacterFormState[K]) => void;
}

/** Sección C: historia y trasfondo del personaje. */
export function StorySection({ form, errors, update }: StorySectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <TextAreaField
        label="Historia del personaje"
        required
        value={form.backstory}
        onChange={(v) => update('backstory', v)}
        placeholder="Su pasado, los hechos que lo moldearon, lo que busca..."
        hint="Da contexto profundo a la conversación. Máximo 2000 caracteres."
        error={errors.backstory}
        rows={6}
        counter={{ value: form.backstory, limit: CHARACTER_LIMITS.backstory }}
      />

      <TextAreaField
        label="Antecedentes"
        value={form.background}
        onChange={(v) => update('background', v)}
        placeholder="Ej. Veinte años de servicio en la policía de la ciudad."
        hint="Resumen breve de su trayectoria."
        rows={2}
      />

      <TextAreaField
        label="Descripción del mundo"
        value={form.worldDescription}
        onChange={(v) => update('worldDescription', v)}
        placeholder="El lugar y la época en la que vive tu personaje..."
        hint="Ambienta las conversaciones: real o fantástico."
        rows={3}
      />

      <TextField
        label="Ocupación"
        value={form.occupation}
        onChange={(v) => update('occupation', v)}
        placeholder="Ej. Guardiana del bosque"
        hint="A qué se dedica."
      />

      <TagInput
        label="Relaciones"
        values={form.relationships}
        onChange={(v) => update('relationships', v)}
        placeholder="Ej. Su hermana (a quien protege)"
        hint="Vínculos con otros personajes o grupos."
        maxTags={10}
        maxTagLength={60}
        addLabel="Añadir relación"
      />
    </div>
  );
}
