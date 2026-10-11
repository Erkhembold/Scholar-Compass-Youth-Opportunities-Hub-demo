import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

// Returns { [userId]: [{ test_type, score, label, sublabel }] } for the given
// ids. Silently returns {} if the table isn't set up yet or the viewer is
// signed out, so the leaderboard/profile never break because of it.
export function useVerifiedScores(userIds) {
  const [byUser, setByUser] = useState({});
  const key = [...new Set((userIds || []).filter(Boolean))].sort().join(",");

  useEffect(() => {
    let cancelled = false;
    if (!supabase || !key) {
      setByUser({});
      return undefined;
    }
    supabase
      .from("verified_scores")
      .select("user_id, test_type, score, label, sublabel")
      .in("user_id", key.split(","))
      .then(({ data, error }) => {
        if (cancelled) return;
        const map = {};
        if (!error && Array.isArray(data)) {
          for (const row of data) (map[row.user_id] ||= []).push(row);
        }
        setByUser(map);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return byUser;
}
