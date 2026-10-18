import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

// Asks the database whether the signed-in user is an administrator. This is
// only used to decide whether to SHOW the review link; every review action
// is checked again by the database itself (supabase/opportunity_completions.sql),
// so changing this value in the browser grants nothing.
const known = new Map();

export function useIsAdmin() {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [state, setState] = useState({ checked: false, isAdmin: false });

  useEffect(() => {
    let cancelled = false;
    if (!supabase || !userId) {
      setState({ checked: true, isAdmin: false });
      return undefined;
    }
    if (known.has(userId)) {
      setState({ checked: true, isAdmin: known.get(userId) });
      return undefined;
    }
    setState({ checked: false, isAdmin: false });
    supabase.rpc("am_i_admin").then(({ data, error }) => {
      const value = !error && data === true;
      known.set(userId, value);
      if (!cancelled) setState({ checked: true, isAdmin: value });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return state;
}
