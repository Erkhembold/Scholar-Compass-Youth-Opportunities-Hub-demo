import LevelCard from "../components/LevelCard.jsx";
import QuestionsStatCard from "../components/QuestionsStatCard.jsx";
import StreakMilestonesCard from "../components/StreakMilestonesCard.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { profileHref } from "../router.js";

export default function ProfileStatsPage() {
  const { t } = useLanguage();
  return (
    <section className="section stats-page" aria-labelledby="stats-heading">
      <div className="section__inner">
        <a className="stats-page__back" href={profileHref()}>
          ← {t("Back to profile")}
        </a>
        <div className="section__head">
          <h1 id="stats-heading" className="section__title">
            {t("Your progress")}
          </h1>
          <p className="section__lede">
            {t(
              "Your level, questions answered, and streak — including how far you are from your next streak milestone."
            )}
          </p>
        </div>

        <div className="stats-page__grid">
          <LevelCard />
          <QuestionsStatCard />
        </div>
        <div className="stats-page__grid stats-page__grid--full">
          <StreakMilestonesCard />
        </div>
      </div>
    </section>
  );
}
