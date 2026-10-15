import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseCredentials } from "./supabaseConfig";

export const supabase: SupabaseClient | null = supabaseCredentials
  ? createClient(supabaseCredentials.url, supabaseCredentials.anonKey)
  : null;
