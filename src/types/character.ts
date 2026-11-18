export type CharacterCategory =
  | 'Fantasía'
  | 'Aventura'
  | 'Misterio'
  | 'Ciencia ficción'
  | 'Comedia'
  | 'Vida cotidiana';

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  personality: string;
  backstory: string;
  greeting: string;
  category: CharacterCategory;
  tags: string[];
  createdAt: string;
  creatorId: string;
  /** Indicador de popularidad simulado (datos de demostración). */
  popularity?: number;
}

export interface CharacterDraft {
  name: string;
  description: string;
  imageUrl: string;
  personality: string;
  backstory: string;
  greeting: string;
  category: CharacterCategory;
  tags: string[];
}
