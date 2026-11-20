import type { CharacterCategory, CharacterDraft, CharacterExampleDialogue } from '@/types';

export type CreatorStepId = 'basic' | 'personality' | 'story' | 'conversation';

export interface CreatorStep {
  id: CreatorStepId;
  label: string;
}

export const CREATOR_STEPS: CreatorStep[] = [
  { id: 'basic', label: 'Información básica' },
  { id: 'personality', label: 'Personalidad' },
  { id: 'story', label: 'Historia' },
  { id: 'conversation', label: 'Conversación' },
];

/**
 * Estado del formulario del creador: extiende CharacterDraft con los campos
 * adicionales del modelo y con todos los textos garantizados como cadenas
 * (los opcionales del borrador se rellenan con cadenas vacías).
 */
export interface CharacterFormState extends Omit<CharacterDraft, 'communicationStyle' | 'toneOfVoice' | 'worldDescription' | 'occupation' | 'imageUrl' | 'tags' | 'traits' | 'interests' | 'likes' | 'dislikes'> {
  communicationStyle: string;
  toneOfVoice: string;
  worldDescription: string;
  occupation: string;
  imageUrl: string;
  tags: string[];
  traits: string[];
  interests: string[];
  likes: string[];
  dislikes: string[];
  bannerUrl: string;
  temperament: string;
  background: string;
  relationships: string[];
  responseStyle: string;
  characterInstructions: string;
  conversationGuidelines: string;
  exampleDialogues: CharacterExampleDialogue[];
}

export function createEmptyForm(): CharacterFormState {
  return {
    name: '',
    description: '',
    category: '' as CharacterCategory,
    personality: '',
    backstory: '',
    greeting: '',
    imageUrl: '',
    bannerUrl: '',
    creatorId: 'local-user',
    tags: [],
    traits: [],
    communicationStyle: '',
    toneOfVoice: '',
    interests: [],
    likes: [],
    dislikes: [],
    temperament: '',
    background: '',
    worldDescription: '',
    occupation: '',
    relationships: [],
    responseStyle: '',
    characterInstructions: '',
    conversationGuidelines: '',
    exampleDialogues: [],
  };
}
