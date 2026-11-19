import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { fetchMyAssessments } from "../utils/writingAssessments.js";
import MockTestCard from "../components/MockTestCard.jsx";
import WritingTaskCard from "../components/WritingTaskCard.jsx";
import { TESTS } from "../data/ieltsTests.js";
import { WRITING_TASKS } from "../data/writingTasks.js";
import { writingAssessmentsHref } from "../router.js";
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
      "Write an Academic Task 1 or Task 2 response and get an AI-estimated band across all four IELTS criteria, with detailed feedback in Mongolian.",
  },
};

export default function IeltsPracticePage({ skill }) {
  const { t } = useLanguage();
  const meta = SKILL_META[skill];
  const { user } = useAuth();
  const [bestBands, setBestBands] = useState({});
  useEffect(() => {
    if (skill !== "writing" || !user || !supabase) return undefined;
    let off = false;
    fetchMyAssessments(user.id, { limit: 300 })
      .then((rows) => {
        if (off) return;
        const m = {};
        for (const r of rows) {
          const b = Number(r.overall_band);
          if (!(m[r.task_id] >= b)) m[r.task_id] = b;
        }
        setBestBands(m);
      })
      .catch(() => {});
    return () => { off = true; };
  }, [skill, user]);

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
          {skill === "writing" && meta.ready && (
            <p className="wr-page__history-link">
              <a href={writingAssessmentsHref()}>{t("My writing history")} →</a>
            </p>
          )}
          {meta.ready ? (
            skill === "writing" ? null : <p className="section__lede">{t(meta.lede)}</p>
          ) : (
            <p className="section__lede">
              {t(meta.label)} practice isn't available yet — it's next on the list. In the
              meantime, <a href="#/ielts/practice/reading">try the Reading tests</a>.
            </p>
          )}
        </div>

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
          <>
            {["task1", "task2"].map((type) => (
              <div key={type}>
                <h2 className="wr-group-title">
                  {type === "task1" ? "Academic Task 1 — " + t("Describe data") : "Academic Task 2 — " + t("Essay")}
                </h2>
                <div className="wr-hub-grid" role="list">
                  {WRITING_TASKS.filter((task) => task.type === type).map((task) => (
                    <div role="listitem" key={task.id}>
                      <WritingTaskCard task={task} band={bestBands[task.id]} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
