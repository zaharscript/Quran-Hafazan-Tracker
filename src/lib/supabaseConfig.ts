const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const hasPlaceholderCredentials =
  supabaseUrl === "https://your-project-id.supabase.co" ||
  supabaseAnonKey === "your-supabase-anon-key";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !hasPlaceholderCredentials);

export const supabaseCredentials = isSupabaseConfigured
  ? { url: supabaseUrl!, anonKey: supabaseAnonKey! }
  : null;
