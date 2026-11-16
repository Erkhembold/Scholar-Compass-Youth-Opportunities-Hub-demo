import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { fetchMyAssessments } from "../utils/writingAssessments.js";
import { writingAssessmentHref } from "../router.js";
import { TASK_TYPE_LABEL } from "../data/writingTasks.js";

export default function WritingHistoryPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user || !supabase) return;
    fetchMyAssessments(user.id).then(setRows).catch(() => setError(true));
  }, [user]);

  const chronological = rows ? [...rows].reverse() : [];

  return (
    <section className="section board">
      <div className="section__inner wr-page">
        <a className="detail__back" href="#/ielts/practice/writing">← {t("Back to Writing practice")}</a>
        <h1 className="section__title">{t("My writing assessments")}</h1>
        <p className="section__lede">{t("AI-estimated bands from your past essays. Opening one does not use another AI assessment.")}</p>

        {authLoading ? null : !user ? (
          <p className="leaderboard-page__signin-note"><a href="#/signin">{t("Sign in")}</a> {t("to see your assessments.")}</p>
        ) : error ? (
          <p className="wr-error">{t("Could not load your assessments right now.")}</p>
        ) : rows === null ? (
          <p>{t("Loading…")}</p>
        ) : rows.length === 0 ? (
          <p className="board__empty">{t("No assessments yet — write your first essay.")}</p>
        ) : (
          <>
            <div className="wr-trend" role="img" aria-label={t("Band progress over time")}>
              {chronological.map((a) => (
                <div key={a.id} className="wr-trend__col" title={`${new Date(a.created_at).toLocaleDateString()} · ${a.overall_band}`}>
                  <span className="wr-trend__val">{Number(a.overall_band).toFixed(1)}</span>
                  <span className="wr-trend__bar" style={{ height: `${(Number(a.overall_band) / 9) * 100}%` }} />
                </div>
              ))}
            </div>
            <ul className="wr-history">
              {rows.map((a) => (
                <li key={a.id}>
                  <a href={writingAssessmentHref(a.id)}>
                    <span className="wr-history__band">{Number(a.overall_band).toFixed(1)}</span>
                    <span className="wr-history__main">
                      <strong>{a.task_title || a.task_id}</strong>
                      <small>
                        {TASK_TYPE_LABEL[a.task_type]} · {a.word_count} {t("words")} · {new Date(a.created_at).toLocaleString()}
                      </small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
