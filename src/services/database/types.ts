/**
 * Interfaz del acceso a datos (Supabase se integrará en fases posteriores).
 * Define el contrato que cumplirán los repositorios de la aplicación.
 */
export interface DataClient {
  getCharacters(): Promise<unknown[]>;
  getCharacterById(id: string): Promise<unknown | null>;
  getConversations(userId: string): Promise<unknown[]>;
  getMessages(conversationId: string): Promise<unknown[]>;
}
