export type CharacterCategory =
  | 'Fantasía'
  | 'Aventura'
  | 'Misterio'
  | 'Ciencia ficción'
  | 'Comedia'
  | 'Vida cotidiana';

export type CharacterVisibility = 'public' | 'private' | 'unlisted';

export type CharacterStatus = 'draft' | 'published' | 'archived';

export type CharacterContentRating = 'everyone' | 'teen';

export interface CharacterStats {
  conversationCount: number;
  favoriteCount: number;
  popularityScore: number;
}

export interface CharacterExampleDialogue {
  user: string;
  character: string;
}

/**
 * Personaje completo. Los grupos de campos siguen las secciones del modelo:
 * identificación, presentación, personalidad, historia, comportamiento, configuración y estadísticas.
 */
export interface Character {
  // Identificación
  id: string;
  name: string;
  slug: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;

  // Presentación
  description: string;
  imageUrl: string;
  bannerUrl?: string;
  category: CharacterCategory;
  tags: string[];
  visibility: CharacterVisibility;
  status: CharacterStatus;

  // Personalidad
  personality: string;
  temperament: string;
  traits: string[];
  communicationStyle: string;
  toneOfVoice: string;
  interests: string[];
  likes: string[];
  dislikes: string[];

  // Historia
  backstory: string;
  background: string;
  worldDescription: string;
  occupation: string;
  relationships: string[];

  // Comportamiento conversacional (solo configuración; el motor se integra más adelante)
  greeting: string;
  exampleDialogues: CharacterExampleDialogue[];
  responseStyle: string;
  characterInstructions: string;
  conversationGuidelines: string;

  // Configuración
  isPublic: boolean;
  isFeatured: boolean;
  isOfficial: boolean;
  allowUserInteractions: boolean;
  contentRating: CharacterContentRating;
  metadata: Record<string, string | number | boolean>;

  // Estadísticas (valores iniciales seguros; simulados hasta tener backend)
  stats: CharacterStats;
}

/** Datos necesarios para crear un personaje. */
export interface CharacterDraft {
  name: string;
  description: string;
  category: CharacterCategory;
  personality: string;
  backstory: string;
  greeting: string;
  imageUrl?: string;
  tags?: string[];
  traits?: string[];
  communicationStyle?: string;
  toneOfVoice?: string;
  interests?: string[];
  likes?: string[];
  dislikes?: string[];
  worldDescription?: string;
  occupation?: string;
  creatorId: string;
}

/** Datos permitidos para modificar un personaje. `id` nunca es modificable. */
export type CharacterUpdate = Partial<
  Omit<CharacterDraft, 'creatorId'> & Pick<Character, 'bannerUrl' | 'isPublic' | 'isFeatured' | 'allowUserInteractions'>
>;
