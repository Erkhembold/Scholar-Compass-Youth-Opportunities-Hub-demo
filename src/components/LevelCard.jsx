import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProgressRing from "./ProgressRing.jsx";
import { levelProgress } from "../utils/levels.js";

export default function LevelCard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { level, floor, ceiling, total, remaining, fraction } = levelProgress(
    profile?.lifetime_xp || 0
  );

  return (
    <div className="stat-card level-card">
      <h2 className="stat-card__heading">{t("Level progress")}</h2>

      <div className="level-card__body">
        <ProgressRing
          percent={fraction * 100}
          size={92}
          strokeWidth={9}
          color="var(--level-ring-fill)"
          label={`${Math.round(fraction * 100)}% of the way to level ${level + 1}`}
        >
          <span className="level-card__ring-number">{level}</span>
          <span className="level-card__ring-word">{t("Level")}</span>
        </ProgressRing>

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
