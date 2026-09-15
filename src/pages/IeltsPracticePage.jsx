import MockTestCard from "../components/MockTestCard.jsx";
import { TESTS } from "../data/ieltsTests.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const SKILL_META = {
  reading: {
    label: "Reading",
    ready: true,
    lede:
      "Ten full-length practice tests, each timed at 60 minutes with 40 questions across 3 passages.",
  },
  listening: { label: "Listening", ready: false },
  speaking: { label: "Speaking", ready: false },
  writing: { label: "Writing", ready: false },
};

export default function IeltsPracticePage({ skill }) {
  const { t } = useLanguage();
  const meta = SKILL_META[skill];

  if (!meta) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Practice not found</h1>
          <p className="section__lede">
            <a href="#/category/ielts">Back to IELTS.</a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section board">
      <div className="section__inner">
        <a className="detail__back" href="#/category/ielts">
          ← {t("Back")} to IELTS
        </a>

        <div className="section__head">
          <h1 className="section__title">
            IELTS {t(meta.label)} {t("Practice")}
          </h1>
          {meta.ready ? (
            <p className="section__lede">{t(meta.lede)}</p>
          ) : (
            <p className="section__lede">
              {t(meta.label)} practice isn't available yet — it's next on the list. In the
              meantime, <a href="#/ielts/practice/reading">try the Reading tests</a>.
            </p>
          )}
        </div>

        {meta.ready && (
          <div className="opp-grid" role="list">
            {TESTS.map((test, i) => (
              <div role="listitem" key={test.id}>
                <MockTestCard test={test} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
