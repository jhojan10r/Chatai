import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Sparkles, UserRound, BookOpen, Drama } from 'lucide-react';
import { Page } from '@/components/common/Page';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { useCharacters } from '@/hooks/useCharacters';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/utils/cn';

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const { characters, loading, error } = useCharacters();
  const { isFavorite, toggleFavorite } = useFavorites();
  const character = characters.find((c) => c.id === id) ?? null;

  if (loading) {
    return (
      <div className="h-52 w-full animate-pulse bg-neutral-900 sm:h-64" />
    );
  }

  if (error) {
    return (
      <Page>
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300" role="alert">
          {error}
        </p>
      </Page>
    );
  }

  if (!character) {
    return (
      <Page>
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-neutral-500">
            <UserRound className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold text-white">Personaje no encontrado</h1>
          <p className="text-sm text-neutral-400">
            Puede que este personaje ya no esté disponible.
          </p>
          <Link
            to="/explore"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Explorar personajes
          </Link>
        </div>
      </Page>
    );
  }

  const favorite = isFavorite(character.id);

  return (
    <div className="flex flex-col">
      <div className="relative h-52 w-full overflow-hidden sm:h-64">
        <CharacterAvatar
          name={character.name}
          imageUrl={character.imageUrl}
          className="h-full w-full"
          size={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/10" />
        <Link
          to="/explore"
          aria-label="Volver a explorar"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition active:scale-95 md:hover:bg-black/80"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <Page className="-mt-16 flex flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/95 p-5 shadow-xl backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {character.category}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {character.name}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(character.id)}
              aria-pressed={favorite}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-90',
                favorite
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                  : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500 hover:text-white'
              )}
              aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <Heart className={cn('h-5 w-5', favorite && 'fill-emerald-400')} />
            </button>
          </div>

          <p className="text-base leading-relaxed text-neutral-300">{character.description}</p>

          <div className="flex flex-wrap items-center gap-2">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300"
              >
                #{tag}
              </span>
            ))}
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              Popularidad: {character.stats.popularityScore} (demo)
            </span>
          </div>

          <Link
            to={`/chat/${character.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            Comenzar conversación
          </Link>
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Drama className="h-5 w-5 text-emerald-400" />
            Personalidad
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-300">{character.personality}</p>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Historia
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-300">{character.backstory}</p>
          {character.occupation && (
            <p className="mt-2 text-sm text-neutral-500">Ocupación: {character.occupation}</p>
          )}
        </section>

        <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 to-neutral-900 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Primer mensaje
          </h2>
          <blockquote className="mt-3 border-l-2 border-emerald-500/50 pl-4 italic leading-relaxed text-neutral-300">
            "{character.greeting}"
          </blockquote>
        </section>
      </Page>
    </div>
  );
}
