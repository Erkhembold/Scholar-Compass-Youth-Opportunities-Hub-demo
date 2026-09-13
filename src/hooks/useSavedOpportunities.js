import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

// Centralizes save/unsave state so BookmarkButton, OpportunityCard, and
// OpportunityDetailPage all share one source of truth instead of each
// tracking their own copy. Signed-out users get a no-op that routes them
// to sign in — saving requires an account, same as IELTS result history.
export function useSavedOpportunities() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user || !supabase) {
      setSavedIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", user.id);
    setSavedIds(new Set((data || []).map((row) => row.opportunity_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggleSave(opportunityId) {
    if (!user || !supabase) {
      window.location.hash = "#/signin";
      return;
    }

    const isSaved = savedIds.has(opportunityId);

    // Optimistic update — flip immediately, reconcile with the server
    // after, so the icon never feels laggy on tap.
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(opportunityId);
      else next.add(opportunityId);
      return next;
    });

    if (isSaved) {
      const { error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("user_id", user.id)
        .eq("opportunity_id", opportunityId);
      if (error) refresh();
    } else {
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({ user_id: user.id, opportunity_id: opportunityId });
      if (error) refresh();
    }
  }

  return { savedIds, isSaved: (id) => savedIds.has(id), toggleSave, loading, isSignedIn: !!user };
}
