import { useProgressData } from "../hooks/useProgressData.js";
import { satMathExercisesHref } from "../router.js";

const STEP_LINKS = {
  "sat-set-target": "#/profile",
  "ielts-set-target": "#/profile",
  "sat-first-practice": "#/category/sat",
  "ielts-first-practice": "#/ielts/exercises/reading",
  "ielts-diagnostic": "#/ielts",
  "sat-more-data": "#/category/sat",
  "ielts-more-data": "#/ielts/exercises/reading",
  "sat-practice-math-weak": satMathExercisesHref(),
  "sat-practice-rw-weak": "#/category/sat",
  "ielts-practice-weak": "#/ielts/exercises/reading",
};

const STATUS_ICON = { done: "✓", current: "→", upcoming: "" };

function StepRow({ step }) {
  const href = step.status !== "done" ? STEP_LINKS[step.id] : null;
  const content = (
    <>
      <span className={`roadmap-step__icon roadmap-step__icon--${step.status}`} aria-hidden="true">
        {STATUS_ICON[step.status]}
      </span>
      <span className="roadmap-step__title">{step.title}</span>
    </>
  );
  if (href) {
    return (
      <a className={`roadmap-step roadmap-step--${step.status}`} href={href}>
        {content}
      </a>
    );
  }
  return <div className={`roadmap-step roadmap-step--${step.status}`}>{content}</div>;
}

function SubjectRoadmap({ label, roadmap }) {
  if (!roadmap || roadmap.steps.length === 0) return null;
  return (
    <div className="roadmap-subject">
      <h3 className="roadmap-subject__name">{label}</h3>
      <div className="roadmap-steps">
        {roadmap.steps.map((s) => (
          <StepRow key={s.id} step={s} />
        ))}
      </div>
    </div>
  );
}

export default function RoadmapCard() {
  const { roadmap, loading, isSetUp } = useProgressData();

  if (loading) {
    return (
      <div className="roadmap-card">
        <p className="signin__lede">Loading…</p>
      </div>
    );
  }
  if (!isSetUp || !roadmap) {
    return (
      <div className="roadmap-card">
        <p className="streak-card__note">Your roadmap isn't switched on yet.</p>
      </div>
    );
  }

  return (
    <div className="roadmap-card">
      <h2 className="progress-tracker__heading">Your roadmap</h2>
      <p className="roadmap-card__lede">What to do next, based on your real goals and practice so far.</p>
      <SubjectRoadmap label="SAT" roadmap={roadmap.sat} />
      <SubjectRoadmap label="IELTS" roadmap={roadmap.ielts} />
    </div>
  );
}
