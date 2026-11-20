import { CATEGORIES } from '@/features/characters/categories';
import { CHARACTER_LIMITS, isCharacterCategory } from '@/types';
import type { CharacterFormState } from '../types';
import { TextField, TextAreaField, CharacterCounter, FormField } from './FormField';
import { TagInput } from './TagInput';
import { ImageUrlField } from './ImageUrlField';
import { cn } from '@/utils/cn';

interface BasicInfoSectionProps {
  form: CharacterFormState;
  errors: Partial<Record<string, string>>;
  update: <K extends keyof CharacterFormState>(field: K, value: CharacterFormState[K]) => void;
}

/** Sección A: información básica del personaje. */
export function BasicInfoSection({ form, errors, update }: BasicInfoSectionProps) {
  const categorySelected = isCharacterCategory(form.category);

  return (
    <div className="flex flex-col gap-6">
      <TextField
        label="Nombre del personaje"
        required
        value={form.name}
        onChange={(v) => update('name', v)}
        placeholder="Ej. Lyra del Bosque Plateado"
        hint="Es lo primero que verán otros usuarios. Máximo 60 caracteres."
        error={errors.name}
        counter={{ value: form.name, limit: CHARACTER_LIMITS.name }}
      />

      <TextAreaField
        label="Descripción breve"
        required
        value={form.description}
        onChange={(v) => update('description', v)}
        placeholder="Un resumen atractivo de quién es tu personaje..."
        hint="Aparece en las tarjetas del catálogo. Máximo 300 caracteres."
        error={errors.description}
        rows={4}
        counter={{ value: form.description, limit: CHARACTER_LIMITS.description }}
      />

      <FormField
        label="Categoría"
        required
        hint="Agrupa tu personaje en el catálogo."
        error={errors.category}
      >
        {(inputId) => (
          <div id={inputId} role="radiogroup" aria-label="Categoría" className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="radio"
                aria-checked={form.category === category}
                onClick={() => update('category', category)}
                className={cn(
                  'rounded-full px-4 py-2.5 text-xs font-semibold transition active:scale-95',
                  form.category === category
                    ? 'bg-emerald-600 text-white'
                    : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </FormField>

      {!categorySelected && (
        <p className="text-xs text-neutral-500">Selecciona una categoría para continuar.</p>
      )}

      <TagInput
        label="Etiquetas"
        values={form.tags ?? []}
        onChange={(v) => update('tags', v)}
        placeholder="Ej. magia, aventura..."
        hint="Hasta 10 etiquetas de 24 caracteres. Pulsa Enter o el botón para añadir."
        error={errors.tags}
        maxTags={CHARACTER_LIMITS.maxTags}
        maxTagLength={CHARACTER_LIMITS.tagLength}
      />

      <ImageUrlField
        label="Imagen de perfil"
        value={form.imageUrl ?? ''}
        onChange={(v) => update('imageUrl', v)}
        name={form.name}
        variant="avatar"
      />

      <ImageUrlField
        label="Imagen de portada (opcional)"
        value={form.bannerUrl}
        onChange={(v) => update('bannerUrl', v)}
        name={form.name}
        variant="banner"
      />

      <div className="flex items-center justify-end gap-2">
        <span className="text-[11px] text-neutral-500">
          {categorySelected ? 'Categoría seleccionada' : 'Sin categoría'}
        </span>
        <CharacterCounter value={form.name} limit={CHARACTER_LIMITS.name} />
      </div>
    </div>
  );
}
