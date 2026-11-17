import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { WRITING_TASKS } from "../data/writingTasks.js";
import { WRITING_DAILY_LIMIT } from "../data/config.js";
import { recordActivity } from "../utils/streak.js";
import { submitEssay, fetchMyAssessments, countRecentEvaluations } from "../utils/writingAssessments.js";
import { writingAssessmentHref, writingAssessmentsHref } from "../router.js";
import WritingAssessmentView from "../components/WritingAssessmentView.jsx";

const MIN_TO_SUBMIT = 50;

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function fmtClock(sec) {
  const neg = sec < 0;
  const a = Math.abs(sec);
  return `${neg ? "−" : ""}${Math.floor(a / 60)}:${String(a % 60).padStart(2, "0")}`;
}

export default function WritingTaskPage({ id }) {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const task = useMemo(() => WRITING_TASKS.find((x) => x.id === id), [id]);

  const [essay, setEssay] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [used, setUsed] = useState(null);
  const [past, setPast] = useState([]);

  // Optional timer: counts down from the suggested time and keeps counting
  // (negative) past zero. It never blocks writing or submitting.
  const [timerOn, setTimerOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!timerOn) return undefined;
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(iv);
  }, [timerOn]);

  // One request id per distinct essay: retrying the same text is safe (the
  // server returns the stored result instead of paying for a second AI call).
  const requestRef = useRef({ essay: null, id: null });

  useEffect(() => {
    let cancelled = false;
    if (!user || !supabase || !task) return undefined;
    countRecentEvaluations(user.id).then((n) => !cancelled && setUsed(n)).catch(() => {});
    fetchMyAssessments(user.id, { taskId: task.id, limit: 10 }).then((r) => !cancelled && setPast(r)).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user, task]);

  if (!task) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">{t("Task not found")}</h1>
          <p className="section__lede">
            <a href="#/category/ielts">{t("Back to IELTS")}</a>
          </p>
        </div>
      </section>
    );
  }

  const words = wordCount(essay);
  const underLimit = words > 0 && words < task.minWords;
  const left = used === null ? null : Math.max(0, WRITING_DAILY_LIMIT - used);
  const canSubmit = !!user && !submitting && words >= MIN_TO_SUBMIT && (left === null || left > 0);
  const secondsLeft = task.suggestedMinutes * 60 - elapsed;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    if (requestRef.current.essay !== essay) {
      requestRef.current = { essay, id: crypto.randomUUID() };
    }
    try {
      const a = await submitEssay({
        task,
        essayText: essay,
        requestId: requestRef.current.id,
        durationSeconds: timerOn ? elapsed : undefined,
      });
      setAssessment(a);
      setTimerOn(false);
      recordActivity("ielts_writing", task.id);
      setUsed((u) => (u === null ? u : u + 1));
      fetchMyAssessments(user.id, { taskId: task.id, limit: 10 }).then(setPast).catch(() => {});
    } catch (err) {
      setError({ message: err.message || "Something went wrong. Try again.", detail: err.detail || "" });
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setAssessment(null);
    setEssay("");
    setElapsed(0);
    setTimerOn(false);
    setError(null);
  }

  return (
    <section className="section">
      <div className="section__inner wr-page">
        <a href="#/category/ielts" className="detail__back">
          ← {t("Back to IELTS")}
        </a>
        <p className="wr-page__kicker">
          {task.type === "task1" ? "Academic Task 1" : "Academic Task 2"} · {task.minWords}+ {t("words")} · ~{task.suggestedMinutes} {t("min")}
        </p>
        <h1 className="section__title">{task.title}</h1>
        <p className="section__lede wr-page__prompt">{task.prompt}</p>

        {task.dataTable && (
          <div className="wr-table-wrap">
            <table className="wr-table">
              <caption>{task.dataTable.caption}</caption>
              <thead>
                <tr>{task.dataTable.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {task.dataTable.rows.map((r) => (
                  <tr key={r[0]}>{r.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {authLoading ? null : !user ? (
          <p className="leaderboard-page__signin-note">
            <a href="#/signin">{t("Sign in")}</a> {t("to write an essay and get an AI assessment.")}
          </p>
        ) : left === 0 ? (
          <p className="leaderboard-page__signin-note">
            {t("You have used all of your AI assessments for the last 24 hours. Try again later.")}
          </p>
        ) : null}

        {!assessment && (
          <div className="wr-editor">
            <div className="wr-editor__bar">
              <button type="button" className="btn btn--ghost" onClick={() => setTimerOn((v) => !v)}>
                {timerOn ? t("Pause timer") : elapsed > 0 ? t("Resume timer") : t("Start timer")}
              </button>
              {(timerOn || elapsed > 0) && (
                <span className={`wr-timer ${secondsLeft < 0 ? "wr-timer--over" : ""}`} aria-live="off">
                  {fmtClock(secondsLeft)}
                </span>
              )}
            </div>

            <textarea
              className="wr-editor__text"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              disabled={!user || submitting}
              rows={18}
              maxLength={6500}
              placeholder={t("Write your essay here…")}
              aria-label={t("Essay")}
            />
            <p className={`wr-editor__count ${underLimit ? "wr-editor__count--warn" : ""}`}>
              {words} {t("words")} ({t("minimum")} {task.minWords}
              {words > 0 && words < MIN_TO_SUBMIT ? `, ${t("at least")} ${MIN_TO_SUBMIT} ${t("to submit")}` : ""})
              {left !== null && user ? ` · ${left} ${t("AI assessments left (24 h)")}` : ""}
            </p>

            {error && (
              <p className="wr-error" role="alert">
                {error.message}
                {error.detail ? <small style={{ display: "block", opacity: 0.8 }}>{error.detail}</small> : null}
              </p>
            )}

            <button type="button" className="btn btn--accent" disabled={!canSubmit} onClick={handleSubmit}>
              {submitting ? t("Assessing… this takes up to a minute") : t("Submit for assessment")}
            </button>
          </div>
        )}

        {assessment && (
          <>
            <WritingAssessmentView
              result={assessment.result}
              taskType={task.type}
              wordCount={assessment.wordCount}
              essayText={essay}
            />
            <button type="button" className="btn btn--ghost" style={{ marginTop: 24 }} onClick={reset}>
              {t("Write another attempt")}
            </button>
          </>
        )}

        {user && past.length > 0 && (
          <section className="wr-past">
            <h2>{t("Your previous attempts on this task")}</h2>
            <ul>
              {past.map((a) => (
                <li key={a.id}>
                  <a href={writingAssessmentHref(a.id)}>
                    {new Date(a.created_at).toLocaleDateString()} · {a.word_count} {t("words")} · <strong>{Number(a.overall_band).toFixed(1)}</strong>
                  </a>
                </li>
              ))}
            </ul>
            <p><a href={writingAssessmentsHref()}>{t("All my writing assessments")} →</a></p>
          </section>
        )}
      </div>
    </section>
  );
}
