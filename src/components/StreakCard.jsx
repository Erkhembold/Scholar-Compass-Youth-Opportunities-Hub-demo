import { useStreak } from "../hooks/useStreak.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const MESSAGES = {
  done_today: "Today is done — see you tomorrow to keep it going.",
  at_risk: "Do any lesson or exercise today to keep your streak alive.",
  broken: "Your streak ended. Start a new one with any lesson or exercise today.",
  none: "Complete any lesson or exercise to start your streak.",
};

export default function StreakCard() {
  const { t } = useLanguage();
  const { current, longest, state, week, isSetUp } = useStreak();

  if (!isSetUp) {
    return (
      <div className="streak-card">
        <p className="streak-card__note">
          Daily streaks aren't switched on yet — the database update hasn't been applied.
        </p>
      </div>
    );
  }

  return (
    <div className="streak-card" data-state={state}>
      <div className="streak-card__head">
        <span className="streak-card__flame" aria-hidden="true">
          🔥
        </span>
        <div>
          <p className="streak-card__headline">
            {current} {t("DAY STREAK")}
          </p>
          <p className="streak-card__message">{t(MESSAGES[state])}</p>
        </div>
      </div>

      <div className="streak-card__stats">
        <div>
          <span className="streak-card__stat-label">{t("Current streak")}</span>
          <span className="streak-card__stat-value">
            {current} {current === 1 ? t("day") : t("days")}
          </span>
        </div>
        <div>
          <span className="streak-card__stat-label">{t("Longest streak")}</span>
          <span className="streak-card__stat-value">
            {longest} {longest === 1 ? t("day") : t("days")}
          </span>
        </div>
      </div>

      <ul className="streak-week" aria-label={t("This week")}>
        {week.map((d) => (
          <li
            key={d.date}
            className={`streak-week__day ${d.active ? "is-active" : ""} ${
              d.isToday ? "is-today" : ""
            } ${d.isFuture ? "is-future" : ""}`}
            aria-label={`${d.label}: ${d.active ? "activity completed" : d.isFuture ? "upcoming" : "no activity"}`}
          >
            <span className="streak-week__label">{d.label}</span>
            <span className="streak-week__mark" aria-hidden="true">
              {d.active ? "✓" : "—"}
            </span>
          </li>
        ))}
      </ul>

      <p className="streak-card__note">
        {t("Your day resets at midnight Ulaanbaatar time (UTC+8).")}
      </p>
    </div>
  );
}
