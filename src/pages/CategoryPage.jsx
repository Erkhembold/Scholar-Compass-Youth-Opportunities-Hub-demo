import CategoryHero from "../components/CategoryHero.jsx";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import MockTestCard from "../components/MockTestCard.jsx";
import { opportunities } from "../data/opportunities.js";
import { CATEGORY_META } from "../data/categories.js";
import { TESTS } from "../data/ieltsTests.js";
import { useLanguage } from "../context/LanguageContext.jsx";

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

  const visible = opportunities.filter((op) => op.category === category);

  return (
    <>
      <CategoryHero label={meta.label} intro={meta.intro} pattern={meta.pattern} image={meta.image} />

      {category === "ielts" && (
        <section className="section board" aria-labelledby="mock-tests-heading">
          <div className="section__inner">
            <div className="section__head">
              <h2 id="mock-tests-heading" className="section__title">
                {t("IELTS Reading Mock Tests")}
              </h2>
              <p className="section__lede">
                {t(
                  "Ten full-length practice tests, each timed at 60 minutes with 40 questions across 3 passages. Two are live now — the rest are on the way."
                )}
              </p>
            </div>
            <div className="opp-grid" role="list">
              {TESTS.map((test, i) => (
                <div role="listitem" key={test.id}>
                  <MockTestCard test={test} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
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
            emptyMessage={`Nothing in ${meta.label} yet — check back soon.`}
          />
        </div>
      </section>
    </>
  );
}
