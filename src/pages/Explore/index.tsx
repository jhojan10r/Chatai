import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, SlidersHorizontal } from 'lucide-react';
import { Page } from '@/components/common/Page';
import { CharacterCard } from '@/components/common/CharacterCard';
import { demoCharacters } from '@/features/characters/demoCharacters';
import { CATEGORIES } from '@/features/characters/categories';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/utils/cn';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();
  const activeCategory = searchParams.get('category');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoCharacters.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || c.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const selectCategory = (category: string | null) => {
    setSearchParams(category ? { category } : {}, { replace: true });
  };

  return (
    <Page className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Explorar personajes
        </h1>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por nombre o descripción..."
            aria-label="Buscar personajes"
            autoComplete="off"
            enterKeyHint="search"
            className="w-full rounded-full border border-neutral-800 bg-neutral-900 py-3 pl-12 pr-4 text-base text-white placeholder:text-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-neutral-500" />
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition active:scale-95',
              !activeCategory
                ? 'bg-emerald-600 text-white'
                : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white'
            )}
          >
            Todas
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category === activeCategory ? null : category)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition active:scale-95',
                category === activeCategory
                  ? 'bg-emerald-600 text-white'
                  : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <p className="text-sm text-neutral-500" role="status">
        {results.length} {results.length === 1 ? 'personaje encontrado' : 'personajes encontrados'}
      </p>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isFavorite={isFavorite(character.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-neutral-500">
            <SearchX className="h-6 w-6" />
          </div>
          <h2 className="font-semibold text-white">Sin resultados</h2>
          <p className="max-w-xs text-sm text-neutral-400">
            No hay personajes que coincidan con tu búsqueda. Prueba con otras
            palabras o cambia la categoría.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              selectCategory(null);
            }}
            className="mt-2 rounded-full border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </Page>
  );
}
