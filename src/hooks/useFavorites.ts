import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'roletalk:favorites';

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Favoritos persistentes en localStorage por ahora.
 * La interfaz está pensada para trasladarse a la base de datos más adelante:
 * solo hay que reemplazar la implementación de este hook.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((characterId: string) => {
    setFavorites((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : [...prev, characterId]
    );
  }, []);

  const isFavorite = useCallback(
    (characterId: string) => favorites.includes(characterId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
