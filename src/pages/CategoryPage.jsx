import CategoryHero from "../components/CategoryHero.jsx";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import IeltsPracticePicker from "../components/IeltsPracticePicker.jsx";
import { opportunities } from "../data/opportunities.js";
import { CATEGORY_META } from "../data/categories.js";
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

      {category === "ielts" && <IeltsPracticePicker />}

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
