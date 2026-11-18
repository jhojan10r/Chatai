export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  aiApiUrl: import.meta.env.VITE_AI_API_URL as string | undefined,
} as const;
