// Personal Study Planner: everything that can be decided without a database
// or a screen lives here as pure functions so it can be unit-tested.
//  - the catalogue of real exercises a task can link to
//  - classifying a student as new / partial / complete for the updated setup
//  - the setup form model, validation, and the payload sent to the database
//  - generating a realistic week of tasks from availability, goals, weak
//    areas and exam dates
//  - summaries for the homepage (today, weekly progress, milestones)
import { SAT_CATEGORIES } from "../data/satQuestions.js";
import { SAT_MATH_DOMAINS } from "../data/satMathQuestions.js";
import { satPracticeHref, satMathExercisesHref, ieltsExercisesHref } from "../router.js";

// Keep in step with planner_current_version() in supabase/study_planner.sql.
export const PLANNER_VERSION = 2;

export const DAYS = [
  { key: "mon", label: "Monday", short: "Mon" },
  { key: "tue", label: "Tuesday", short: "Tue" },
  { key: "wed", label: "Wednesday", short: "Wed" },
  { key: "thu", label: "Thursday", short: "Thu" },
  { key: "fri", label: "Friday", short: "Fri" },
  { key: "sat", label: "Saturday", short: "Sat" },
  { key: "sun", label: "Sunday", short: "Sun" },
];

export const INTENSITIES = [
  { id: "light", label: "Light", factor: 0.6, hint: "About 60% of your available time" },
  { id: "balanced", label: "Balanced", factor: 0.8, hint: "About 80% of your available time" },
  { id: "intensive", label: "Intensive", factor: 1, hint: "All of your available time" },
];

export const SESSION_OPTIONS = [20, 30, 45, 60];

// ---- Catalogue of real exercises ---------------------------------------------
// Every entry links to a page that exists today. The IELTS exercise pages run
// the whole Reading / Writing set (they have no per-topic filter), so those
// tasks link to the skill page and the topic tells the student what to focus on.
const IELTS_READING_TOPICS = [
  ["true_false_not_given", "True / False / Not Given"],
  ["matching_headings", "Matching Headings"],
  ["sentence_completion", "Sentence Completion"],
  ["main_idea", "Main Idea"],
  ["inference", "Inference"],
  ["paraphrase", "Paraphrase"],
  ["vocabulary", "Vocabulary in Context"],
];
const IELTS_WRITING_TOPICS = [
  ["task1", "Task 1: describing data"],
  ["thesis", "Task 2: thesis and position"],
  ["argument_development", "Task 2: developing arguments"],
  ["coherence", "Coherence and cohesion"],
  ["grammar", "Grammar and sentence forms"],
];

export const CATALOGUE = [
  ...SAT_CATEGORIES.map((c) => ({ key: `sat-rw:${c.id}`, exam: "SAT", skill: "Reading and Writing", topic: c.label, href: satPracticeHref(c.id) })),
  ...SAT_MATH_DOMAINS.map((d) => ({ key: `sat-math:${d.id}`, exam: "SAT", skill: "Math", topic: d.label, href: satMathExercisesHref(d.id) })),
  ...IELTS_READING_TOPICS.map(([id, label]) => ({ key: `ielts-reading:${id}`, exam: "IELTS", skill: "Reading", topic: label, href: ieltsExercisesHref("reading") })),
  ...IELTS_WRITING_TOPICS.map(([id, label]) => ({ key: `ielts-writing:${id}`, exam: "IELTS", skill: "Writing", topic: label, href: ieltsExercisesHref("writing") })),
];

export function catalogueEntry(key) {
  return CATALOGUE.find((c) => c.key === key) || null;
}

// ---- Dates (local calendar days, as "YYYY-MM-DD") ----------------------------
const pad = (n) => String(n).padStart(2, "0");

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}
export function mondayOf(iso) {
  const d = parseISO(iso);
  const back = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - back);
  return toISODate(d);
}
export function dayKeyOf(iso) {
  return DAYS[(parseISO(iso).getDay() + 6) % 7].key;
}
export function daysBetween(fromIso, toIso) {
  return Math.round((parseISO(toIso) - parseISO(fromIso)) / 86400000);
}
export function isISODate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && toISODate(parseISO(s)) === s;
}

// ---- Who needs which setup ------------------------------------------------------
// "complete": saved the updated setup (version >= PLANNER_VERSION)
// "partial":  not finished, but some answers already exist (a saved draft, or
//             answers from the original onboarding) -> shown pre-filled
// "new":      nothing known yet
export function plannerState(profile, prefs) {
  if (prefs && prefs.onboarding_version >= PLANNER_VERSION) return "complete";
  const fromProfile =
    profile &&
    (profile.preparing_for_sat != null ||
      profile.preparing_for_ielts != null ||
      profile.sat_target_score != null ||
      profile.ielts_target_score != null ||
      profile.sat_target_date != null ||
      profile.ielts_target_date != null);
  const fromPrefs =
    prefs &&
    (Object.values(prefs.availability || {}).some((m) => Number(m) > 0) ||
      (prefs.weak_areas || []).length > 0 ||
      prefs.cur_sat != null ||
      prefs.cur_ielts != null ||
      prefs.intensity != null);
  return fromProfile || fromPrefs ? "partial" : "new";
}

export function inviteHidden(prefs, now = Date.now()) {
  return !!(prefs?.invite_dismissed_until && new Date(prefs.invite_dismissed_until).getTime() > now);
}

// ---- Setup form -----------------------------------------------------------------
const str = (v) => (v == null ? "" : String(v));

export function formFromState(profile, prefs) {
  const p = profile || {};
  const s = prefs || {};
  const availability = {};
  for (const d of DAYS) availability[d.key] = s.availability && s.availability[d.key] != null ? String(s.availability[d.key]) : "";
  return {
    prepSat: p.preparing_for_sat ?? ((s.goals || []).includes("sat") ? true : null),
    prepIelts: p.preparing_for_ielts ?? ((s.goals || []).includes("ielts") ? true : null),
    otherGoal: str(s.other_goal),
    curSat: str(s.cur_sat),
    curSatMath: str(s.cur_sat_math),
    curSatRw: str(s.cur_sat_rw),
    satTarget: str(p.sat_target_score),
    curIelts: str(s.cur_ielts),
    curIeltsListening: str(s.cur_ielts_listening),
    curIeltsReading: str(s.cur_ielts_reading),
    curIeltsWriting: str(s.cur_ielts_writing),
    curIeltsSpeaking: str(s.cur_ielts_speaking),
    ieltsTarget: str(p.ielts_target_score),
    tgtIeltsListening: str(s.tgt_ielts_listening),
    tgtIeltsReading: str(s.tgt_ielts_reading),
    tgtIeltsWriting: str(s.tgt_ielts_writing),
    tgtIeltsSpeaking: str(s.tgt_ielts_speaking),
    satDate: str(p.sat_target_date),
    ieltsDate: str(p.ielts_target_date),
    availability,
    intensity: s.intensity || "balanced",
    sessionMinutes: s.session_minutes || 30,
    weakAreas: [...(s.weak_areas || [])],
  };
}

const num = (v) => (v === "" || v == null ? null : Number(v));
const isBand = (n) => Number.isFinite(n) && n >= 1 && n <= 9 && n * 2 === Math.floor(n * 2);

// Returns an error message, or null when the form can be saved. Everything is
// optional; only values that are present are checked.
export function validateForm(f, today = toISODate(new Date())) {
  const intIn = (v, lo, hi) => v === "" || v == null || (Number.isInteger(Number(v)) && Number(v) >= lo && Number(v) <= hi);
  const bandOk = (v) => v === "" || v == null || isBand(Number(v));
  if (!intIn(f.curSat, 400, 1600) || !intIn(f.satTarget, 400, 1600)) return "SAT scores must be between 400 and 1600.";
  if (!intIn(f.curSatMath, 200, 800) || !intIn(f.curSatRw, 200, 800)) return "SAT Math and Reading and Writing scores must be between 200 and 800.";
  const bands = [f.curIelts, f.curIeltsListening, f.curIeltsReading, f.curIeltsWriting, f.curIeltsSpeaking, f.ieltsTarget, f.tgtIeltsListening, f.tgtIeltsReading, f.tgtIeltsWriting, f.tgtIeltsSpeaking];
  if (!bands.every(bandOk)) return "IELTS bands must be between 1 and 9, in steps of 0.5 (for example 6.5).";
  for (const [label, v] of [["SAT", f.satDate], ["IELTS", f.ieltsDate]]) {
    if (v) {
      if (!isISODate(v)) return `Enter a valid ${label} exam date, or choose "Not scheduled yet".`;
      if (v < today) return `The ${label} exam date is in the past. Pick a future date, or choose "Not scheduled yet".`;
    }
  }
  for (const d of DAYS) {
    const v = f.availability[d.key];
    if (v !== "" && v != null && !(Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 600)) {
      return `${d.label}: study time must be between 0 and 600 minutes.`;
    }
  }
  if (!SESSION_OPTIONS.includes(Number(f.sessionMinutes))) return "Choose a session length.";
  return null;
}

// Payload for save_study_preferences(). Targets are left out when the student
// said they are NOT preparing for that test, so switching a toggle never
// erases a stored target.
export function buildSavePayload(f) {
  const availability = {};
  for (const d of DAYS) {
    const v = f.availability[d.key];
    availability[d.key] = v === "" || v == null ? 0 : Number(v);
  }
  const payload = {
    prep_sat: f.prepSat,
    prep_ielts: f.prepIelts,
    goals: [f.prepSat ? "sat" : null, f.prepIelts ? "ielts" : null].filter(Boolean),
    other_goal: f.otherGoal.trim() || null,
    cur_sat: num(f.curSat),
    cur_sat_math: num(f.curSatMath),
    cur_sat_rw: num(f.curSatRw),
    cur_ielts: num(f.curIelts),
    cur_ielts_listening: num(f.curIeltsListening),
    cur_ielts_reading: num(f.curIeltsReading),
    cur_ielts_writing: num(f.curIeltsWriting),
    cur_ielts_speaking: num(f.curIeltsSpeaking),
    tgt_ielts_listening: num(f.tgtIeltsListening),
    tgt_ielts_reading: num(f.tgtIeltsReading),
    tgt_ielts_writing: num(f.tgtIeltsWriting),
    tgt_ielts_speaking: num(f.tgtIeltsSpeaking),
    availability,
    intensity: f.intensity,
    session_minutes: Number(f.sessionMinutes),
    weak_areas: f.weakAreas,
  };
  if (f.prepSat !== false) {
    payload.sat_target = num(f.satTarget);
    payload.sat_date = f.satDate || null;
  }
  if (f.prepIelts !== false) {
    payload.ielts_target = num(f.ieltsTarget);
    payload.ielts_date = f.ieltsDate || null;
  }
  return payload;
}

// Whether a saved change is big enough to offer regenerating the plan.
export function planAffectingChange(before, after) {
  const keys = ["prepSat", "prepIelts", "satTarget", "ieltsTarget", "satDate", "ieltsDate", "intensity", "sessionMinutes"];
  if (keys.some((k) => String(before[k] ?? "") !== String(after[k] ?? ""))) return true;
  if (DAYS.some((d) => String(before.availability[d.key] || "") !== String(after.availability[d.key] || ""))) return true;
  return [...before.weakAreas].sort().join() !== [...after.weakAreas].sort().join();
}

// ---- Plan generation ------------------------------------------------------------
function examMultiplier(daysLeft) {
  if (daysLeft == null || daysLeft < 0) return 1;
  if (daysLeft <= 14) return 2;
  if (daysLeft <= 45) return 1.5;
  return 1;
}

function activeTopics(form, today, performanceWeak) {
  const out = [];
  const weak = new Set(form.weakAreas || []);
  const auto = new Set(performanceWeak || []);
  const groups = [];
  if (form.prepSat) {
    const left = form.satDate ? daysBetween(today, form.satDate) : null;
    const gap = num(form.satTarget) != null && num(form.curSat) != null ? num(form.satTarget) - num(form.curSat) : 0;
    groups.push({ exam: "SAT", mult: examMultiplier(left) * (gap >= 100 ? 1.25 : 1) });
  }
  if (form.prepIelts) {
    const left = form.ieltsDate ? daysBetween(today, form.ieltsDate) : null;
    const gap = num(form.ieltsTarget) != null && num(form.curIelts) != null ? num(form.ieltsTarget) - num(form.curIelts) : 0;
    groups.push({ exam: "IELTS", mult: examMultiplier(left) * (gap >= 1 ? 1.25 : 1) });
  }
  for (const g of groups) {
    const topics = CATALOGUE.filter((c) => c.exam === g.exam).map((c) => ({
      ...c,
      raw: 1 + (weak.has(c.key) ? 2 : 0) + (auto.has(c.key) ? 1 : 0),
    }));
    const total = topics.reduce((s, t) => s + t.raw, 0);
    // Each exam gets a share set by its own urgency, not by how many topics it has.
    for (const t of topics) out.push({ ...t, weight: (t.raw / total) * g.mult });
  }
  return out;
}

// Returns [{ task_date, exam, skill, topic, minutes, link_href }]. Days before
// `fromDate` are skipped (so regenerating mid-week never rewrites the past).
// Same input always gives the same plan.
export function generatePlan({ form, weekStart, fromDate, today = fromDate, performanceWeak = [] }) {
  const topics = activeTopics(form, today, performanceWeak);
  if (topics.length === 0) return [];
  const factor = (INTENSITIES.find((i) => i.id === form.intensity) || INTENSITIES[1]).factor;
  const session = Math.min(60, Math.max(15, Number(form.sessionMinutes) || 30));
  const assigned = Object.fromEntries(topics.map((t) => [t.key, 0]));
  const tasks = [];

  for (let i = 0; i < 7; i += 1) {
    const date = addDays(weekStart, i);
    if (date < fromDate) continue;
    const avail = Number(form.availability[dayKeyOf(date)]) || 0;
    const budget = Math.floor((avail * factor) / 5) * 5;
    if (budget < 15) continue;

    const slots = [];
    let left = budget;
    while (left >= 15 && slots.length < 6) {
      const m = Math.min(session, left);
      slots.push(m);
      left -= m;
    }
    const usedToday = new Set();
    for (const minutes of slots) {
      let best = null;
      for (const t of topics) {
        if (usedToday.has(t.key)) continue;
        const score = t.weight / (assigned[t.key] + 1);
        if (!best || score > best.score + 1e-9) best = { t, score };
      }
      if (!best) break;
      usedToday.add(best.t.key);
      assigned[best.t.key] += 1;
      tasks.push({ task_date: date, exam: best.t.exam, skill: best.t.skill, topic: best.t.topic, minutes, link_href: best.t.href });
    }
  }
  return tasks;
}

// ---- Summaries for the homepage ---------------------------------------------------
export function summarizePlan(tasks, today) {
  const list = tasks || [];
  const todays = list.filter((t) => t.task_date === today).sort((a, b) => a.position - b.position);
  const done = (t) => !!t.completed_at;
  const weekDone = list.filter(done).length;
  return {
    today: todays,
    todayMinutes: todays.reduce((s, t) => s + t.minutes, 0),
    todayDone: todays.filter(done).length,
    weekTotal: list.length,
    weekDone,
    weekMinutes: list.reduce((s, t) => s + t.minutes, 0),
    weekMinutesDone: list.filter(done).reduce((s, t) => s + t.minutes, 0),
  };
}

export function milestones(profile, prefs, today) {
  const out = [];
  const add = (exam, date, target, current, fmt) => {
    out.push({
      exam,
      date: date || null,
      daysLeft: date ? daysBetween(today, date) : null,
      target: target != null ? fmt(target) : null,
      current: current != null ? fmt(current) : null,
    });
  };
  if (profile?.preparing_for_sat || profile?.sat_target_date || profile?.sat_target_score != null) {
    add("SAT", profile.sat_target_date, profile.sat_target_score, prefs?.cur_sat, String);
  }
  if (profile?.preparing_for_ielts || profile?.ielts_target_date || profile?.ielts_target_score != null) {
    add("IELTS", profile.ielts_target_date, profile.ielts_target_score, prefs?.cur_ielts, (n) => Number(n).toFixed(1));
  }
  return out;
}

// Weak-area keys suggested by real exercise history (see utils/weakAreas.js).
export function performanceWeakKeys(weakAreas) {
  const keys = [];
  if (weakAreas?.satRW?.weakest) keys.push(`sat-rw:${weakAreas.satRW.weakest.id}`);
  if (weakAreas?.satMath?.weakest) keys.push(`sat-math:${weakAreas.satMath.weakest.id}`);
  if (weakAreas?.ieltsReading?.weakest) keys.push(`ielts-reading:${weakAreas.ieltsReading.weakest.id}`);
  return keys.filter((k) => catalogueEntry(k));
}
