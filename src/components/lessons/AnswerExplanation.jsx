// Rendered only after "Check Answer" is clicked (the parent QuestionCard
// controls whether this mounts at all — kept simple rather than adding
// its own hidden/visible state).
export default function AnswerExplanation({ isCorrect, text }) {
  return (
    <div
      className={`lesson-explanation ${
        isCorrect ? "lesson-explanation--correct" : "lesson-explanation--incorrect"
      }`}
      role="status"
    >
      <span className="lesson-explanation__verdict">
        {isCorrect ? "Correct" : "Not quite"}
      </span>
      <p className="lesson-explanation__text">{text}</p>
    </div>
  );
}
