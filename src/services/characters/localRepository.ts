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

/** Formato versionado del almacenamiento local. */
interface CharacterStorageEnvelope {
  storageSchemaVersion: number;
  characters: Character[];
}

interface LocalCharactersState {
  characters: Character[];
  /** false si los datos pertenecen a una versión que no sabemos migrar. */
  compatible: boolean;
}

function readLocalCharacters(): LocalCharactersState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { characters: [], compatible: true };

    const parsed: unknown = JSON.parse(raw);

    // Formato legado: lista plana de personajes. Se migra al guardar de nuevo.
    if (Array.isArray(parsed)) {
      return { characters: parsed.filter(isValidCharacterShape), compatible: true };
    }

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'storageSchemaVersion' in parsed &&
      'characters' in parsed
    ) {
      const envelope = parsed as Record<string, unknown>;
      if (envelope.storageSchemaVersion !== SCHEMA_VERSION || !Array.isArray(envelope.characters)) {
        return { characters: [], compatible: false };
      }
      return { characters: envelope.characters.filter(isValidCharacterShape), compatible: true };
    }

    // Datos corruptos: se ignora y se parte de los demo.
    return { characters: [], compatible: true };
  } catch {
    // Almacenamiento no disponible o JSON inválido: se ignora y se parte de los demo.
    return { characters: [], compatible: true };
  }
}

function writeLocalCharacters(state: LocalCharactersState): void {
  if (!state.compatible) {
    throw new CharacterStorageError(
      'Los datos guardados pertenecen a una versión más reciente de la aplicación y no se pueden modificar sin perder información. No se han cambiado tus personajes.'
    );
  }
  const envelope: CharacterStorageEnvelope = {
    storageSchemaVersion: SCHEMA_VERSION,
    characters: state.characters,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
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

function generateSlug(name: string, existing: Character[]): string {
  const base = slugify(name) || 'personaje';
  let slug = base;
  let counter = 2;
  const slugs = new Set(existing.map((c) => c.slug));
  while (slugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

export class LocalCharacterRepository implements CharacterRepository {
  /** Demo + locales, evitando duplicados de id y de slug. Los demo siempre ganan. */
  private all(): Character[] {
    const { characters: local } = readLocalCharacters();
    const demoIds = new Set(demoCharacters.map((c) => c.id));
    const demoSlugs = new Set(demoCharacters.map((c) => c.slug));
    return [
      ...demoCharacters,
      ...local.filter((c) => !demoIds.has(c.id) && !demoSlugs.has(c.slug)),
    ];
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

  async getPublic(): Promise<Character[]> {
    return this.all().filter((c) => c.isPublic && c.visibility === 'public' && c.status === 'published');
  }

  async getFeatured(): Promise<Character[]> {
    return this.all().filter((c) => c.isFeatured);
  }

  async getOfficial(): Promise<Character[]> {
    return this.all().filter((c) => c.isOfficial);
  }

  async create(draft: CharacterDraft): Promise<Character> {
    const error = validateCharacterDraft(draft);
    if (error) {
      throw new CharacterStorageError(`Datos del personaje no válidos: ${error}`);
    }

    const state = readLocalCharacters();
    const all = this.all();
    const now = new Date().toISOString();
    const character: Character = {
      name: draft.name.trim(),
      id: generateId(draft.name, all),
      slug: generateSlug(draft.name, all),
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

    writeLocalCharacters({ ...state, characters: [...state.characters, character] });
    return character;
  }

  async update(id: string, changes: CharacterUpdate): Promise<Character> {
    const protectedFields = ['id', 'slug', 'creatorId', 'createdAt', 'schemaVersion', 'isOfficial', 'stats'] as const;
    for (const field of protectedFields) {
      if (field in changes) {
        throw new CharacterStorageError(`El campo "${field}" de un personaje no se puede modificar.`);
      }
    }

    const state = readLocalCharacters();
    const index = state.characters.findIndex((c) => c.id === id);
    if (index === -1) {
      // Los personajes de demostración viven en el código y no se modifican desde el cliente.
      throw new CharacterStorageError('Personaje no encontrado o no modificable.');
    }

    const current = state.characters[index];
    const updated: Character = {
      ...current,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    const error = validateCharacterDraft({
      creatorId: updated.creatorId,
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

    state.characters[index] = updated;
    writeLocalCharacters(state);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const target = this.all().find((c) => c.id === id);
    if (!target) return false;
    if (target.isOfficial) {
      throw new CharacterStorageError('Los personajes oficiales no se pueden eliminar.');
    }

    const state = readLocalCharacters();
    writeLocalCharacters({
      ...state,
      characters: state.characters.filter((c) => c.id !== id),
    });
    return true;
  }
}
