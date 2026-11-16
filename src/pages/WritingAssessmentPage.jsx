import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { fetchAssessment } from "../utils/writingAssessments.js";
import { writingAssessmentsHref } from "../router.js";
import WritingAssessmentView from "../components/WritingAssessmentView.jsx";

// Re-opens a stored assessment (read-only; never calls the AI).
export default function WritingAssessmentPage({ id }) {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [row, setRow] = useState(undefined);

  useEffect(() => {
    if (!user || !supabase) return;
    fetchAssessment(id).then(setRow).catch(() => setRow(null));
  }, [user, id]);

  return (
    <section className="section">
      <div className="section__inner wr-page">
        <a className="detail__back" href={writingAssessmentsHref()}>← {t("All my writing assessments")}</a>
        {authLoading ? null : !user ? (
          <p className="leaderboard-page__signin-note"><a href="#/signin">{t("Sign in")}</a> {t("to see your assessments.")}</p>
        ) : row === undefined ? (
          <p>{t("Loading…")}</p>
        ) : !row || row.status !== "completed" ? (
          <p className="board__empty">{t("Assessment not found.")}</p>
        ) : (
          <>
            <p className="wr-page__kicker">
              {row.task_type === "task1" ? "Academic Task 1" : "Academic Task 2"} · {new Date(row.created_at).toLocaleString()}
            </p>
            <h1 className="section__title">{row.task_title || row.task_id}</h1>
            <p className="section__lede wr-page__prompt">{row.task_prompt}</p>
            <WritingAssessmentView result={row.result} taskType={row.task_type} wordCount={row.word_count} essayText={row.essay_text} />
          </>
        )}
      </div>
    </section>
  );
}
