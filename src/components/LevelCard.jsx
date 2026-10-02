import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { levelProgress } from "../utils/levels.js";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LevelCard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { level, floor, ceiling, total, remaining, fraction } = levelProgress(
    profile?.lifetime_xp || 0
  );
  const offset = CIRCUMFERENCE * (1 - fraction);

  return (
    <div className="stat-card level-card">
      <h2 className="stat-card__heading">{t("Level progress")}</h2>

      <div className="level-card__body">
        <div className="level-card__ring" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <circle className="level-card__ring-track" cx="50" cy="50" r={RADIUS} />
            <circle
              className="level-card__ring-fill"
              cx="50"
              cy="50"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="level-card__ring-label">
            <span className="level-card__ring-number">{level}</span>
            <span className="level-card__ring-word">{t("Level")}</span>
          </div>
        </div>

        <div className="level-card__details">
          <p className="level-card__to-next">
            {remaining.toLocaleString()} {t("pts to Level")} {level + 1}
          </p>
          <div
            className="level-card__bar"
            role="img"
            aria-label={`${Math.round(fraction * 100)}% of the way to level ${level + 1}`}
          >
            <div className="level-card__bar-fill" style={{ width: `${fraction * 100}%` }} />
          </div>
          <div className="level-card__bar-ends">
            <span>
              {floor.toLocaleString()} {t("pts")}
            </span>
            <span>
              {ceiling.toLocaleString()} {t("pts")}
            </span>
          </div>
          <p className="level-card__total">
            {t("Current:")} <strong>{total.toLocaleString()}</strong> {t("total points")}
          </p>
        </div>
      </div>
    </div>
  );
}
