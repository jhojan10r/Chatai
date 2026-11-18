/**
 * Interfaz del almacenamiento de imágenes (Supabase Storage en fases posteriores).
 */
export interface StorageClient {
  uploadImage(file: File, path: string): Promise<string>;
  deleteImage(path: string): Promise<void>;
}
