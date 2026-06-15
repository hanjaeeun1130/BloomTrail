import { createBrowserClient } from "@supabase/ssr";

export type SavedRoute = {
  id: string;
  user_id: string;
  arboretum_name: string;
  route_name: string;
  duration: string;
  theme: string;
  companion: string;
  zones: string[];
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      saved_routes: {
        Row: SavedRoute;
        Insert: Omit<SavedRoute, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SavedRoute, "id" | "created_at">>;
      };
    };
  };
};

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      supabaseUrl: "",
      supabaseAnonKey: "",
      errorMessage:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  // Never use a Supabase service_role_key in browser/client code.
  return {
    supabaseUrl,
    supabaseAnonKey,
    errorMessage: "",
  };
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createBrowserSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey, errorMessage } = getSupabaseConfig();

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
