import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { buildLiveLeaderboard, fetchLeaguePlayers } from "../utils/leaderboard.js";

// Fetches every real ScholarCompass user currently in `leagueId` and
// builds the 40-seat live board around them (demo players only pad
// whatever seats are left over). Shared by the Leaderboard page and the
// Profile page's league widget so the two never disagree about who's
// really in a league.
//
// `meEntry` is { id, name, xp } for the signed-in viewer, or null when
// signed out / browsing a league that isn't the viewer's own.
export function useLeagueBoard(leagueId, weekNumber, meEntry) {
  const [realPlayers, setRealPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
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
    () => buildLiveLeaderboard(leagueId, weekNumber, realPlayers, meEntry),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leagueId, weekNumber, realPlayers, meEntry?.id, meEntry?.xp, meEntry?.name]
  );

  return { board, loading };
}
