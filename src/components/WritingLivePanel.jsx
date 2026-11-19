import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { bandTier } from "../utils/bandColor.js";

const ORDER = ["taskResponse", "coherenceCohesion", "lexicalResource", "grammar"];
const NAMES = {
  task1: { taskResponse: "Task Achievement" },
  task2: { taskResponse: "Task Response" },
};
const COMMON = {
  coherenceCohesion: "Coherence and Cohesion",
  lexicalResource: "Lexical Resource",
  grammar: "Grammatical Range and Accuracy",
};

// Steps shown while the AI works. They advance on a timer, but the last one
// ("final score") only completes when the real result arrives.
const STEPS = [
  { key: "read", label: "Reading your essay", at: 0 },
  { key: "taskResponse", label: "Checking the task", at: 4 },
  { key: "coherenceCohesion", label: "Checking organisation", at: 10 },
  { key: "lexicalResource", label: "Checking vocabulary", at: 16 },
  { key: "grammar", label: "Checking grammar", at: 22 },
  { key: "feedback", label: "Writing your feedback", at: 28 },
];

// Right-hand panel next to the essay: idle -> live progress -> final score.
export default function WritingLivePanel({ status, result, taskType, error }) {
  const { t } = useLanguage();
  const [sec, setSec] = useState(0);
  const [shown, setShown] = useState(0);
  const labels = { ...COMMON, ...(NAMES[taskType] || NAMES.task2) };

  useEffect(() => {
    if (status !== "working") return undefined;
    setSec(0);
    const iv = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [status]);

  // After the result arrives, reveal the four criteria one by one, then the total.
  useEffect(() => {
    if (status !== "done") {
      setShown(0);
      return undefined;
    }
    setShown(0);
    const iv = setInterval(() => setShown((n) => (n >= 5 ? n : n + 1)), 550);
    return () => clearInterval(iv);
  }, [status]);

  const activeIdx = STEPS.reduce((acc, s, i) => (sec >= s.at ? i : acc), 0);

  return (
    <aside className="wr-live" aria-live="polite" aria-label={t("AI assessment")}>
      <h2 className="wr-live__title">{t("AI assessment")}</h2>

      {status === "idle" && (
        <>
          <p className="wr-live__hint">{t("Write your essay on the left, then press Submit. The AI will check it here, step by step.")}</p>
          <ul className="wr-live__list">
            {ORDER.map((k) => (
              <li key={k} className="wr-live__row wr-live__row--idle">
                <span className="wr-live__dot" />
                <span>{t(labels[k])}</span>
                <span className="wr-live__val">–</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {status === "working" && (
        <>
          <ul className="wr-live__list">
            {STEPS.map((s, i) => {
              const state = i < activeIdx ? "done" : i === activeIdx ? "active" : "wait";
              return (
                <li key={s.key} className={`wr-live__row wr-live__row--${state}`}>
                  <span className="wr-live__dot" />
                  <span>{t(s.label)}</span>
                  <span className="wr-live__val">{state === "done" ? "✓" : state === "active" ? "…" : ""}</span>
                </li>
              );
            })}
            <li className="wr-live__row wr-live__row--wait">
              <span className="wr-live__dot" />
              <span>{t("Final score")}</span>
              <span className="wr-live__val" />
            </li>
          </ul>
          <p className="wr-live__hint">{t("This usually takes 20–60 seconds. Please keep this page open.")}</p>
        </>
      )}

      {status === "done" && result && (
        <>
          <ul className="wr-live__list">
            {ORDER.map((k, i) => (
              <li key={k} className={`wr-live__row ${shown > i ? "wr-live__row--shown" : "wr-live__row--wait"}`}>
                <span className="wr-live__dot" />
                <span>{t(labels[k])}</span>
                <span className={`wr-live__val wr-tier--${shown > i ? bandTier(result.criteria[k].band) : "none"}`}>
                  {shown > i ? result.criteria[k].band.toFixed(1) : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className={`wr-live__final ${shown >= 5 ? "wr-live__final--in" : ""}`}>
            <p className="wr-live__final-label">{t("Final score")}</p>
            <p className={`wr-live__final-band wr-tier--${bandTier(result.overallBand)}`}>{result.overallBand.toFixed(1)}</p>
            <p className="wr-live__final-note">{t("AI estimate — not an official IELTS result")}</p>
          </div>
        </>
      )}

      {status === "error" && (
        <p className="wr-error" role="alert">
          {error?.message}
          {error?.detail ? <small style={{ display: "block", opacity: 0.8 }}>{error.detail}</small> : null}
        </p>
      )}
    </aside>
  );
}
