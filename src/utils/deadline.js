import { DEADLINE_STATUS_RULES } from "../data/config.js";

// ScholarCompass serves Mongolian students, so every deadline is interpreted
// in Ulaanbaatar time (UTC+8, no daylight saving) regardless of where the
// viewer's browser happens to be. Without an explicit offset, `new Date(...)`
// would parse "2026-09-21T23:59" in the *viewer's* timezone and archive
// listings hours early or late for anyone outside Mongolia.
export const DEADLINE_UTC_OFFSET = "+08:00";

// Deadline date+time as an absolute instant, or null when the deadline has no
// usable machine-readable date (label-only like "Rolling", missing, or a
// malformed string). A date with no time means "end of that day".
export function getDeadlineInstant(deadline) {
  if (!deadline || !deadline.date) return null;

  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(deadline.date);
  const timeOk = !deadline.time || /^\d{2}:\d{2}$/.test(deadline.time);
  if (!dateOk || !timeOk) return null;

  const target = deadline.time
    ? new Date(`${deadline.date}T${deadline.time}:00${DEADLINE_UTC_OFFSET}`)
    : new Date(`${deadline.date}T23:59:59.999${DEADLINE_UTC_OFFSET}`);
  return Number.isNaN(target.getTime()) ? null : target;
}

// The one source of truth for "has this deadline passed?". Anything that
// needs to decide active vs archived must go through this (or the
// isOpportunityArchived wrapper below) so no two screens can disagree.
// Opportunities with no calculable deadline are NEVER treated as passed —
// wrongly hiding a live opportunity is worse than showing a stale one.
export function isDeadlinePassed(deadline, now = Date.now()) {
  const target = getDeadlineInstant(deadline) || getArchiveInstant(deadline);
  if (!target) return false;
  return now > target.getTime();
}

// Label-only deadlines ("Event day — Sep 12, 2026") have no `date`, so the
// urgency indicator has nothing to count down to — but the listing still
// needs to leave the active feed once the event is over. Those entries carry
// an optional `archiveDate` (last day of the event, YYYY-MM-DD, Ulaanbaatar
// time) used ONLY for archiving, never for the urgency indicator or display.
function getArchiveInstant(deadline) {
  if (!deadline || !deadline.archiveDate) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline.archiveDate)) return null;
  const t = new Date(`${deadline.archiveDate}T23:59:59.999${DEADLINE_UTC_OFFSET}`);
  return Number.isNaN(t.getTime()) ? null : t;
}

export function isOpportunityArchived(opportunity, now = Date.now()) {
  return isDeadlinePassed(opportunity?.deadline, now);
}

// ACTIVE / ARCHIVED partition of a list, preserving the input order.
export function partitionOpportunities(list, now = Date.now()) {
  const active = [];
  const archived = [];
  for (const op of list) {
    (isOpportunityArchived(op, now) ? archived : active).push(op);
  }
  return { active, archived };
}

export function getActiveOpportunities(list, now = Date.now()) {
  return partitionOpportunities(list, now).active;
}

// Calculates deadline urgency ("green" / "yellow" / "red" / "expired") from
// the same deadline shape formatDeadline understands. Opportunities with no
// calculable date (label-only, like "Rolling", or nothing at all) return
// "unknown" — there's no fixed date to be urgent about, so no colored
// indicator is shown for them (see DeadlineStatus.jsx).
//
// Thresholds live in data/config.js (DEADLINE_STATUS_RULES) so they can be
// tuned without touching this logic or any component that renders it.
export function getDeadlineStatus(deadline) {
  const target = getDeadlineInstant(deadline);
  if (!target) {
    return { level: "unknown", label: "No fixed deadline" };
  }

  const now = Date.now();
  if (isDeadlinePassed(deadline, now)) {
    return { level: "expired", label: "Deadline passed" };
  }

  // Not passed yet, so at least one instant remains. Counting in whole days
  // with ceil means "later today" is 1, which we present as "today" below
  // when the target falls on today's Ulaanbaatar calendar date.
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil((target.getTime() - now) / msPerDay);
  const ubDate = (t) =>
    new Date(t + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const isToday = ubDate(target.getTime()) === ubDate(now);
  const effectiveDays = isToday ? 0 : daysRemaining;

  const dayWord = (n) => `${n} day${n === 1 ? "" : "s"}`;
  const label = effectiveDays === 0 ? "Deadline today" : `Deadline in ${dayWord(effectiveDays)}`;

  if (effectiveDays <= DEADLINE_STATUS_RULES.redMaxDays) {
    return { level: "red", label, daysRemaining: effectiveDays };
  }
  if (effectiveDays <= DEADLINE_STATUS_RULES.yellowMaxDays) {
    return { level: "yellow", label, daysRemaining: effectiveDays };
  }
  return { level: "green", label, daysRemaining: effectiveDays };
}

// Formats the various shapes a deadline can take: a plain override label
// ("Rolling until event day"), an ISO date with optional time, or nothing
// at all ("Not specified"). Centralized so cards and the detail page never
// disagree on formatting.
export function formatDeadline(deadline, { withPrefix = false } = {}) {
  if (!deadline) return "Not specified";

  if (deadline.label) return deadline.label;

  if (!deadline.date) return "Not specified";

  const parsed = new Date(`${deadline.date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return deadline.date;

  const datePart = parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const full = deadline.time ? `${datePart}, ${deadline.time}` : datePart;
  return withPrefix ? `Due ${full}` : full;
}
