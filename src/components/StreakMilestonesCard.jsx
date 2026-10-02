import { useStreak } from "../hooks/useStreak.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { buildMilestones, milestoneLabel } from "../utils/streakMilestones.js";

function formatDayLabel(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function StreakMilestonesCard() {
  const { t } = useLanguage();
  const { current, longest, state, isSetUp, loading } = useStreak();
  const isAlive = state === "done_today" || state === "at_risk";

  if (loading) {
    return (
      <div className="stat-card">
        <h2 className="stat-card__heading">{t("Streak milestones")}</h2>
        <p className="signin__lede">Loading…</p>
      </div>
    );
  }

  if (!isSetUp) {
    return (
      <div className="stat-card">
        <h2 className="stat-card__heading">{t("Streak milestones")}</h2>
        <p className="streak-card__note">{t("Streak tracking isn't switched on yet.")}</p>
      </div>
    );
  }

  const milestones = buildMilestones({ current, longest, isAlive });

  return (
    <div className="stat-card milestones-card">
      <h2 className="stat-card__heading">{t("Streak milestones")}</h2>

      <div className="milestones-card__headline">
        <span className="milestones-card__flame" aria-hidden="true">
          🔥
        </span>
        <div>
          <p className="milestones-card__current">
            {current} {current === 1 ? t("day") : t("days")} — {t("current streak")}
          </p>
          <p className="milestones-card__longest">
            {t("Longest ever:")} {longest} {longest === 1 ? t("day") : t("days")}
          </p>
        </div>
      </div>

      <ul className="milestone-list">
        {milestones.map((m) => (
          <li
            key={m.days}
            className={`milestone-chip ${m.achieved ? "is-achieved" : ""} ${
              m.daysToGo === 0 ? "is-today" : ""
            }`}
          >
            <span className="milestone-chip__icon" aria-hidden="true">
              {m.achieved ? "✓" : "🔥"}
            </span>
            <span className="milestone-chip__text">
              <span className="milestone-chip__label">{t(milestoneLabel(m.days))}</span>
              <span className="milestone-chip__sub">
                {m.achieved
                  ? t("Reached")
                  : m.daysToGo === null
                  ? t("Start a streak to work toward this")
                  : m.daysToGo === 0
                  ? t("Today!")
                  : `${m.daysToGo} ${m.daysToGo === 1 ? t("day") : t("days")} ${t(
                      "to go — around"
                    )} ${formatDayLabel(m.targetDate)}`}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
