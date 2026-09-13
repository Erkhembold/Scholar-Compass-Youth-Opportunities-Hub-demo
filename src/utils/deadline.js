import { DEADLINE_STATUS_RULES } from "../data/config.js";

// Calculates deadline urgency ("green" / "yellow" / "red" / "expired") from
// the same deadline shape formatDeadline understands. Opportunities with no
// calculable date (label-only, like "Rolling", or nothing at all) return
// "unknown" — there's no fixed date to be urgent about, so no colored
// indicator is shown for them (see DeadlineStatus.jsx).
//
// Thresholds live in data/config.js (DEADLINE_STATUS_RULES) so they can be
// tuned without touching this logic or any component that renders it.
export function getDeadlineStatus(deadline) {
  if (!deadline || !deadline.date) {
    return { level: "unknown", label: "No fixed deadline" };
  }

  const target = new Date(`${deadline.date}T${deadline.time || "23:59"}:00`);
  if (Number.isNaN(target.getTime())) {
    return { level: "unknown", label: "No fixed deadline" };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil((target.getTime() - Date.now()) / msPerDay);

  if (daysRemaining < 0) {
    return { level: "expired", label: "Deadline passed", daysRemaining };
  }

  const dayWord = (n) => `${n} day${n === 1 ? "" : "s"}`;
  const label = daysRemaining === 0 ? "Deadline today" : `Deadline in ${dayWord(daysRemaining)}`;

  if (daysRemaining <= DEADLINE_STATUS_RULES.redMaxDays) {
    return { level: "red", label, daysRemaining };
  }
  if (daysRemaining <= DEADLINE_STATUS_RULES.yellowMaxDays) {
    return { level: "yellow", label, daysRemaining };
  }
  return { level: "green", label, daysRemaining };
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
