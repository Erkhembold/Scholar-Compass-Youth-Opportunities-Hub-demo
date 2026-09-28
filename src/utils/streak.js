import { supabase } from "../lib/supabaseClient.js";

// Streak days are calendar days in Ulaanbaatar time (UTC+8, no DST) — the
// same convention utils/deadline.js uses. The DATABASE is the authority
// (public.ub_today() in supabase/streaks_and_exercise_history.sql); this
// file only mirrors that convention for DISPLAY, e.g. to show a streak as
// broken once a whole Ulaanbaatar day has been missed.
export const STREAK_TIMEZONE = "Asia/Ulaanbaatar";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: STREAK_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// "YYYY-MM-DD" for the Ulaanbaatar calendar day containing `now`.
export function todayInUB(now = new Date()) {
  return dayFormatter.format(now);
}

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Monday-first week containing `today`: seven "YYYY-MM-DD" strings.
export function weekDates(today) {
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  const monday = addDays(today, -((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// What to SHOW for a profile row. The stored current_streak only changes
// when an activity is recorded, so if the last activity is older than
// yesterday the streak is already broken even though the column still
// holds the old number.
//   done_today — counted today
//   at_risk    — counted yesterday, nothing yet today (still alive)
//   broken     — missed at least one full day
//   none       — never had an activity
export function streakStatus(profile, today = todayInUB()) {
  const stored = profile?.current_streak || 0;
  const last = profile?.last_activity_date || null;
  let state = "none";
  let current = 0;
  if (last === today) {
    state = "done_today";
    current = stored;
  } else if (last === addDays(today, -1)) {
    state = "at_risk";
    current = stored;
  } else if (last) {
    state = "broken";
  }
  return {
    state,
    current,
    longest: Math.max(profile?.longest_streak || 0, current),
    last,
    doneToday: state === "done_today",
  };
}

// Reports one qualifying activity to the database. Never throws and never
// blocks the caller: if the SQL hasn't been run yet, or the network fails,
// the learning feature it was called from keeps working normally.
// type: sat_question | ielts_exercise | ielts_mock | ielts_writing |
//       ielts_1v1 | lesson
export async function recordActivity(type, ref = "") {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc("record_activity", {
      p_type: type,
      p_ref: String(ref ?? ""),
    });
    if (error) return null;
    window.dispatchEvent(new CustomEvent("sc:activity", { detail: data }));
    return data;
  } catch {
    return null;
  }
}
