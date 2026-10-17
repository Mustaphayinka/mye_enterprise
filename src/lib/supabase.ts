import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** null when keys aren't set: the site then runs in demo mode. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const isDemo = !supabase;
