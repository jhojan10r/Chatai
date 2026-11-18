import { useEffect, useState } from 'react';
import type { Character } from '@/types';
import { charactersService } from '@/services/characters';

interface UseCharactersResult {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

/** Carga el catálogo de personajes a través del servicio. */
export function useCharacters(): UseCharactersResult {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    charactersService
      .getAll()
      .then((result) => {
        if (!cancelled) setCharacters(result);
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los personajes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { characters, loading, error };
}
