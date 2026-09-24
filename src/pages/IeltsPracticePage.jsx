import MockTestCard from "../components/MockTestCard.jsx";
import WritingTaskCard from "../components/WritingTaskCard.jsx";
import { TESTS } from "../data/ieltsTests.js";
import { WRITING_TASKS } from "../data/writingTasks.js";
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
  writing: {
    label: "Writing",
    ready: true,
    lede:
      "Write a full Task 2 essay and get an AI-evaluated band score across all four official criteria, with specific feedback.",
  },
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

        <a className="btn btn--accent" href="#/ielts/1v1" style={{ marginBottom: 28 }}>
          Challenge a friend 1v1
        </a>

        {meta.ready && skill === "reading" && (
          <div className="opp-grid" role="list">
            {TESTS.map((test, i) => (
              <div role="listitem" key={test.id}>
                <MockTestCard test={test} index={i} />
              </div>
            ))}
          </div>
        )}

        {meta.ready && skill === "writing" && (
          <div className="opp-grid" role="list">
            {WRITING_TASKS.map((task) => (
              <div role="listitem" key={task.id}>
                <WritingTaskCard task={task} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
