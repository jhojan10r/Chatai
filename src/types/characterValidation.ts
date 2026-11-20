import type { Character, CharacterDraft } from './character';

export type CharacterValidationError =
  | 'name-required'
  | 'name-too-long'
  | 'description-required'
  | 'description-too-long'
  | 'personality-required'
  | 'personality-too-long'
  | 'backstory-required'
  | 'backstory-too-long'
  | 'greeting-required'
  | 'greeting-too-long'
  | 'category-invalid'
  | 'tags-duplicated'
  | 'too-many-tags'
  | 'tag-too-long'
  | 'image-url-invalid';

export interface CharacterLimits {
  name: number;
  description: number;
  personality: number;
  backstory: number;
  greeting: number;
  maxTags: number;
  tagLength: number;
}

export const CHARACTER_LIMITS: CharacterLimits = {
  name: 60,
  description: 300,
  personality: 600,
  backstory: 2000,
  greeting: 400,
  maxTags: 10,
  tagLength: 24,
};

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hasDuplicates(values: string[]): boolean {
  return new Set(values.map((v) => v.trim().toLowerCase())).size !== values.length;
}

/** Valida un borrador de personaje; devuelve el primer error encontrado o `null` si es válido. */
export function validateCharacterDraft(draft: CharacterDraft): CharacterValidationError | null {
  const name = draft.name.trim();
  if (!name) return 'name-required';
  if (name.length > CHARACTER_LIMITS.name) return 'name-too-long';

  const description = draft.description.trim();
  if (!description) return 'description-required';
  if (description.length > CHARACTER_LIMITS.description) return 'description-too-long';

  if (!draft.personality.trim()) return 'personality-required';
  if (draft.personality.length > CHARACTER_LIMITS.personality) return 'personality-too-long';

  if (!draft.backstory.trim()) return 'backstory-required';
  if (draft.backstory.length > CHARACTER_LIMITS.backstory) return 'backstory-too-long';

  const greeting = draft.greeting.trim();
  if (!greeting) return 'greeting-required';
  if (greeting.length > CHARACTER_LIMITS.greeting) return 'greeting-too-long';

  if (!isCharacterCategory(draft.category)) return 'category-invalid';

  const tags = draft.tags ?? [];
  if (tags.length > CHARACTER_LIMITS.maxTags) return 'too-many-tags';
  if (hasDuplicates(tags)) return 'tags-duplicated';
  if (tags.some((tag) => tag.trim().length > CHARACTER_LIMITS.tagLength)) return 'tag-too-long';

  if (draft.imageUrl && !isValidHttpUrl(draft.imageUrl)) return 'image-url-invalid';

  return null;
}

/** Errores por campo, listos para formularios: clave de campo -> código de error. */
export type CharacterDraftFieldErrors = Partial<Record<keyof CharacterDraft, CharacterValidationError>>;

/** Valida campo a campo un borrador; devuelve un mapa vacío si todo es válido. */
export function validateCharacterDraftFields(draft: CharacterDraft): CharacterDraftFieldErrors {
  const errors: CharacterDraftFieldErrors = {};

  const name = draft.name.trim();
  if (!name) errors.name = 'name-required';
  else if (name.length > CHARACTER_LIMITS.name) errors.name = 'name-too-long';

  const description = draft.description.trim();
  if (!description) errors.description = 'description-required';
  else if (description.length > CHARACTER_LIMITS.description) errors.description = 'description-too-long';

  if (!draft.personality.trim()) errors.personality = 'personality-required';
  else if (draft.personality.length > CHARACTER_LIMITS.personality) errors.personality = 'personality-too-long';

  if (!draft.backstory.trim()) errors.backstory = 'backstory-required';
  else if (draft.backstory.length > CHARACTER_LIMITS.backstory) errors.backstory = 'backstory-too-long';

  const greeting = draft.greeting.trim();
  if (!greeting) errors.greeting = 'greeting-required';
  else if (greeting.length > CHARACTER_LIMITS.greeting) errors.greeting = 'greeting-too-long';

  if (!isCharacterCategory(draft.category)) errors.category = 'category-invalid';

  const tags = draft.tags ?? [];
  if (tags.length > CHARACTER_LIMITS.maxTags) errors.tags = 'too-many-tags';
  else if (hasDuplicates(tags)) errors.tags = 'tags-duplicated';
  else if (tags.some((tag) => tag.trim().length > CHARACTER_LIMITS.tagLength)) errors.tags = 'tag-too-long';

  if (draft.imageUrl && !isValidHttpUrl(draft.imageUrl)) errors.imageUrl = 'image-url-invalid';

  return errors;
}

const CATEGORIES = ['Fantasía', 'Aventura', 'Misterio', 'Ciencia ficción', 'Comedia', 'Vida cotidiana'] as const;

export function isCharacterCategory(value: string): value is Character['category'] {
  return (CATEGORIES as readonly string[]).includes(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

/** Comprueba que un dato recuperado del almacenamiento tenga la forma de un personaje. */
export function isValidCharacterShape(value: unknown): value is Character {
  if (!isPlainObject(value)) return false;
  const c = value as Record<string, unknown>;

  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.slug === 'string' &&
    typeof c.creatorId === 'string' &&
    typeof c.createdAt === 'string' &&
    typeof c.updatedAt === 'string' &&
    typeof c.schemaVersion === 'number' &&
    typeof c.description === 'string' &&
    typeof c.imageUrl === 'string' &&
    typeof c.category === 'string' &&
    isCharacterCategory(c.category) &&
    isStringArray(c.tags) &&
    (c.visibility === 'public' || c.visibility === 'private' || c.visibility === 'unlisted') &&
    (c.status === 'draft' || c.status === 'published' || c.status === 'archived') &&
    typeof c.personality === 'string' &&
    typeof c.temperament === 'string' &&
    isStringArray(c.traits) &&
    typeof c.communicationStyle === 'string' &&
    typeof c.toneOfVoice === 'string' &&
    isStringArray(c.interests) &&
    isStringArray(c.likes) &&
    isStringArray(c.dislikes) &&
    typeof c.backstory === 'string' &&
    typeof c.background === 'string' &&
    typeof c.worldDescription === 'string' &&
    typeof c.occupation === 'string' &&
    isStringArray(c.relationships) &&
    typeof c.greeting === 'string' &&
    typeof c.responseStyle === 'string' &&
    typeof c.characterInstructions === 'string' &&
    typeof c.conversationGuidelines === 'string' &&
    typeof c.isPublic === 'boolean' &&
    typeof c.isFeatured === 'boolean' &&
    typeof c.isOfficial === 'boolean' &&
    typeof c.allowUserInteractions === 'boolean' &&
    (c.contentRating === 'everyone' || c.contentRating === 'teen') &&
    isPlainObject(c.metadata) &&
    isPlainObject(c.stats) &&
    typeof (c.stats as Record<string, unknown>).conversationCount === 'number' &&
    typeof (c.stats as Record<string, unknown>).favoriteCount === 'number' &&
    typeof (c.stats as Record<string, unknown>).popularityScore === 'number'
  );
}
