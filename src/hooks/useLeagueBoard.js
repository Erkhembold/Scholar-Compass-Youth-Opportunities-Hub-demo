import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { buildLiveLeaderboard, fetchLeaguePlayers } from "../utils/leaderboard.js";

// Fetches every real ScholarCompass user currently in `leagueId` — via
// public.leaderboard_entries, whose row-level security only ever returns
// rows in the CALLER's own league (see supabase/leaderboard_secure.sql)
// — and builds the board strictly from them. No demo/filler players are
// mixed in; if fewer than 40 real users occupy the league, the returned
// board is simply shorter than 40 and the caller renders the remainder
// as empty seats. Shared by the Leaderboard page and the Profile page's
// league widget so the two never disagree about who's really in a
// league.
//
// `meEntry` is { id, name, xp } for the signed-in viewer, or null when
// signed out.
export function useLeagueBoard(leagueId, meEntry) {
  const [realPlayers, setRealPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!leagueId) {
      setRealPlayers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchLeaguePlayers(supabase, leagueId).then((players) => {
      if (!cancelled) {
        setRealPlayers(players);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [leagueId]);

  const board = useMemo(
    () => buildLiveLeaderboard(leagueId, realPlayers, meEntry),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leagueId, realPlayers, meEntry?.id, meEntry?.xp, meEntry?.name]
  );

  return { board, loading };
}
