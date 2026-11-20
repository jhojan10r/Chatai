import { useId, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CharacterCounterOptions {
  value: string;
  limit?: number;
}

export function CharacterCounter({ value, limit }: CharacterCounterOptions) {
  if (!limit) return null;
  const remaining = limit - value.length;
  return (
    <span
      className={cn(
        'text-[11px] tabular-nums',
        remaining < 0 ? 'font-semibold text-red-400' : remaining <= limit * 0.1 ? 'text-amber-400' : 'text-neutral-500'
      )}
    >
      {value.length}/{limit}
    </span>
  );
}

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  counter?: { value: string; limit?: number };
  children: (inputId: string) => ReactNode;
}

/** Campo de formulario con etiqueta, ayuda, contador y error. El control se renderiza vía children. */
export function FormField({ label, hint, error, required, counter, children }: FormFieldProps) {
  const inputId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-200">
          {label}
          {required && <span className="ml-1 text-emerald-400" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(obligatorio)</span>}
        </label>
        {counter && <CharacterCounter value={counter.value} limit={counter.limit} />}
      </div>
      {hint && !error && <p className="text-xs leading-relaxed text-neutral-500">{hint}</p>}
      {children(inputId)}
      {error && (
        <p className="text-xs font-medium text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const controlClasses =
  'w-full rounded-xl border bg-neutral-900 px-4 py-3 text-base text-white placeholder:text-neutral-500 outline-none transition focus:ring-2 focus:ring-emerald-500/20 sm:text-sm';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: string;
  counter?: { value: string; limit?: number };
}

export function TextField({ label, value, onChange, placeholder, hint, error, required, type = 'text', counter }: TextFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error} required={required} counter={counter}>
      {(inputId) => (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(controlClasses, error ? 'border-red-500/60 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500')}
        />
      )}
    </FormField>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  counter?: { value: string; limit?: number };
}

export function TextAreaField({ label, value, onChange, placeholder, hint, error, required, rows = 4, counter }: TextAreaFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error} required={required} counter={counter}>
      {(inputId) => (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={!!error}
          className={cn(controlClasses, 'resize-y leading-relaxed', error ? 'border-red-500/60 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500')}
        />
      )}
    </FormField>
  );
}
