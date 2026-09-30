import { useProgressData } from "../hooks/useProgressData.js";
import { satMathExercisesHref } from "../router.js";
import { MIN_SAMPLE } from "../utils/progress.js";

const PRACTICE_LINKS = {
  sat_rw: { label: "Practice SAT Reading & Writing", href: "#/category/sat" },
  sat_math: { label: "Practice SAT Math", href: satMathExercisesHref() },
  ielts_reading: { label: "Practice IELTS Reading", href: "#/ielts/exercises/reading" },
};

const SUBJECT_LABEL = {
  sat_rw: "SAT Reading & Writing",
  sat_math: "SAT Math",
  ielts_reading: "IELTS Reading",
};

function Row({ diagnosis }) {
  const label = SUBJECT_LABEL[diagnosis.subject];
  const link = PRACTICE_LINKS[diagnosis.subject];

  if (!diagnosis.weakest) {
    return (
      <div className="weak-area-row weak-area-row--empty">
        <span className="weak-area-row__subject">{label}</span>
        <span className="weak-area-row__note">
          {diagnosis.reason === "no_data"
            ? "No practice yet."
            : `Not enough data yet — practice a few more questions to see your weak areas (need ${MIN_SAMPLE} per topic).`}
        </span>
      </div>
    );
  }

  const { weakest } = diagnosis;
  const percent = Math.round(weakest.rate * 100);
  const rateText = `${percent}% ${weakest.metric === "mastery" ? "mastered" : "accuracy"}`;

  return (
    <div className="weak-area-row">
      <div className="weak-area-row__main">
        <span className="weak-area-row__subject">{label}</span>
        <span className="weak-area-row__tag">{weakest.label}</span>
        <div className="weak-area-row__bar" role="img" aria-label={rateText}>
          <div className="weak-area-row__bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="weak-area-row__stat">
          {rateText} · {weakest.sample} question{weakest.sample === 1 ? "" : "s"} attempted
        </span>
      </div>
      {link && (
        <a className="btn btn--ghost weak-area-row__cta" href={link.href}>
          Practice this
        </a>
      )}
    </div>
  );
}

export default function WeakAreaCard() {
  const { weakAreas, loading, isSetUp } = useProgressData();

  if (loading) {
    return (
      <div className="weak-area-card">
        <p className="signin__lede">Loading…</p>
      </div>
    );
  }
  if (!isSetUp || !weakAreas) {
    return (
      <div className="weak-area-card">
        <p className="streak-card__note">Weak-area diagnosis isn't switched on yet.</p>
      </div>
    );
  }

  return (
    <div className="weak-area-card">
      <h2 className="progress-tracker__heading">Your weakest areas</h2>
      <p className="weak-area-card__lede">
        Based on your real answer history. We only flag a weak area once you've attempted at least {MIN_SAMPLE}{" "}
        questions in it.
      </p>
      <Row diagnosis={weakAreas.satRW} />
      <Row diagnosis={weakAreas.satMath} />
      <Row diagnosis={weakAreas.ieltsReading} />
    </div>
  );
}
