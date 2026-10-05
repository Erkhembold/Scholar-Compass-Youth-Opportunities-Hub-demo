import { useStreak } from "../hooks/useStreak.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { profileStatsHref } from "../router.js";

// A compact "X Day Streak" readout for the dashboard header — just the
// number and a flame, no week row or milestone messaging (that detail
// still lives on the full StreakCard at /profile/stats, which this
// links to). Renders nothing while streaks aren't set up, so it never
// shows a misleading "0 Day Streak" before the database migration runs.
export default function DashboardStreakPill() {
  const { t } = useLanguage();
  const { current, isSetUp } = useStreak();

  if (!isSetUp) return null;

  return (
    <a className="dashboard-streak-pill" href={profileStatsHref()}>
      <span className="dashboard-streak-pill__icon" aria-hidden="true">
        🔥
      </span>
      <span>
        {current} {t("Day Streak")}
      </span>
    </a>
  );
}
