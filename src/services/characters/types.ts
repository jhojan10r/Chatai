import type { Character, CharacterDraft, CharacterUpdate } from '@/types';
import type { CharacterValidationError } from '@/types';

export interface CharacterRepository {
  getAll(): Promise<Character[]>;
  getById(id: string): Promise<Character | null>;
  getByCategory(category: Character['category']): Promise<Character[]>;
  search(query: string): Promise<Character[]>;
  getByCreator(creatorId: string): Promise<Character[]>;
  create(draft: CharacterDraft): Promise<Character>;
  update(id: string, changes: CharacterUpdate): Promise<Character>;
  remove(id: string): Promise<boolean>;
}

export type { CharacterValidationError };
