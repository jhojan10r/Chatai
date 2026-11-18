import type { Character, CharacterDraft, CharacterUpdate } from '@/types';
import {
  validateCharacterDraft,
  isValidCharacterShape,
} from '@/types';
import { demoCharacters } from '@/features/characters/demoCharacters';
import type { CharacterRepository } from './types';

const STORAGE_KEY = 'roletalk:characters';
const SCHEMA_VERSION = 2;

export class CharacterStorageError extends Error {}

function readLocalCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCharacterShape);
  } catch {
    // Datos corruptos o almacenamiento no disponible: se ignora y se parte de los demo.
    return [];
  }
}

function writeLocalCharacters(characters: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch {
    throw new CharacterStorageError('No se pudo guardar en el almacenamiento local.');
  }
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId(name: string, existing: Character[]): string {
  const base = slugify(name) || 'personaje';
  let id = base;
  let counter = 2;
  const ids = new Set(existing.map((c) => c.id));
  while (ids.has(id)) {
    id = `${base}-${counter}`;
    counter++;
  }
  return id;
}

export class LocalCharacterRepository implements CharacterRepository {
  /** Demo + locales, evitando duplicados de id. Los demo siempre ganan su id. */
  private all(): Character[] {
    const local = readLocalCharacters();
    const demoIds = new Set(demoCharacters.map((c) => c.id));
    return [...demoCharacters, ...local.filter((c) => !demoIds.has(c.id))];
  }

  async getAll(): Promise<Character[]> {
    return this.all();
  }

  async getById(id: string): Promise<Character | null> {
    return this.all().find((c) => c.id === id) ?? null;
  }

  async getByCategory(category: Character['category']): Promise<Character[]> {
    return this.all().filter((c) => c.category === category);
  }

  async search(query: string): Promise<Character[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.all();
    return this.all().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  async getByCreator(creatorId: string): Promise<Character[]> {
    return this.all().filter((c) => c.creatorId === creatorId);
  }

  async create(draft: CharacterDraft): Promise<Character> {
    const error = validateCharacterDraft(draft);
    if (error) {
      throw new CharacterStorageError(`Datos del personaje no válidos: ${error}`);
    }

    const local = readLocalCharacters();
    const now = new Date().toISOString();
    const character: Character = {
      id: generateId(draft.name, this.all()),
      slug: slugify(draft.name),
      creatorId: draft.creatorId,
      createdAt: now,
      updatedAt: now,
      schemaVersion: SCHEMA_VERSION,
      description: draft.description.trim(),
      imageUrl: draft.imageUrl ?? '',
      category: draft.category,
      tags: (draft.tags ?? []).map((t) => t.trim()),
      visibility: 'private',
      status: 'draft',
      personality: draft.personality.trim(),
      temperament: '',
      traits: draft.traits ?? [],
      communicationStyle: draft.communicationStyle ?? '',
      toneOfVoice: draft.toneOfVoice ?? '',
      interests: draft.interests ?? [],
      likes: draft.likes ?? [],
      dislikes: draft.dislikes ?? [],
      backstory: draft.backstory.trim(),
      background: '',
      worldDescription: draft.worldDescription ?? '',
      occupation: '',
      relationships: [],
      greeting: draft.greeting.trim(),
      exampleDialogues: [],
      responseStyle: '',
      characterInstructions: '',
      conversationGuidelines: '',
      isPublic: false,
      isFeatured: false,
      isOfficial: false,
      allowUserInteractions: true,
      contentRating: 'teen',
      metadata: { source: 'local' },
      stats: { conversationCount: 0, favoriteCount: 0, popularityScore: 0 },
    };

    writeLocalCharacters([...local, character]);
    return character;
  }

  async update(id: string, changes: CharacterUpdate): Promise<Character> {
    if ('id' in changes && changes.id !== id) {
      throw new CharacterStorageError('El identificador de un personaje no se puede modificar.');
    }

    const local = readLocalCharacters();
    const index = local.findIndex((c) => c.id === id);
    if (index === -1) {
      // Los personajes oficiales de demostración no se modifican desde el cliente.
      throw new CharacterStorageError('Personaje no encontrado o no modificable.');
    }

    const current = local[index];
    const updated: Character = {
      ...current,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    const error = validateCharacterDraft({
      name: updated.name,
      description: updated.description,
      category: updated.category,
      personality: updated.personality,
      backstory: updated.backstory,
      greeting: updated.greeting,
      imageUrl: updated.imageUrl || undefined,
      tags: updated.tags,
    });
    if (error) {
      throw new CharacterStorageError(`Datos del personaje no válidos: ${error}`);
    }

    local[index] = updated;
    writeLocalCharacters(local);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const local = readLocalCharacters();
    const filtered = local.filter((c) => c.id !== id);
    if (filtered.length === local.length) return false;
    writeLocalCharacters(filtered);
    return true;
  }
}
