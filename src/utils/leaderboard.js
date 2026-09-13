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

// --- deterministic pseudo-random demo players ------------------------

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

const FIRST_NAMES = [
  "Bat-Erdene", "Oyunchimeg", "Temuulen", "Anujin", "Munkhbat", "Sarnai",
  "Gantulga", "Bolormaa", "Enkhjin", "Tuvshinbayar", "Nomin", "Chuluun",
  "Ariunaa", "Batbayar", "Delgermaa", "Khulan", "Otgonbayar", "Saruul",
  "Uyanga", "Zorigt", "Amar", "Bilguun", "Erdenechimeg", "Ganzorig",
  "Ider", "Javkhlan", "Khongorzul", "Lkhagvasuren", "Mongolsuvd", "Naran",
  "Oyunaa", "Purevdorj", "Sainbayar", "Tsetsegmaa", "Undral", "Yesui",
  "Aiganym", "Batzorig", "Chinzorig", "Dulguun", "Erkhembayar", "Ganbold",
  "Hulan", "Ikhbayar", "Jargal", "Khaliun", "Lkhamsuren", "Munkhjin",
];
const LAST_INITIALS = ["B.", "D.", "E.", "G.", "J.", "L.", "M.", "N.", "O.", "S.", "T.", "U.", "Z."];

// Weekly XP for a league drops off roughly log-linearly from top to
// bottom rank, with a little seeded jitter so it doesn't look robotic.
function xpCurve(rank, leagueOrder, rand) {
  const leagueBoost = 1 + leagueOrder * 0.35;
  const base = 3200 * leagueBoost * Math.pow(1 - (rank - 1) / 42, 1.35);
  const jitter = (rand() - 0.5) * 90;
  return Math.max(10, Math.round(base + jitter));
}

// Generates the 39 demo opponents for a league in a given week (the 40th
// seat is the signed-in user, merged in by the caller). Deterministic per
// (league, week) so the board doesn't reshuffle on every render/reload
// within the same week.
export function generateDemoPlayers(leagueId, weekNumber, count = 39) {
  const league = LEAGUES.find((l) => l.id === leagueId) || LEAGUES[0];
  const seed = hashString(`${leagueId}:${weekNumber}`);
  const rand = mulberry32(seed);
  const players = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_INITIALS[Math.floor(rand() * LAST_INITIALS.length)];
    players.push({
      id: `demo-${leagueId}-${weekNumber}-${i}`,
      name: `${first} ${last}`,
      xp: xpCurve(i + 1, league.order, rand),
      isDemo: true,
    });
  }
  return players;
}

// Merges the signed-in user into the demo roster, sorts by XP, and
// assigns ranks 1..N. `user` is { id, name, xp } or null.
export function buildLeaderboard(leagueId, weekNumber, user) {
  const demo = generateDemoPlayers(leagueId, weekNumber, user ? 39 : 40);
  const all = user ? [...demo, { ...user, isDemo: false }] : demo;
  all.sort((a, b) => b.xp - a.xp);
  return all.map((p, i) => ({ ...p, rank: i + 1 }));
}

// --- promotion / stay / relegation rules -------------------------------

export function zoneForRank(rank, totalPlayers = 40) {
  if (rank <= 15) return "promotion";
  if (rank <= totalPlayers - 5) return "stay";
  return "relegation";
}

// Resolves a rank into the *actual* outcome for a given league, honoring
// the Bronze-floor and Diamond-ceiling exceptions.
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

// --- weekly rollover ----------------------------------------------------
// Since there's no server-side cron in this prototype, the rollover is
// processed the next time the signed-in user's profile loads, comparing
// the last week they were scored in against the current real week. Each
// missed week is replayed in order so a long absence still promotes or
// relegates the user through every week they weren't around for, exactly
// as it would have happened live.
export async function processWeeklyReset(supabase, profile) {
  if (!supabase || !profile) return profile;
  const { weekNumber } = getWeekInfo();
  const lastProcessed = profile.last_processed_week ?? weekNumber;
  if (lastProcessed >= weekNumber) return profile;

  let league = profile.current_league || "bronze";
  let weeklyXp = profile.weekly_xp || 0;
  let badges = profile.badges || [];

  for (let w = lastProcessed; w < weekNumber; w++) {
    const board = buildLeaderboard(league, w, {
      id: "me",
      name: profile.name || "You",
      xp: weeklyXp,
    });
    const me = board.find((p) => p.id === "me");
    const outcome = resolveOutcome(me.rank, league, board.length);

    if (me.rank <= 3) {
      const badgeName = me.rank === 1 ? "Gold" : me.rank === 2 ? "Silver" : "Bronze";
      badges = [{ placement: me.rank, badge: badgeName, league, week: w }, ...badges].slice(0, 50);
    }

    league = outcome.nextLeagueId;
    weeklyXp = 0;
  }

  const updates = {
    current_league: league,
    weekly_xp: weeklyXp,
    last_processed_week: weekNumber,
    badges,
  };
  await supabase.from("profiles").update(updates).eq("id", profile.id);
  return { ...profile, ...updates };
}
