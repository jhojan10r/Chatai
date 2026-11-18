import { Link } from 'react-router-dom';
import { Flame, Heart, MessageCircle } from 'lucide-react';
import type { Character } from '@/types';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { cn } from '@/utils/cn';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function CharacterCard({ character, isFavorite, onToggleFavorite }: CharacterCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-neutral-900 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10',
        isFavorite ? 'border-emerald-500/60' : 'border-neutral-800 hover:border-neutral-700'
      )}
    >
      <Link to={`/character/${character.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <CharacterAvatar
          name={character.name}
          imageUrl={character.imageUrl}
          className="h-full w-full will-change-transform group-hover:scale-105 sm:transition-transform sm:duration-300"
          size={400}
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur">
          {character.category}
        </span>
      </Link>

      <button
        type="button"
        onClick={() => onToggleFavorite(character.id)}
        aria-label={isFavorite ? `Quitar a ${character.name} de favoritos` : `Añadir a ${character.name} a favoritos`}
        aria-pressed={isFavorite}
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 backdrop-blur transition active:scale-95 md:hover:scale-110"
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-colors',
            isFavorite ? 'fill-emerald-400 text-emerald-400' : 'text-neutral-300'
          )}
        />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-white">{character.name}</h3>
          {character.popularity !== undefined && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] font-medium text-amber-400">
              <Flame className="h-3 w-3" />
              {character.popularity}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
          {character.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1">
            {character.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300"
              >
                #{tag}
              </span>
            ))}
          </div>
          <Link
            to={`/chat/${character.id}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition active:scale-95 md:hover:bg-emerald-500"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chatear
          </Link>
        </div>
      </div>
    </article>
  );
}
