// Shareable student cards: the data -> card model and the milestone rules.
// Pure functions with no browser or asset imports, so they are unit-tested in
// tests/cardModel.test.mjs. The canvas renderer lives in shareCard.js.
//
// Privacy is decided on the server (supabase/share_cards.sql): another
// student's data arrives already stripped of anything private. For the owner's
// own cards, `ownerViewModel` applies the same per-field settings here before
// anything is drawn. A card builder returns null when its data is missing or
// private, so a private value can never reach a canvas.
import { LEAGUE_BY_ID } from "../data/leagues.js";
import { levelFromXp } from "./levels.js";

export const CARD_W = 1080;
export const CARD_H = 1920; // 9:16 — Instagram/WhatsApp stories, fine for chats

export const SHARE_FIELDS = [
  { key: "name", label: "Name", hint: "Otherwise you appear as “ScholarCompass student”" },
  { key: "avatar", label: "Profile photo" },
  { key: "school", label: "School" },
  { key: "grade", label: "Grade / year level" },
  { key: "sat", label: "SAT target and practice" },
  { key: "ielts", label: "IELTS target and practice" },
  { key: "streak", label: "Daily streak" },
  { key: "league", label: "League and rank" },
  { key: "xp", label: "XP and level" },
  { key: "achievements", label: "Weekly achievements" },
];

// Must match supabase/share_cards.sql (_share_flag): only these were already
// public before per-field privacy existed; everything else starts private.
const DEFAULT_PUBLIC = new Set(["name", "avatar", "streak", "sat", "ielts"]);

export function isPublic(settings, key) {
  const v = settings?.show?.[key];
  return typeof v === "boolean" ? v : DEFAULT_PUBLIC.has(key);
}

export const CARD_KINDS = [
  { id: "student", label: "Student card", needs: null },
  { id: "streak", label: "Streak", needs: "streak" },
  { id: "league", label: "League", needs: "league" },
  { id: "sat", label: "SAT", needs: "sat" },
  { id: "ielts", label: "IELTS", needs: "ielts" },
  { id: "achievements", label: "Achievements", needs: "achievements" },
];

// ---- view models ------------------------------------------------------------
// One shape for both audiences:
// { id, name, avatarPath, school, grade, streak:{current,longest}|null,
//   sat:{target,questions}|null, ielts:{target,latestBand,questions}|null,
//   league:{id,rank,size}|null, xp:{lifetime,weekly}|null, badges:[]|null }

// The owner's full data (get_my_card_data) filtered by their own settings.
export function ownerViewModel(d, settings) {
  if (!d) return null;
  const on = (k) => isPublic(settings, k);
  return {
    id: d.id,
    name: on("name") ? d.name || null : null,
    avatarPath: on("avatar") ? d.avatar_path || null : null,
    school: on("school") ? d.school || null : null,
    grade: on("grade") ? d.grade || null : null,
    streak: on("streak") ? { current: d.current_streak, longest: d.longest_streak } : null,
    sat: on("sat") ? { target: d.sat_target_score, questions: d.sat_questions } : null,
    ielts: on("ielts")
      ? { target: d.ielts_target_score, latestBand: d.ielts_latest_band, questions: d.ielts_questions }
      : null,
    league: on("league") ? { id: d.current_league, rank: d.league_rank, size: d.league_size } : null,
    xp: on("xp") ? { lifetime: d.lifetime_xp, weekly: d.weekly_xp } : null,
    badges: on("achievements") ? d.badges || [] : null,
  };
}

// Another student's profile as returned by get_public_profile (already
// filtered server-side). Also understands the older flat response, so the site
// keeps working if this code is deployed before share_cards.sql has been run.
export function publicViewModel(p) {
  if (!p) return null;
  if (p.streak === undefined && p.current_streak !== undefined) {
    return {
      id: p.id,
      name: p.name || null,
      avatarPath: p.avatar_path || null,
      school: null,
      grade: null,
      streak: { current: p.current_streak, longest: p.longest_streak },
      sat: { target: p.sat_target_score, questions: null },
      ielts: { target: p.ielts_target_score, latestBand: null, questions: null },
      league: p.current_league ? { id: p.current_league, rank: p.league_rank, size: p.league_size } : null,
      xp: null,
      badges: Array.isArray(p.badges) ? p.badges : null,
      legacy: true,
    };
  }
  return {
    id: p.id,
    name: p.name || null,
    avatarPath: p.avatar_path || null,
    school: p.school || null,
    grade: p.grade || null,
    streak: p.streak || null,
    sat: p.sat || null,
    ielts: p.ielts ? { target: p.ielts.target, latestBand: p.ielts.latest_band, questions: p.ielts.questions } : null,
    league: p.league || null,
    xp: p.xp || null,
    badges: Array.isArray(p.badges) ? p.badges : null,
  };
}

// ---- card models ------------------------------------------------------------
const ORANGE = "#FF9F0A";
const BLUE = "#5AC8FA";
const GOLD = "#FFD60A";

function leagueAccent(league) {
  // Obsidian is near-black: use its soft tint so it stays visible on navy.
  return league.id === "obsidian" ? league.soft : league.primary;
}

function person(vm) {
  return {
    name: vm.name || null,
    avatarPath: vm.avatarPath || null,
    sub: [vm.school, vm.grade && (/^\d+$/.test(String(vm.grade).trim()) ? `Grade ${String(vm.grade).trim()}` : vm.grade)]
      .filter(Boolean)
      .join(" · "),
  };
}

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-US") : String(n));

// The card for one kind, or null when there's nothing real (or public) to show.
export function buildCard(kind, vm) {
  if (!vm) return null;
  const who = person(vm);
  const common = { person: who, shareId: vm.id };

  if (kind === "streak") {
    if (!vm.streak || !(vm.streak.current > 0)) return null;
    return {
      kind, ...common, accent: ORANGE, flame: true,
      eyebrow: "DAILY STREAK",
      hero: String(vm.streak.current),
      label: "DAY STREAK",
      lines: vm.streak.longest > vm.streak.current ? [["Longest streak", `${vm.streak.longest} days`]] : [],
      alt: `${vm.streak.current} day streak`,
    };
  }

  if (kind === "league") {
    const league = vm.league && LEAGUE_BY_ID[vm.league.id];
    if (!league) return null;
    const lines = [];
    if (vm.league.rank && vm.league.size) lines.push(["Weekly rank", `#${vm.league.rank} of ${vm.league.size}`]);
    if (vm.xp) lines.push(["Total XP", fmt(vm.xp.lifetime)]);
    return {
      kind, ...common, accent: leagueAccent(league),
      eyebrow: "LEAGUE",
      hero: league.name.toUpperCase(),
      label: "LEAGUE",
      lines,
      alt: `${league.name} league`,
    };
  }

  if (kind === "sat") {
    if (!vm.sat) return null;
    const { target, questions } = vm.sat;
    if (!target && !(questions > 0)) return null;
    const lines = [];
    if (target && questions > 0) lines.push(["Questions practiced", fmt(questions)]);
    return {
      kind, ...common, accent: BLUE,
      eyebrow: "SAT",
      hero: target ? String(target) : fmt(questions),
      label: target ? "TARGET SCORE" : "QUESTIONS PRACTICED",
      lines,
      note: "Practice and goals — not an official score.",
      alt: target ? `SAT target score ${target}` : `${questions} SAT questions practiced`,
    };
  }

  if (kind === "ielts") {
    if (!vm.ielts) return null;
    const { target, latestBand, questions } = vm.ielts;
    if (!target && !latestBand && !(questions > 0)) return null;
    const hasBand = latestBand != null;
    const lines = [];
    if (hasBand && target) lines.push(["Target band", Number(target).toFixed(1)]);
    if (questions > 0) lines.push(["Questions practiced", fmt(questions)]);
    return {
      kind, ...common, accent: BLUE,
      eyebrow: "IELTS",
      hero: hasBand ? Number(latestBand).toFixed(1) : target ? Number(target).toFixed(1) : fmt(questions),
      label: hasBand ? "LATEST MOCK BAND" : target ? "TARGET BAND" : "QUESTIONS PRACTICED",
      lines,
      note: "Practice and goals — not an official score.",
      alt: hasBand ? `IELTS latest mock band ${latestBand}` : `IELTS target band ${target}`,
    };
  }

  if (kind === "achievements") {
    const badges = vm.badges;
    if (!badges || badges.length === 0) return null;
    const sorted = [...badges].sort((a, b) => (b.week ?? 0) - (a.week ?? 0)).slice(0, 4);
    return {
      kind, ...common, accent: GOLD,
      eyebrow: "WEEKLY ACHIEVEMENTS",
      hero: String(badges.length),
      label: badges.length === 1 ? "PODIUM FINISH" : "PODIUM FINISHES",
      lines: sorted.map((b) => [
        `${b.badge}${LEAGUE_BY_ID[b.league] ? ` · ${LEAGUE_BY_ID[b.league].name}` : ""}`,
        b.week != null ? `Week ${b.week}` : "",
      ]),
      alt: `${badges.length} weekly podium finishes`,
    };
  }

  if (kind === "student") {
    const lines = [];
    if (vm.xp) lines.push(["Level", `${levelFromXp(vm.xp.lifetime || 0)} · ${fmt(vm.xp.lifetime || 0)} XP`]);
    if (vm.streak && vm.streak.current > 0) lines.push(["Streak", `${vm.streak.current} days`]);
    const league = vm.league && LEAGUE_BY_ID[vm.league.id];
    if (league) lines.push(["League", league.name]);
    if (vm.sat?.target) lines.push(["SAT target", String(vm.sat.target)]);
    if (vm.ielts?.target) lines.push(["IELTS target", Number(vm.ielts.target).toFixed(1)]);
    if (!vm.name && !vm.avatarPath && lines.length === 0) return null;
    return {
      kind, ...common, accent: BLUE,
      eyebrow: "STUDENT CARD",
      hero: vm.name || "ScholarCompass student",
      label: "",
      lines,
      studentLayout: true,
      alt: `Student card${vm.name ? ` for ${vm.name}` : ""}`,
    };
  }
  return null;
}

// ---- milestones ---------------------------------------------------------------
// Only moments worth a post: a week-or-more streak, reaching a league above
// Bronze, and big practice volumes. Built from the owner's real, unfiltered data.
const STREAK_STEPS = [7, 14, 30, 60, 100, 180, 365];
const SAT_STEPS = [100, 500, 1000];
const IELTS_STEPS = [100, 500, 1000];

export function listMilestones(d) {
  if (!d) return [];
  const out = [];
  for (const n of STREAK_STEPS) {
    if ((d.longest_streak || 0) >= n) {
      out.push({ id: `streak-${n}`, title: `${n}-day streak`, kind: "streak", n });
    }
  }
  const league = LEAGUE_BY_ID[d.current_league];
  if (league && league.order >= 1) {
    out.push({ id: `league-${league.id}`, title: `${league.name} League`, kind: "league", league });
  }
  for (const n of SAT_STEPS) {
    if ((d.sat_questions || 0) >= n) out.push({ id: `sat-${n}`, title: `${fmt(n)} SAT questions`, kind: "sat", n });
  }
  for (const n of IELTS_STEPS) {
    if ((d.ielts_questions || 0) >= n) out.push({ id: `ielts-${n}`, title: `${fmt(n)} IELTS questions`, kind: "ielts", n });
  }
  return out;
}

// Which milestone is the most worth showing first.
export function milestoneWeight(m) {
  if (m.kind === "streak") return 1000 + m.n;
  if (m.kind === "league") return 900 + m.league.order;
  return 100 + m.n / 10;
}

// A milestone image shows ONLY that achievement (the owner is choosing to share
// it) plus name/photo/school/grade when those are public.
export function buildMilestoneCard(m, vm) {
  const who = person(vm || {});
  const base = { kind: "milestone", person: who, eyebrow: "MILESTONE REACHED", lines: [], shareId: vm?.id };
  if (m.kind === "streak") {
    return { ...base, accent: ORANGE, flame: true, hero: String(m.n), label: "DAY STREAK", alt: `${m.n} day streak milestone` };
  }
  if (m.kind === "league") {
    return { ...base, accent: leagueAccent(m.league), hero: m.league.name.toUpperCase(), label: "LEAGUE REACHED", alt: `${m.league.name} league milestone` };
  }
  if (m.kind === "sat") {
    return { ...base, accent: BLUE, hero: fmt(m.n), label: "SAT QUESTIONS PRACTICED", alt: `${m.n} SAT questions milestone` };
  }
  return { ...base, accent: BLUE, hero: fmt(m.n), label: "IELTS QUESTIONS PRACTICED", alt: `${m.n} IELTS questions milestone` };
}
