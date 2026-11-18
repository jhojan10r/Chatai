import type { Character } from './character';

export type MessageSender = 'user' | 'character';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: MessageSender;
  createdAt: string;
}

export interface Conversation {
  id: string;
  characterId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationWithCharacter extends Conversation {
  character: Character;
}
