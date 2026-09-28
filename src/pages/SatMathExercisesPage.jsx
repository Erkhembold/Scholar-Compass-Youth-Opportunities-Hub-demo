import { useMemo, useState } from "react";
import MathText from "../components/MathText.jsx";
import {
  SAT_MATH_DOMAINS,
  SAT_MATH_DIFFICULTIES,
  SAT_MATH_QUESTIONS,
  isSatMathAnswerCorrect,
} from "../data/satMathQuestions.js";
import { satMathChallengeHref } from "../router.js";

const TOPIC_FILTERS = [{ id: "all", label: "All" }, ...SAT_MATH_DOMAINS.map((d) => ({ id: d.id, label: d.short }))];
const DIFFICULTY_FILTERS = [{ id: "all", label: "All levels" }, ...SAT_MATH_DIFFICULTIES];

function difficultyLabel(id) {
  return SAT_MATH_DIFFICULTIES.find((d) => d.id === id)?.label || id;
}

export default function SatMathExercisesPage() {
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  // responses[id] = { value: string, submitted: boolean }
  const [responses, setResponses] = useState({});

  const visible = useMemo(
    () =>
      SAT_MATH_QUESTIONS.filter(
        (q) => (topic === "all" || q.domain === topic) && (difficulty === "all" || q.difficulty === difficulty)
      ),
    [topic, difficulty]
  );

  const sections = SAT_MATH_DOMAINS.map((d) => ({
    domain: d,
    questions: visible.filter((q) => q.domain === d.id),
  })).filter((s) => s.questions.length > 0);

  const submittedCount = Object.values(responses).filter((r) => r.submitted).length;
  const correctCount = SAT_MATH_QUESTIONS.filter(
    (q) => responses[q.id]?.submitted && isSatMathAnswerCorrect(q, responses[q.id].value)
  ).length;

  function setValue(id, value) {
    setResponses((prev) => (prev[id]?.submitted ? prev : { ...prev, [id]: { value, submitted: false } }));
  }
  function submit(id) {
    setResponses((prev) => (prev[id]?.value ? { ...prev, [id]: { ...prev[id], submitted: true } } : prev));
  }
  function retry(id) {
    setResponses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <section className="section sat-math">
      <div className="section__inner">
        <a className="detail__back" href="#/category/sat">
          ← Back to SAT
        </a>
        <h1 className="section__title">SAT Math Exercises</h1>
        <p className="section__lede">
          {SAT_MATH_QUESTIONS.length} practice questions across the four SAT Math areas. Pick an answer, check it, and read
          the explanation. Want to race a friend instead?{" "}
          <a href={satMathChallengeHref()}>Try SAT Math 1v1</a>.
        </p>

        <div className="math-filters" role="group" aria-label="Filter questions">
          <p className="math-filters__label">Topic</p>
          <div className="filter-bar">
            {TOPIC_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-chip ${topic === f.id ? "filter-chip--active" : ""}`}
                aria-pressed={topic === f.id}
                onClick={() => setTopic(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="math-filters__label">Difficulty</p>
          <div className="filter-bar">
            {DIFFICULTY_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-chip ${difficulty === f.id ? "filter-chip--active" : ""}`}
                aria-pressed={difficulty === f.id}
                onClick={() => setDifficulty(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="math-summary" aria-live="polite">
          Showing {visible.length} of {SAT_MATH_QUESTIONS.length} questions
          {submittedCount > 0 && ` · You've checked ${submittedCount} (${correctCount} correct)`}
        </p>

        {sections.length === 0 && (
          <p className="section__lede">
            No questions match those filters.{" "}
            <button
              type="button"
              className="math-link-button"
              onClick={() => {
                setTopic("all");
                setDifficulty("all");
              }}
            >
              Show all questions
            </button>
          </p>
        )}

        {sections.map(({ domain, questions }) => (
          <div key={domain.id} className="math-section">
            <h2 className="math-section__title">
              {domain.label} <span className="math-section__count">{questions.length}</span>
            </h2>
            {questions.map((q) => (
              <MathQuestionCard
                key={q.id}
                question={q}
                response={responses[q.id]}
                onChange={(v) => setValue(q.id, v)}
                onSubmit={() => submit(q.id)}
                onRetry={() => retry(q.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function MathQuestionCard({ question: q, response, onChange, onSubmit, onRetry }) {
  const value = response?.value || "";
  const submitted = !!response?.submitted;
  const correct = submitted && isSatMathAnswerCorrect(q, value);

  return (
    <article className="sat-question-card math-q" aria-labelledby={`q-${q.id}`}>
      <header className="math-q__meta">
        <span className="math-q__number" id={`q-${q.id}`}>
          Question {q.id}
        </span>
        <span className={`math-badge math-badge--${q.difficulty}`}>Difficulty: {difficultyLabel(q.difficulty)}</span>
        <span className="math-q__topic">Topic: {q.topic}</span>
      </header>

      <div className="sat-question-card__prompt math-q__prompt">
        <MathText text={q.prompt} />
      </div>

      {q.type === "mc" ? (
        <div className="sat-question-card__options">
          {q.options.map((opt) => {
            let cls = "sat-option";
            if (submitted && opt.id === q.answer) cls += " sat-option--correct";
            else if (submitted && opt.id === value) cls += " sat-option--wrong";
            else if (!submitted && opt.id === value) cls += " sat-option--selected";
            return (
              <button
                key={opt.id}
                type="button"
                className={cls}
                disabled={submitted}
                aria-pressed={opt.id === value}
                onClick={() => onChange(opt.id)}
              >
                <span className="sat-option__id">{opt.id}</span>
                <span className="sat-option__text">
                  <MathText text={opt.text} />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="signin__field math-q__spr">
          <label htmlFor={`spr-${q.id}`}>Your answer (student-produced response)</label>
          <input
            id={`spr-${q.id}`}
            value={value}
            disabled={submitted}
            inputMode="decimal"
            onChange={(e) => onChange(e.target.value.trim())}
          />
        </div>
      )}

      {!submitted ? (
        <button type="button" className="btn btn--accent" disabled={!value} onClick={onSubmit}>
          Check answer
        </button>
      ) : (
        <div className={`sat-question-card__feedback ${correct ? "sat-question-card__feedback--correct" : "sat-question-card__feedback--wrong"}`}>
          <p className="sat-question-card__verdict">
            {correct ? "Correct!" : `Not quite. The correct answer is ${q.answer}.`}
          </p>
          <div className="sat-question-card__explanation">
            <MathText text={q.explanation} />
          </div>
          <button type="button" className="btn btn--ghost" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </article>
  );
}
