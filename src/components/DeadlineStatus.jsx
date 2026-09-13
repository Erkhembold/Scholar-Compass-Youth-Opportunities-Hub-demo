import { getDeadlineStatus } from "../utils/deadline.js";

// Small colored-dot + text indicator showing how urgent an opportunity's
// deadline is. Used on opportunity cards, the detail page, and Saved
// Opportunities — all three read from this one component so the rules
// (and any future visual tweak) never drift out of sync between them.
//
// Color is never the only signal: the text label always renders alongside
// the dot, and the dot itself carries a title/aria-label with the same
// text for tooltip + screen-reader support.
export default function DeadlineStatus({ deadline, size = "sm" }) {
  const status = getDeadlineStatus(deadline);

  // No calculable date (rolling / unspecified) — nothing urgent to flag.
  if (status.level === "unknown") return null;

  return (
    <span
      className={`deadline-status deadline-status--${status.level} deadline-status--${size}`}
      title={status.label}
    >
      <span className="deadline-status__dot" aria-hidden="true" />
      <span className="deadline-status__label">{status.label}</span>
    </span>
  );
}
