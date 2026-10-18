import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

// The signed-in student's own completion submissions, keyed by opportunity
// id. Every opportunity card uses this, so the fetch is shared: one request
// per signed-in user, re-run when something dispatches "sc:completions".
let cache = { userId: null, rows: null, promise: null };

function load(userId, force) {
  if (!supabase || !userId) return Promise.resolve([]);
  if (!force && cache.userId === userId && cache.promise) return cache.promise;
  cache.userId = userId;
  cache.promise = supabase
    .from("opportunity_completions")
    .select("id, opportunity_id, opportunity_title, evidence_path, note, status, reviewer_feedback, submitted_at, reviewed_at, resubmit_count")
    .eq("user_id", userId)
    .then(({ data, error }) => {
      cache.rows = error ? [] : data || [];
      return cache.rows;
    });
  return cache.promise;
}

export function notifyCompletionsChanged() {
  window.dispatchEvent(new Event("sc:completions"));
}

export function useCompletions() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.id || null;

  const refresh = useCallback(
    async (force = false) => {
      if (!userId) {
        setRows([]);
        setLoading(false);
        return;
      }
      const data = await load(userId, force);
      setRows(data);
      setLoading(false);
    },
    [userId]
  );

  useEffect(() => {
    refresh(false);
    const on = () => refresh(true);
    window.addEventListener("sc:completions", on);
    return () => window.removeEventListener("sc:completions", on);
  }, [refresh]);

  const byOpportunity = {};
  for (const r of rows) byOpportunity[r.opportunity_id] = r;
  return { byOpportunity, loading, refresh: () => refresh(true), isSignedIn: !!userId };
}
