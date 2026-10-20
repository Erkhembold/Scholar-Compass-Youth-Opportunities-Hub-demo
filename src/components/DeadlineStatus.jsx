import { useEffect, useState } from "react";
import { getDeadlineStatus, getDeadlineInstant } from "../utils/deadline.js";

// Small colored-dot + text countdown showing how urgent an opportunity's
// deadline is ("Deadline in 12 days", then "Deadline in 5h 20m" in the last
// 24 hours, ticking once a minute). Used on opportunity cards, the detail
// page, and Saved Opportunities — all read from this one component so the
// rules never drift apart.
//
// Color is never the only signal: the text label always renders alongside
// the dot, and the dot itself carries a title/aria-label with the same
// text for tooltip + screen-reader support.
//
// `showUnknown`: cards pass this so an opportunity without a calendar date
// still shows a (neutral) line instead of nothing.
export default function DeadlineStatus({ deadline, size = "sm", showUnknown = false }) {
  const [now, setNow] = useState(() => Date.now());

  // Only tick while the deadline is less than a day away; further out the
  // label changes at most once a day, so a page load is accurate enough.
  const target = getDeadlineInstant(deadline);
  const closeToDeadline = !!target && target.getTime() - now < 24 * 3600 * 1000 && target.getTime() > now;
  useEffect(() => {
    if (!closeToDeadline) return undefined;
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, [closeToDeadline]);

  const status = getDeadlineStatus(deadline, now);

  if (status.level === "unknown") {
    if (!showUnknown) return null;
    return (
      <span className={`deadline-status deadline-status--expired deadline-status--${size}`}>
        <span className="deadline-status__dot" aria-hidden="true" />
        <span className="deadline-status__label">{status.label}</span>
      </span>
    );
  }

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
