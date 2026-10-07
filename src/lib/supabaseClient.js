import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the keys aren't set (e.g. a preview build before Vercel env vars are
// configured), export null instead of throwing — AuthContext checks for
// this and shows a friendly "not configured yet" state instead of a
// blank crashed page.
// flowType: "pkce" — without this, the client defaults to the implicit
// flow, which returns the session as a URL HASH fragment
// (#access_token=...). This app's own router is also hash-based, and a
// second "#" appended after the router's "#/..." gets swallowed into one
// fragment per URL spec, so the token is silently lost on return from an
// OAuth provider (see AuthContext.jsx's signInWithGoogle). PKCE instead
// returns a "?code=" query parameter, which the router never touches.
export const supabase =
  url && anonKey ? createClient(url, anonKey, { auth: { flowType: "pkce" } }) : null;
