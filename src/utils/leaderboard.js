// Core leaderboard logic: the weekly competition clock, deterministic demo
// player generation, and promotion/relegation rules. Kept framework-free
// (no React) so it can move to a server-side cron/edge function later
// without rewriting the rules themselves — only where they run changes.

import { LEAGUES } from "../data/leagues.js";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// A fixed reference point so "week number" is the same for every visitor
// and every reload, without needing a server to hand out week IDs.
const EPOCH = Date.UTC(2024, 0, 1, 0, 0, 0);

export function getWeekInfo(now = Date.now()) {
  const weekNumber = Math.floor((now - EPOCH) / WEEK_MS);
  const weekStart = EPOCH + weekNumber * WEEK_MS;
  const weekEnd = weekStart + WEEK_MS;
  return { weekNumber, weekStart, weekEnd, msRemaining: weekEnd - now };
}

export function formatCountdown(ms) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

// --- real weekly promotion / relegation ---------------------------------
// Fetches every real ScholarCompass user currently placed in `leagueId`
// from public.leaderboard_entries (see supabase/leaderboard_secure.sql).
// That table only ever contains safe, public columns (id, name,
// current_league, weekly_xp, badges) — never email, school, grade, or
// any other private profile field — and its row-level security only
// returns rows in the CALLER's own current league, enforced by Postgres
// itself, not by this client-side filter (the .eq below is defense in
// depth / clarity, not the actual security boundary). Returns [] if
// Supabase isn't configured or the query fails, so the board still
// renders (as real-only, possibly with empty seats) rather than crashing.
export async function fetchLeaguePlayers(supabase, leagueId) {
  if (!supabase) return [];
  let { data, error } = await supabase
    .from("leaderboard_entries")
    .select("id, name, weekly_xp, avatar_path")
    .eq("current_league", leagueId);

  if (error) {
    // avatar_path doesn't exist on leaderboard_entries until
    // supabase/public_profiles_and_avatars.sql has been run. Fall back to
    // the base columns so the leaderboard itself never breaks just
    // because that separate, newer migration hasn't been applied yet.
    ({ data, error } = await supabase
      .from("leaderboard_entries")
      .select("id, name, weekly_xp")
      .eq("current_league", leagueId));
  }

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name?.trim() || "ScholarCompass student",
    xp: row.weekly_xp || 0,
    avatarPath: row.avatar_path || null,
    isDemo: false,
  }));
}

// Builds the board actually shown on the Leaderboard and Profile pages:
// ONLY real, currently-registered ScholarCompass users in this league,
// ranked by weekly XP. No synthetic/demo players are mixed in.
//
// If fewer than 40 real users occupy a league, the returned array is
// simply shorter than 40 — callers render the remaining seats as empty
// slots rather than this function inventing anyone to fill them.
export function buildLiveLeaderboard(leagueId, realPlayers, meEntry) {
  const real = [...realPlayers];

  // The signed-in viewer's own row uses their freshest locally-known XP
  // (there can be a brief lag before a just-earned point shows up in the
  // leaderboard_entries table for other visitors' next fetch).
  if (meEntry) {
    const idx = real.findIndex((p) => p.id === meEntry.id);
    if (idx >= 0) real[idx] = { ...real[idx], ...meEntry, isDemo: false };
    else real.push({ ...meEntry, isDemo: false });
  }

  real.sort((a, b) => b.xp - a.xp);
  return real.map((p, i) => ({ ...p, rank: i + 1 }));
}

export const LEAGUE_CAPACITY = 40;

// --- promotion / stay / relegation rules (for display only) -------------
//
// `totalPlayers` here must be the ACTUAL number of real users in the
// league, not the fixed 40-seat capacity — empty seats are not
// competitors and never affect anyone's zone. This means:
//   - A league with fewer than 20 real players will never produce a
//     relegation zone at all (rank <= totalPlayers - 5 covers everyone
//     once totalPlayers <= 20, since the promotion check at rank <= 15
//     already catches the rest) — there's nobody to be "the bottom 5"
//     relative to, since 5 people can't sensibly be relegated out of a
//     league of, say, 6.
//   - A league with 10 real players: every one of them has rank <= 15,
//     so everyone lands in the promotion zone. This is intentional and
//     honest — there weren't enough real competitors to fill lower
//     tiers, so nobody is arbitrarily held back to simulate a full
//     league that doesn't exist.
//
// This mirrors exactly what supabase/league_promotion.sql computes
// server-side (same rank<=15 / rank<=total-5 / else thresholds) — kept
// here too so the Leaderboard page can show each row's zone label
// (Promotion/Stay/Relegation) without a round trip, purely for display.
// The ACTUAL promotion is decided server-side; this never writes anything.

export function zoneForRank(rank, totalPlayers = 40) {
  if (rank <= 15) return "promotion";
  if (rank <= totalPlayers - 5) return "stay";
  return "relegation";
}

// Resolves a rank into the *actual* outcome for a given league, honoring
// the Bronze-floor and top-league-ceiling exceptions. Display-only, same
// caveat as zoneForRank above.
export function resolveOutcome(rank, leagueId, totalPlayers = 40) {
  const zone = zoneForRank(rank, totalPlayers);
  const league = LEAGUES.find((l) => l.id === leagueId);
  if (!league) return { zone: "stay", nextLeagueId: leagueId };

  if (zone === "promotion") {
    const up = LEAGUES.find((l) => l.order === league.order + 1);
    return { zone: "promotion", nextLeagueId: up ? up.id : leagueId };
  }
  if (zone === "relegation") {
    const down = LEAGUES.find((l) => l.order === league.order - 1);
    // Bronze floor: bottom 5 in Bronze just stay in Bronze.
    return { zone: down ? "relegation" : "stay", nextLeagueId: down ? down.id : leagueId };
  }
  return { zone: "stay", nextLeagueId: leagueId };
}

// --- weekly rollover (real) ----------------------------------------------
// Calls public.run_weekly_league_rollover() (see
// supabase/league_promotion.sql), which computes EVERY real user's rank
// from EVERY other real user's actual weekly_xp in their league and
// updates the database directly — a genuine competitive outcome, not a
// simulation against synthetic opponents. It's idempotent (safe to call
// on every page load; it only actually does anything once per real week)
// and processes ALL leagues/users at once, not just the caller — this
// client call is simply an opportunistic trigger so a rollover happens
// promptly even without a server-side cron. After it runs, this re-reads
// the caller's own profile row so the UI reflects any change immediately.
export async function triggerWeeklyRollover(supabase, profile) {
  if (!supabase || !profile?.id) return profile;
  const { error: rpcError } = await supabase.rpc("run_weekly_league_rollover");
  if (rpcError) return profile; // RPC not set up yet, or the call failed — keep showing current state

  const { data, error } = await supabase
    .from("profiles")
    .select("current_league, weekly_xp, last_processed_week, badges")
    .eq("id", profile.id)
    .single();
  if (error || !data) return profile;
  return { ...profile, ...data };
}
