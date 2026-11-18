import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Flame, MessageCircle, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Page } from '@/components/common/Page';
import { CharacterCard } from '@/components/common/CharacterCard';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { CATEGORIES } from '@/features/characters/categories';
import { useCharacters } from '@/hooks/useCharacters';
import { useFavorites } from '@/hooks/useFavorites';

const categoryLinks = [
  { category: 'Fantasía' },
  { category: 'Aventura' },
  { category: 'Misterio' },
  { category: 'Ciencia ficción' },
  { category: 'Comedia' },
  { category: 'Vida cotidiana' },
];

export default function HomePage() {
  const { characters, loading, error } = useCharacters();
  const { isFavorite, toggleFavorite } = useFavorites();
  const featured = characters.slice(0, 4);
  const trending = [...characters]
    .sort((a, b) => b.stats.popularityScore - a.stats.popularityScore)
    .slice(0, 6);

  return (
    <Page className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/60 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-4">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Personajes originales de IA
          </span>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Conversa con personajes que tienen historia propia
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-neutral-400">
            Descubre guardianas élficas, piratas retirados, detectives nocturnos y
            más. Cada personaje tiene su carácter, su pasado y su manera única de
            responder.
          </p>
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
            >
              <Compass className="h-4 w-4" />
              Explorar personajes
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white active:scale-95"
            >
              <Search className="h-4 w-4" />
              Buscar
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-neutral-900" />
          ))}
        </div>
      ) : (
      <section aria-labelledby="featured-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="featured-heading" className="flex items-center gap-2 text-xl font-bold text-white">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Personajes destacados
          </h2>
          <Link to="/explore" className="flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isFavorite={isFavorite(character.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
      )}

      <section aria-labelledby="trending-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="trending-heading" className="flex items-center gap-2 text-xl font-bold text-white">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Tendencias
          </h2>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400">
            Datos de demostración
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trending.map((character, index) => (
            <Link
              key={character.id}
              to={`/character/${character.id}`}
              className="group relative flex w-[9.5rem] shrink-0 flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-3 transition active:scale-95 md:hover:-translate-y-1 md:hover:border-neutral-600"
            >
              <span className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <CharacterAvatar
                name={character.name}
                imageUrl={character.imageUrl}
                className="h-32 w-full rounded-xl"
                size={320}
              />
              <p className="truncate text-sm font-semibold text-white">{character.name}</p>
              <span className="flex items-center gap-1 text-[11px] text-amber-400">
                <Flame className="h-3 w-3" />
                {character.stats.popularityScore} puntos
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-4 text-xl font-bold text-white">
          Explora por categoría
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categoryLinks.map(({ category }) => {
            const count = characters.filter((c) => c.category === category).length;
            return (
              <Link
                key={category}
                to={`/explore?category=${encodeURIComponent(category)}`}
                className="flex flex-col gap-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-950/30"
              >
                <span className="font-semibold text-white">{category}</span>
                <span className="text-xs text-neutral-500">{count} personajes</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/50 to-neutral-900 p-6 text-center sm:p-10">
        <MessageCircle className="mx-auto h-10 w-10 text-emerald-400" />
        <h2 className="mt-4 text-2xl font-bold text-white">¿Listo para empezar?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-400">
          Elige un personaje y comienza una conversación que se adapta a su
          personalidad y a su historia.
        </p>
        <Link
          to="/explore"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-95"
        >
          Empezar ahora
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </Page>
  );
}
