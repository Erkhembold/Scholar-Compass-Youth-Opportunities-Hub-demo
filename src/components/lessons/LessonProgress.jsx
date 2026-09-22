// steps: [{ id, label, status }] where status is "done" | "current" | "upcoming"
//
// Rendered twice by LessonLayout — once as the full step list for the
// desktop sticky sidebar, once with compact=true for the mobile top bar.
// Kept as one component (rather than two) so the step data only has to
// be computed once by the page and both views always agree.
export default function LessonProgress({ steps = [], compact = false }) {
  const total = steps.length;
  const doneCount = steps.filter((s) => s.status === "done").length;
  const currentIndex = steps.findIndex((s) => s.status === "current");
  const percent = total ? Math.round(((doneCount + (currentIndex >= 0 ? 0.5 : 0)) / total) * 100) : 0;

  if (compact) {
    return (
      <div className="lesson-progress lesson-progress--compact">
        <div className="lesson-progress__bar">
          <div className="lesson-progress__bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="lesson-progress__compact-label">
          Step {Math.max(1, currentIndex + 1)} of {total}
        </span>
      </div>
    );
  }

  return (
    <nav className="lesson-progress" aria-label="Lesson progress">
      <span className="lesson-progress__heading">In this lesson</span>
      <ol className="lesson-progress__steps">
        {steps.map((step) => (
          <li key={step.id} className={`lesson-progress__step lesson-progress__step--${step.status}`}>
            <span className="lesson-progress__step-marker" aria-hidden="true">
              {step.status === "done" ? "✓" : ""}
            </span>
            <span className="lesson-progress__step-label">{step.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
