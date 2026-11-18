/**
 * Interfaz para el proveedor de IA que se integrará en una fase posterior.
 * Ninguna implementación real todavía: no se envían claves ni se llama a servicios externos.
 */
export interface AIProvider {
  /** Envía el historial de mensajes y devuelve la respuesta del personaje. */
  generateReply(messages:AIMessage[]): Promise<string>;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}
