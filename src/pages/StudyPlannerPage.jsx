import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useStudyPlanner } from "../hooks/useStudyPlanner.js";
import StudyTaskRow from "../components/StudyTaskRow.jsx";
import { formatMinutes } from "../components/StudyPlannerSection.jsx";
import { DAYS, addDays, milestones } from "../utils/studyPlan.js";
import { plannerSetupHref, signInHref } from "../router.js";

// #/planner: the full Personal Study Planner for the current week.
export default function StudyPlannerPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const p = useStudyPlanner();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");

  if (authLoading || p.loading) {
    return (
      <section className="section sp-page"><div className="sp-page__inner"><p className="section__lede">{t("Loading…")}</p></div></section>
    );
  }
  if (!user) {
    return (
      <section className="section sp-page">
        <div className="sp-page__inner">
          <h1 className="sp-page__title">{t("Personal Study Planner")}</h1>
          <p className="section__lede"><a href={signInHref()}>{t("Sign in")}</a> {t("to see your study plan.")}</p>
        </div>
      </section>
    );
  }
  if (p.unavailable) {
    return (
      <section className="section sp-page"><div className="sp-page__inner">
        <h1 className="sp-page__title">{t("Personal Study Planner")}</h1>
        <p className="section__lede">{t("The study planner is being set up. Please check back soon.")}</p>
      </div></section>
    );
  }
  if (p.state !== "complete") {
    return (
      <section className="section sp-page">
        <div className="sp-page__inner">
          <h1 className="sp-page__title">{t("Personal Study Planner")}</h1>
          <p className="section__lede">
            {t("Tell us about your goals, available study time and upcoming exams. Scholar Compass will use this information to create a personalized weekly study plan.")}
          </p>
          <a className="btn btn--accent" href={plannerSetupHref()}>{p.state === "partial" ? t("Set up my study plan") : t("Create my study plan")}</a>
        </div>
      </section>
    );
  }

  const s = p.summary;
  const marks = milestones(profile, p.prefs, p.today);
  const weekPct = s.weekTotal ? Math.round((s.weekDone / s.weekTotal) * 100) : 0;

  async function update() {
    setBusy(true);
    const e = await p.regenerate();
    setBusy(false);
    setConfirm(false);
    setMessage(e ? e : t("Plan updated. Completed tasks were kept."));
  }

  return (
    <section className="section sp-page">
      <div className="sp-page__inner">
        <p className="sp__eyebrow">PERSONAL STUDY PLANNER</p>
        <h1 className="sp-page__title">{t("This week")}</h1>
        {message && <p className="cmp-confirm" role="status">{message}</p>}
        {p.error && <p className="friend-note friend-note--error" role="alert">{p.error}</p>}

        <div className="sp-page__layout">
          <div className="sp-page__days">
            {DAYS.map((d, i) => {
              const date = addDays(p.weekStart, i);
              const list = p.tasks.filter((x) => x.task_date === date);
              return (
                <section key={d.key} className={`sp-day ${date === p.today ? "sp-day--today" : ""}`} aria-label={d.label}>
                  <header className="sp-day__head">
                    <h2 className="sp-h">{d.label}{date === p.today ? ` (${t("today")})` : ""}</h2>
                    <span className="sp-day__sum">
                      {list.length ? `${formatMinutes(list.reduce((a, x) => a + x.minutes, 0))} · ${list.filter((x) => x.completed_at).length}/${list.length}` : t("Rest")}
                    </span>
                  </header>
                  {list.length > 0 && (
                    <ul className="sp-tasks">
                      {list.map((task) => <StudyTaskRow key={task.id} task={task} onToggle={p.toggleTask} />)}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>

          <aside className="sp-page__side">
            <div className="sp-block">
              <h3 className="sp-h">{t("Weekly progress")}</h3>
              <div className="sp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={weekPct} aria-label="Weekly progress">
                <div className="sp-bar__fill" style={{ width: `${weekPct}%` }} />
              </div>
              <p className="sp-block__line">
                {s.weekDone} {t("of")} {s.weekTotal} {t("tasks")} &middot; {formatMinutes(s.weekMinutesDone)} {t("of")} {formatMinutes(s.weekMinutes)}
              </p>
            </div>
            <div className="sp-block">
              <h3 className="sp-h">{t("Upcoming goals")}</h3>
              {marks.length ? (
                <ul className="sp-goals">
                  {marks.map((m) => (
                    <li key={m.exam}>
                      <span className="sp-goals__exam">{m.exam}</span>
                      <span className="sp-goals__text">{m.target ? `${t("Target")} ${m.target}` : t("No target set")}{m.current ? ` (${t("now")} ${m.current})` : ""}</span>
                      <span className="sp-goals__date">{m.date ? (m.daysLeft >= 0 ? `${m.daysLeft} ${t("days to exam")}` : t("Exam date passed")) : t("Exam not scheduled")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sp-block__line">{t("Add a target score or exam date to see your milestones.")}</p>
              )}
            </div>
            <div className="sp-actions">
              <a className="btn btn--accent" href={plannerSetupHref()}>{t("Edit my study preferences")}</a>
              {confirm ? (
                <div className="sp-confirm">
                  <p>{t("Unfinished tasks from today on will be replaced using your current preferences. Completed tasks and past days stay as they are.")}</p>
                  <div className="sp-confirm__row">
                    <button type="button" className="btn btn--accent btn--small" onClick={update} disabled={busy}>{busy ? t("Updating…") : t("Update plan")}</button>
                    <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirm(false)} disabled={busy}>{t("Cancel")}</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="btn btn--ghost" onClick={() => setConfirm(true)}>{t("Regenerate my plan")}</button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
