import { useEffect, useState } from 'react';
import { ImageIcon, Link2 } from 'lucide-react';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { isValidHttpUrl } from '@/types';
import { FormField } from './FormField';
import { cn } from '@/utils/cn';

interface ImagePreviewProps {
  url: string;
  /** Nombre asociado a la imagen (para la inicial del respaldo). */
  name: string;
  className?: string;
  variant?: 'avatar' | 'banner';
}

/** Vista previa de imagen con respaldo elegante si la URL falla o está vacía. */
export function ImagePreview({ url, name, className, variant = 'avatar' }: ImagePreviewProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  const valid = url.trim().length > 0 && isValidHttpUrl(url.trim());

  if (variant === 'banner') {
    if (!valid || failed) {
      return (
        <div
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900 text-xs text-neutral-500',
            className
          )}
        >
          <ImageIcon className="h-4 w-4" />
          {url.trim() ? 'Vista previa no disponible' : 'Sin imagen de portada'}
        </div>
      );
    }
    return (
      <img
        src={url}
        alt={`Portada de ${name || 'personaje'}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('rounded-xl object-cover', className)}
      />
    );
  }

  return (
    <CharacterAvatar
      name={name || '?'}
      imageUrl={valid ? url : undefined}
      className={cn('rounded-xl', className)}
      size={400}
    />
  );
}

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  variant?: 'avatar' | 'banner';
}

/** Campo de URL de imagen con vista previa en vivo y estado visual de error. */
export function ImageUrlField({ label, value, onChange, name, variant = 'avatar' }: ImageUrlFieldProps) {
  const trimmed = value.trim();
  const invalid = trimmed.length > 0 && !isValidHttpUrl(trimmed);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="shrink-0">
        <ImagePreview url={value} name={name} variant={variant} className={variant === 'banner' ? 'h-20 w-full sm:w-40' : 'h-20 w-20'} />
      </div>
      <div className="w-full min-w-0">
        <FormField label={label} error={invalid ? 'La URL no es válida. Debe comenzar por http:// o https://.' : undefined}>
          {(inputId) => (
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                id={inputId}
                type="url"
                inputMode="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                aria-invalid={invalid}
                className={cn(
                  'w-full rounded-xl border bg-neutral-900 py-3 pl-10 pr-4 text-base text-white placeholder:text-neutral-500 outline-none transition focus:ring-2 focus:ring-emerald-500/20 sm:text-sm',
                  invalid ? 'border-red-500/60 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500'
                )}
              />
            </div>
          )}
        </FormField>
      </div>
    </div>
  );
}
