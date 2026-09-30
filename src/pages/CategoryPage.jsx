import CategoryHero from "../components/CategoryHero.jsx";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import IeltsPracticePicker from "../components/IeltsPracticePicker.jsx";
import IeltsExercisesPicker from "../components/IeltsExercisesPicker.jsx";
import SatCategoryOverview from "../components/SatCategoryOverview.jsx";
import SatMathOverview from "../components/SatMathOverview.jsx";
import { opportunities } from "../data/opportunities.js";
import { CATEGORY_META } from "../data/categories.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getActiveOpportunities } from "../utils/deadline.js";
import { archiveHref, ieltsBeginnerGuideHref, ieltsChallengeHref } from "../router.js";

export default function CategoryPage({ category }) {
  const { t } = useLanguage();
  const meta = CATEGORY_META[category];

  if (!meta) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Category not found</h1>
          <p className="section__lede">
            That category doesn't exist yet.{" "}
            <a href="#/">Back to the homepage.</a>
          </p>
        </div>
      </section>
    );
  }

  const visible = getActiveOpportunities(opportunities).filter((op) => op.category === category);

  return (
    <>
      <CategoryHero label={meta.label} intro={meta.intro} pattern={meta.pattern} image={meta.image} />

      {category === "ielts" && (
        <section className="section practice-picker" aria-labelledby="practice-picker-heading">
          <div className="section__inner practice-picker__row">
            <IeltsPracticePicker />
            <IeltsExercisesPicker />
          </div>

          <div className="section__inner">
            <div className="category-actions">
              <a href={ieltsBeginnerGuideHref()} className="category-action-card category-action-card--lessons">
                <span className="category-action-icon" aria-hidden="true">
                  📘
                </span>
                <span className="category-action-text">
                  <span className="category-action-title">IELTS Lessons</span>
                  <span className="category-action-sub">Start with the Beginner Guide</span>
                </span>
                <span className="category-action-arrow" aria-hidden="true">
                  →
                </span>
              </a>

              <a href={ieltsChallengeHref()} className="category-action-card category-action-card--challenge">
                <span className="category-action-icon" aria-hidden="true">
                  ⚡
                </span>
                <span className="category-action-text">
                  <span className="category-action-title">1v1 Challenge</span>
                  <span className="category-action-sub">Go head-to-head with a friend</span>
                </span>
                <span className="category-action-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {category === "sat" && (
        <>
          <SatCategoryOverview />
          <SatMathOverview />
        </>
      )}

      <section
        id="category-board"
        className="section board"
        aria-labelledby="category-board-heading"
      >
        <div className="section__inner">
          <div className="section__head">
            <h2 id="category-board-heading" className="section__title">
              {meta.label} opportunities
            </h2>
            <p className="section__lede">
              {t("Every current listing in this category — new ones are added as they come in.")}
            </p>
          </div>

          <OpportunityGrid
            opportunities={visible}
            emptyMessage={`Nothing current in ${meta.label} right now — check back soon.`}
          />
          <p className="board__archive-link">
            <a href={archiveHref()}>{t("Browse archived opportunities")}</a>
          </p>
        </div>
      </section>
    </>
  );
}
