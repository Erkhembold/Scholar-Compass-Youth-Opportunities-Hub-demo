// Presentational only — the parent QuestionCard owns selection/checked
// state and passes down which visual state this choice is in.
// state: "default" | "active" | "correct" | "incorrect"
export default function AnswerChoice({ id, label, text, state = "default", onClick, disabled }) {
  return (
    <button
      type="button"
      className={`lesson-choice lesson-choice--${state}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "active"}
    >
      <span className="lesson-choice__id">{label}</span>
      <span className="lesson-choice__text">{text}</span>
      {state === "correct" && (
        <span className="lesson-choice__icon" aria-hidden="true">
          ✓
        </span>
      )}
      {state === "incorrect" && (
        <span className="lesson-choice__icon" aria-hidden="true">
          ✕
        </span>
      )}
    </button>
  );
}
