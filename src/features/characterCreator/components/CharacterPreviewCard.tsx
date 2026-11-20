import { Heart, MessageCircle } from 'lucide-react';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { isCharacterCategory } from '@/types';
import type { CharacterFormState } from '../types';
import { ImagePreview } from './ImageUrlField';

interface CharacterPreviewCardProps {
  form: CharacterFormState;
}

/** Vista previa en vivo: cómo se verá la tarjeta del personaje en Chatai. */
export function CharacterPreviewCard({ form }: CharacterPreviewCardProps) {
  const tags = form.tags ?? [];
  const personality = form.personality.trim();

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ImagePreview
          url={form.imageUrl ?? ''}
          name={form.name}
          variant="avatar"
          className="h-full w-full"
        />
        {isCharacterCategory(form.category) && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur">
            {form.category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-semibold leading-tight text-white">
          {form.name.trim() || 'Tu personaje'}
        </h3>
        <p className="line-clamp-3 min-h-10 text-sm leading-relaxed text-neutral-400">
          {form.description.trim() || 'La descripción de tu personaje aparecerá aquí conforme la escribas.'}
        </p>

        {form.bannerUrl.trim() !== '' && (
          <div className="pt-1">
            <ImagePreview url={form.bannerUrl} name={form.name} variant="banner" className="h-16 w-full" />
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {personality !== '' && (
          <p className="line-clamp-2 rounded-xl bg-neutral-900/60 p-2 text-xs leading-relaxed text-neutral-400 border border-neutral-800">
            <span className="font-semibold text-neutral-300">Personalidad: </span>
            {personality}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between pt-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600">
            <Heart className="h-4 w-4" />
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">
            <MessageCircle className="h-3.5 w-3.5" />
            Chatear
          </span>
        </div>
      </div>
    </article>
  );
}
