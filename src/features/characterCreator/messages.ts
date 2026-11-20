import type { CharacterValidationError } from '@/types';

/** Mensajes comprensibles para cada código de validación, listos para formularios. */
export const VALIDATION_MESSAGES: Record<CharacterValidationError, string> = {
  'name-required': 'El nombre del personaje es obligatorio.',
  'name-too-long': 'El nombre es demasiado largo.',
  'description-required': 'La descripción es obligatoria.',
  'description-too-long': 'La descripción es demasiado larga.',
  'personality-required': 'La personalidad principal es obligatoria.',
  'personality-too-long': 'La descripción de la personalidad es demasiado larga.',
  'backstory-required': 'La historia del personaje es obligatoria.',
  'backstory-too-long': 'La historia es demasiado larga.',
  'greeting-required': 'El saludo inicial es obligatorio.',
  'greeting-too-long': 'El saludo inicial es demasiado largo.',
  'category-invalid': 'Selecciona una categoría válida.',
  'tags-duplicated': 'Hay etiquetas repetidas.',
  'too-many-tags': 'Hay demasiadas etiquetas.',
  'tag-too-long': 'Alguna etiqueta es demasiado larga.',
  'image-url-invalid': 'La URL de la imagen no es válida. Debe comenzar por http:// o https://.',
};

export const URL_INVALID_MESSAGE = VALIDATION_MESSAGES['image-url-invalid'];
