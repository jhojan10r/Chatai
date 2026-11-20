import type { Character, CharacterDraft, CharacterUpdate } from '@/types';
import { LocalCharacterRepository } from './localRepository';
import type { CharacterRepository } from './types';

/**
 * Punto de acceso único al servicio de personajes.
 * Para migrar a Supabase más adelante basta con sustituir la implementación
 * del repositorio; las páginas y componentes no cambian.
 */
const repository: CharacterRepository = new LocalCharacterRepository();

export const charactersService = {
  getAll: () => repository.getAll(),
  getById: (id: string) => repository.getById(id),
  getByCategory: (category: Character['category']) => repository.getByCategory(category),
  getByCreator: (creatorId: string) => repository.getByCreator(creatorId),
  getPublic: () => repository.getPublic(),
  getFeatured: () => repository.getFeatured(),
  getOfficial: () => repository.getOfficial(),
  search: (query: string) => repository.search(query),
  create: (draft: CharacterDraft) => repository.create(draft),
  update: (id: string, changes: CharacterUpdate) => repository.update(id, changes),
  remove: (id: string) => repository.remove(id),
};

export type { CharacterRepository } from './types';
export { CharacterStorageError } from './localRepository';
