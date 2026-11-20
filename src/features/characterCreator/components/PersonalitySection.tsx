import { CHARACTER_LIMITS } from '@/types';
import type { CharacterFormState } from '../types';
import { TextField, TextAreaField } from './FormField';
import { TagInput } from './TagInput';

interface PersonalitySectionProps {
  form: CharacterFormState;
  errors: Partial<Record<string, string>>;
  update: <K extends keyof CharacterFormState>(field: K, value: CharacterFormState[K]) => void;
}

/** Sección B: personalidad, temperamento y preferencias del personaje. */
export function PersonalitySection({ form, errors, update }: PersonalitySectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <TextAreaField
        label="Personalidad principal"
        required
        value={form.personality}
        onChange={(v) => update('personality', v)}
        placeholder="Describe cómo es tu personaje: cómo actúa, qué le mueve, cómo trata a los demás..."
        hint="Es el corazón del personaje. Máximo 600 caracteres."
        error={errors.personality}
        rows={5}
        counter={{ value: form.personality, limit: CHARACTER_LIMITS.personality }}
      />

      <TextField
        label="Temperamento"
        value={form.temperament}
        onChange={(v) => update('temperament', v)}
        placeholder="Ej. Serena y paciente"
        hint="Resumen en pocas palabras de su carácter general."
      />

      <TagInput
        label="Rasgos de personalidad"
        values={form.traits ?? []}
        onChange={(v) => update('traits', v)}
        placeholder="Ej. valiente, curiosa..."
        hint="Palabras sueltas que definan su forma de ser."
        maxTags={12}
        maxTagLength={30}
        addLabel="Añadir rasgo"
      />

      <TextField
        label="Estilo de comunicación"
        value={form.communicationStyle}
        onChange={(v) => update('communicationStyle', v)}
        placeholder="Ej. Descripciones evocadoras y metáforas de la naturaleza"
        hint="Cómo se expresa normalmente."
      />

      <TextField
        label="Tono de voz"
        value={form.toneOfVoice}
        onChange={(v) => update('toneOfVoice', v)}
        placeholder="Ej. Suave y pausado"
        hint="La sensación general de su voz."
      />

      <TagInput
        label="Intereses"
        values={form.interests ?? []}
        onChange={(v) => update('interests', v)}
        placeholder="Ej. astronomía, música..."
        hint="Temas que le apasionan y puede conversar."
        maxTags={12}
        maxTagLength={30}
        addLabel="Añadir interés"
      />

      <TagInput
        label="Gustos"
        values={form.likes ?? []}
        onChange={(v) => update('likes', v)}
        placeholder="Ej. la lluvia sobre las hojas"
        hint="Cosas que disfruta."
        maxTags={12}
        maxTagLength={40}
        addLabel="Añadir gusto"
      />

      <TagInput
        label="Disgustos"
        values={form.dislikes ?? []}
        onChange={(v) => update('dislikes', v)}
        placeholder="Ej. la prisa"
        hint="Cosas que le incomodan o rechaza."
        maxTags={12}
        maxTagLength={40}
        addLabel="Añadir disgusto"
      />
    </div>
  );
}
