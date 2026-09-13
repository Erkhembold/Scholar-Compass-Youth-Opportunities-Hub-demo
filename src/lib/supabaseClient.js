import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the keys aren't set (e.g. a preview build before Vercel env vars are
// configured), export null instead of throwing — AuthContext checks for
// this and shows a friendly "not configured yet" state instead of a
// blank crashed page.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
