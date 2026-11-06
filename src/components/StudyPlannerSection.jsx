import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useStudyPlanner } from "../hooks/useStudyPlanner.js";
import StudyTaskRow from "./StudyTaskRow.jsx";
import { DAYS, addDays, milestones } from "../utils/studyPlan.js";
import { plannerHref, plannerSetupHref } from "../router.js";

export function formatMinutes(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

function Invitation({ partial, onDismiss }) {
  const { t } = useLanguage();
  return (
    <div className="sp-invite">
      <h3 className="sp-invite__title">{t("Let's build your study plan.")}</h3>
      <p className="sp-invite__text">
        {t(
          "Tell us about your goals, available study time and upcoming exams. Scholar Compass will use this information to create a personalized weekly study plan."
        )}
      </p>
      {partial && (
        <p className="sp-invite__text sp-invite__text--note">
          {t("We already have some of your answers. They are filled in for you to review.")}
        </p>
      )}
      <div className="sp-invite__actions">
        <a className="btn btn--accent" href={plannerSetupHref()}>
          {partial ? t("Set up my study plan") : t("Create my study plan")}
        </a>
        <button type="button" className="btn btn--ghost" onClick={onDismiss}>
          {t("Not now")}
        </button>
      </div>
    </div>
  );
}

function WeekStrip({ tasks, weekStart, today }) {
  return (
    <ol className="sp-week" aria-label="This week">
      {DAYS.map((d, i) => {
        const date = addDays(weekStart, i);
        const day = tasks.filter((t) => t.task_date === date);
        const done = day.filter((t) => t.completed_at).length;
        const cls = [
          "sp-week__day",
          date === today ? "sp-week__day--today" : "",
          day.length && done === day.length ? "sp-week__day--done" : "",
        ].join(" ");
        return (
          <li key={d.key} className={cls}>
            <span className="sp-week__name">{d.short}</span>
            <span className="sp-week__count">{day.length ? `${done}/${day.length}` : "Rest"}</span>
          </li>
        );
      })}
    </ol>
  );
}

// Homepage section: the signed-in student's own plan for today, this week's
// progress and exam milestones; or an invitation to set the plan up.
export default function StudyPlannerSection() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const p = useStudyPlanner();
  const [busy, setBusy] = useState(false);
  const firstName = (profile?.name || "").trim().split(/\s+/)[0];

  let body;
  if (p.loading) {
    body = <p className="sp__note">{t("Loading your plan…")}</p>;
  } else if (p.unavailable) {
    body = <p className="sp__note">{t("The study planner is being set up. Please check back soon.")}</p>;
  } else if (p.state !== "complete") {
    body = p.inviteHidden ? (
      <div className="sp-compact">
        <p>{t("Your study plan is not set up yet.")}</p>
        <a className="btn btn--accent btn--small" href={plannerSetupHref()}>
          {t("Set up my study plan")}
        </a>
      </div>
    ) : (
      <Invitation partial={p.state === "partial"} onDismiss={p.dismissInvite} />
    );
  } else {
    const s = p.summary;
    const weekPct = s.weekTotal ? Math.round((s.weekDone / s.weekTotal) * 100) : 0;
    const hasTime = Object.values(p.prefs?.availability || {}).some((m) => Number(m) > 0);
    const marks = milestones(profile, p.prefs, p.today);
    const generate = async () => {
      setBusy(true);
      await p.regenerate();
      setBusy(false);
    };

    let today;
    if (s.today.length) {
      today = (
        <ul className="sp-tasks">
          {s.today.map((task) => (
            <StudyTaskRow key={task.id} task={task} onToggle={p.toggleTask} />
          ))}
        </ul>
      );
    } else if (s.weekTotal === 0) {
      today = (
        <div className="sp-empty">
          <p>{hasTime ? t("There is no plan for this week yet.") : t("Add the time you can study each day to get a weekly plan.")}</p>
          {hasTime ? (
            <button type="button" className="btn btn--accent btn--small" onClick={generate} disabled={busy}>
              {busy ? t("Building…") : t("Generate my weekly plan")}
            </button>
          ) : (
            <a className="btn btn--accent btn--small" href={plannerSetupHref()}>
              {t("Edit my study preferences")}
            </a>
          )}
        </div>
      );
    } else {
      today = (
        <div className="sp-empty">
          <p>{t("Nothing is scheduled for today. Enjoy the break, or adjust your plan.")}</p>
          <a className="btn btn--ghost btn--small" href={plannerHref()}>
            {t("Adjust my weekly plan")}
          </a>
        </div>
      );
    }

    body = (
      <div className="sp-grid">
        <div className="sp-today">
          <div className="sp-today__head">
            <h3 className="sp-h">{t("Today's plan")}</h3>
            {s.today.length > 0 && (
              <span className="sp-today__sum">
                {formatMinutes(s.todayMinutes)} &middot; {s.todayDone} {t("of")} {s.today.length} {t("done")}
              </span>
            )}
          </div>
          {today}
        </div>

        <div className="sp-side">
          <div className="sp-block">
            <h3 className="sp-h">{t("This week")}</h3>
            <div className="sp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={weekPct} aria-label="Weekly progress">
              <div className="sp-bar__fill" style={{ width: `${weekPct}%` }} />
            </div>
            <p className="sp-block__line">
              {s.weekDone} {t("of")} {s.weekTotal} {t("tasks")}
              {s.weekTotal > 0 && ` · ${formatMinutes(s.weekMinutesDone)} ${t("of")} ${formatMinutes(s.weekMinutes)}`}
            </p>
            <WeekStrip tasks={p.tasks} weekStart={p.weekStart} today={p.today} />
          </div>

          <div className="sp-block">
            <h3 className="sp-h">{t("Upcoming goals")}</h3>
            {marks.length ? (
              <ul className="sp-goals">
                {marks.map((m) => (
                  <li key={m.exam}>
                    <span className="sp-goals__exam">{m.exam}</span>
                    <span className="sp-goals__text">
                      {m.target ? `${t("Target")} ${m.target}` : t("No target set")}
                      {m.current ? ` (${t("now")} ${m.current})` : ""}
                    </span>
                    <span className="sp-goals__date">
                      {m.date
                        ? m.daysLeft >= 0
                          ? `${m.daysLeft} ${t("days to exam")}`
                          : t("Exam date passed")
                        : t("Exam not scheduled")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sp-block__line">{t("Add a target score or exam date to see your milestones.")}</p>
            )}
          </div>

          <div className="sp-actions">
            <a className="btn btn--accent" href={plannerHref()}>
              {t("Open my study planner")}
            </a>
            <a className="btn btn--ghost" href={plannerSetupHref()}>
              {t("Edit my study preferences")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="section sp" aria-labelledby="sp-heading">
      <div className="section__inner">
        <p className="sp__eyebrow" id="sp-heading">PERSONAL STUDY PLANNER</p>
        {p.state === "complete" && !p.loading && !p.unavailable && (
          <h2 className="sp__title">
            {firstName ? `${t("Hello")} ${firstName}, ${t("here is your plan.")}` : t("Here is your plan.")}
          </h2>
        )}
        {p.error && (
          <p className="friend-note friend-note--error" role="alert">
            {p.error}
          </p>
        )}
        {body}
      </div>
    </section>
  );
}
