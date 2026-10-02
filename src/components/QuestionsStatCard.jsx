import { useProgressData } from "../hooks/useProgressData.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { buildOverallStats } from "../utils/progress.js";

export default function QuestionsStatCard() {
  const { t } = useLanguage();
  const { progress, loading, isSetUp } = useProgressData();

  if (loading) {
    return (
      <div className="stat-card">
        <h2 className="stat-card__heading">{t("Questions")}</h2>
        <p className="signin__lede">Loading…</p>
      </div>
    );
  }

  const { totalAnswered, accuracy } =
    isSetUp && progress ? buildOverallStats(progress) : { totalAnswered: 0, accuracy: null };

  return (
    <div className="stat-card">
      <h2 className="stat-card__heading">{t("Questions")}</h2>

      {totalAnswered === 0 ? (
        <p className="streak-card__note">
          {t("No questions answered yet — try a SAT or IELTS exercise to start building this up.")}
        </p>
      ) : (
        <dl className="stat-row-list">
          <div className="stat-row">
            <dt>{t("Total answered")}</dt>
            <dd>{totalAnswered.toLocaleString()}</dd>
          </div>
          <div className="stat-row">
            <dt>{t("Overall accuracy")}</dt>
            <dd>{accuracy == null ? "—" : `${Math.round(accuracy * 100)}%`}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
