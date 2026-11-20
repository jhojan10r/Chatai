import { useCallback, useEffect, useState } from 'react';
import type { Character, CharacterDraft, CharacterUpdate, CharacterCategory } from '@/types';
import { charactersService } from '@/services/characters';

interface UseCharactersResult {
  characters: Character[];
  loading: boolean;
  error: string | null;
  getById: (id: string) => Promise<Character | null>;
  getByCategory: (category: CharacterCategory) => Promise<Character[]>;
  search: (query: string) => Promise<Character[]>;
  createCharacter: (draft: CharacterDraft) => Promise<Character | null>;
  updateCharacter: (id: string, changes: CharacterUpdate) => Promise<Character | null>;
  deleteCharacter: (id: string) => Promise<boolean>;
}

/**
 * Catálogo de personajes a través del servicio: demo + locales.
 * Expone consultas y CRUD; las páginas consumen este hook, nunca el repositorio.
 */
export function useCharacters(): UseCharactersResult {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await charactersService.getAll();
      setCharacters(result);
      setError(null);
    } catch {
      setError('No se pudieron cargar los personajes.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    refresh().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const getById = useCallback(async (id: string) => {
    return charactersService.getById(id);
  }, []);

  const getByCategory = useCallback(async (category: CharacterCategory) => {
    return charactersService.getByCategory(category);
  }, []);

  const search = useCallback(async (query: string) => {
    return charactersService.search(query);
  }, []);

  const createCharacter = useCallback(
    async (draft: CharacterDraft): Promise<Character | null> => {
      try {
        const created = await charactersService.create(draft);
        await refresh();
        return created;
      } catch (err) {
        setError(
          err instanceof Error && err.message.includes('no válidos')
            ? 'Datos del personaje no válidos. Revisa los campos e inténtalo de nuevo.'
            : 'No se pudo crear el personaje.'
        );
        return null;
      }
    },
    [refresh]
  );

  const updateCharacter = useCallback(
    async (id: string, changes: CharacterUpdate): Promise<Character | null> => {
      try {
        const updated = await charactersService.update(id, changes);
        await refresh();
        return updated;
      } catch {
        setError('No se pudo actualizar el personaje.');
        return null;
      }
    },
    [refresh]
  );

  const deleteCharacter = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const removed = await charactersService.remove(id);
        if (!removed) {
          setError('El personaje ya no existe.');
          return false;
        }
        await refresh();
        return true;
      } catch (err) {
        setError(
          err instanceof Error && err.message.includes('oficiales')
            ? 'Los personajes oficiales no se pueden eliminar.'
            : 'No se pudo eliminar el personaje.'
        );
        return false;
      }
    },
    [refresh]
  );

  return {
    characters,
    loading,
    error,
    getById,
    getByCategory,
    search,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  };
}
