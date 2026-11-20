import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { FormField } from './FormField';
import { cn } from '@/utils/cn';

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  maxTags?: number;
  maxTagLength?: number;
  addLabel?: string;
}

/** Lista de etiquetas dinámicas: escribir + Enter o botón para añadir, X para quitar. */
export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  hint,
  error,
  maxTags,
  maxTagLength,
  addLabel = 'Añadir',
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const atLimit = maxTags !== undefined && values.length >= maxTags;

  const add = () => {
    const value = draft.trim();
    if (!value || atLimit) return;
    if (values.some((v) => v.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add();
    }
  };

  return (
    <FormField label={label} hint={hint} error={error}>
      {(inputId) => (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              id={inputId}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={atLimit}
              maxLength={maxTagLength}
              className="w-full min-w-0 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-base text-white placeholder:text-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={add}
              disabled={atLimit || !draft.trim()}
              className="shrink-0 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-40 md:hover:bg-emerald-500"
            >
              {addLabel}
            </button>
          </div>
          {values.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label={label}>
              {values.map((tag, index) => (
                <li key={`${tag}-${index}`}>
                  <span className="flex items-center gap-1.5 rounded-full bg-neutral-800 py-1.5 pl-3 pr-1.5 text-xs text-neutral-200">
                    {tag}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Quitar ${tag}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition active:scale-90 md:hover:bg-neutral-700 md:hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </FormField>
  );
}
