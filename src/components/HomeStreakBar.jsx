import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useStreak } from "../hooks/useStreak.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { profileStatsHref } from "../router.js";

const SUB_COPY = {
  done_today: "Nice — you're set for today.",
  at_risk: "Keep it alive — do today's lesson.",
  broken: "Start a new one today.",
  none: "Complete a lesson or exercise to start one.",
};

// Counts up to `value` on mount (or whenever it changes), easing out. Skips
// straight to the final number for anyone who has asked the OS for reduced
// motion — the count-up is decorative, not information.
function useCountUp(value, durationMs = 900) {
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (prefersReducedMotion.current || value === 0) {
      setDisplay(value);
      return;
    }
    let raf;
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return display;
}

export default function HomeStreakBar() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { current, state, week, isSetUp } = useStreak();
  const display = useCountUp(current);
  const isAlive = state === "done_today" || state === "at_risk";

  if (!user || !isSetUp) return null;

  return (
    <section className="home-streak" data-state={state} aria-label={t("Daily streak")}>
      <a
        className="home-streak__inner home-streak__link"
        href={profileStatsHref()}
        aria-label={t("View your streak milestones and level progress")}
      >
        <div className="home-streak__headline-group">
          <span
            className={`home-streak__flame ${isAlive ? "home-streak__flame--lit" : ""}`}
            aria-hidden="true"
          >
            🔥
          </span>
          <div className="home-streak__count-block">
            {isAlive && (
              <span className="home-streak__count" key={current}>
                {display}
              </span>
            )}
            <div className="home-streak__headline-text">
              <p className="home-streak__headline">
                {isAlive ? (
                  <>
                    {current} {t("day streak")}
                  </>
                ) : (
                  t(state === "broken" ? "Streak ended" : "Start your streak")
                )}
              </p>
              <p className="home-streak__sub">{t(SUB_COPY[state])}</p>
            </div>
          </div>
        </div>

        <ul className="home-streak__week" aria-label={t("This week")}>
          {week.map((d) => (
            <li
              key={d.date}
              className={`home-streak__day ${d.active ? "is-active" : ""} ${
                d.isToday ? "is-today" : ""
              }`}
              aria-label={`${d.label}: ${d.active ? "activity completed" : d.isFuture ? "upcoming" : "no activity"}`}
            >
              <span className="home-streak__day-label">{d.label[0]}</span>
              <span className="home-streak__day-dot" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </a>
    </section>
  );
}
