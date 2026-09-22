import { useState } from "react";
import AnswerChoice from "./AnswerChoice.jsx";
import AnswerExplanation from "./AnswerExplanation.jsx";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Owns all interactive state for one question: which choice is
// selected, whether the answer has been checked, and reveals
// correct/incorrect styling + explanation only after "Check Answer".
//
// choices: [{ id, text }]
// correctId: id of the correct choice
// explanation: string shown after checking, OR a function
//   (isCorrect) => string if the wording should differ by outcome
export default function QuestionCard({ number, prompt, choices, correctId, explanation, onAnswered }) {
  const [selectedId, setSelectedId] = useState(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selectedId === correctId;

  function handleCheck() {
    if (!selectedId || checked) return;
    setChecked(true);
    onAnswered?.(isCorrect);
  }

  function handleRetry() {
    setSelectedId(null);
    setChecked(false);
  }

  function stateFor(choiceId) {
    if (!checked) return selectedId === choiceId ? "active" : "default";
    if (choiceId === correctId) return "correct";
    if (choiceId === selectedId) return "incorrect";
    return "default";
  }

  const explanationText =
    typeof explanation === "function" ? explanation(isCorrect) : explanation;

  return (
    <section className="lesson-question">
      {number && <span className="lesson-question__number">Question {number}</span>}
      <p className="lesson-question__prompt">{prompt}</p>

      <div className="lesson-question__choices">
        {choices.map((choice, i) => (
          <AnswerChoice
            key={choice.id}
            id={choice.id}
            label={LETTERS[i] || choice.id}
            text={choice.text}
            state={stateFor(choice.id)}
            disabled={checked}
            onClick={() => setSelectedId(choice.id)}
          />
        ))}
      </div>

      {checked ? (
        <>
          {explanationText && <AnswerExplanation isCorrect={isCorrect} text={explanationText} />}
          <button type="button" className="btn btn--ghost lesson-question__retry" onClick={handleRetry}>
            Try again
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn--accent"
          disabled={!selectedId}
          onClick={handleCheck}
        >
          Check answer
        </button>
      )}
    </section>
  );
}
