import { useMemo, useState } from "react";
import MathText from "../components/MathText.jsx";
import ExerciseShell, { XsOption, XsCheck } from "../components/exercise/ExerciseShell.jsx";
import { SAT_MATH_DOMAINS, SAT_MATH_DIFFICULTIES, SAT_MATH_QUESTIONS, isSatMathAnswerCorrect } from "../data/satMathQuestions.js";
import { satMathChallengeHref } from "../router.js";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { saveSatMathAttempt } from "../utils/satMathExerciseHistory.js";

function difficultyLabel(id) {
  return SAT_MATH_DIFFICULTIES.find((d) => d.id === id)?.label || id;
}

export default function SatMathExercisesPage({ initialDomain }) {
  const { user } = useAuth();
  const validInitialDomain = SAT_MATH_DOMAINS.some((d) => d.id === initialDomain) ? initialDomain : "all";
  const [topic, setTopic] = useState(validInitialDomain);
  const [difficulty, setDifficulty] = useState("all");
  const [index, setIndex] = useState(0);
  // responses[id] = { value: string, submitted: boolean }
  const [responses, setResponses] = useState({});

  const visible = useMemo(
    () =>
      SAT_MATH_QUESTIONS.filter(
        (q) => (topic === "all" || q.domain === topic) && (difficulty === "all" || q.difficulty === difficulty),
      ),
    [topic, difficulty],
  );

  const filters = (
    <div className="xs-filters">
      <label className="xs-filters__field">
        Topic
        <select value={topic} onChange={(e) => { setTopic(e.target.value); setIndex(0); }}>
          <option value="all">All</option>
          {SAT_MATH_DOMAINS.map((d) => (
            <option key={d.id} value={d.id}>{d.short}</option>
          ))}
        </select>
      </label>
      <label className="xs-filters__field">
        Difficulty
        <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setIndex(0); }}>
          <option value="all">All levels</option>
          {SAT_MATH_DIFFICULTIES.map((d) => (
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </select>
      </label>
    </div>
  );

  if (visible.length === 0) {
    return (
      <section className="section">
        <div className="section__inner">
          <a className="detail__back" href="#/category/sat">&larr; Back to SAT</a>
          <h1 className="section__title">SAT Math Exercises</h1>
          {filters}
          <p className="section__lede">No questions match those filters.</p>
        </div>
      </section>
    );
  }

  const safeIndex = Math.min(index, visible.length - 1);
  const q = visible[safeIndex];
  const response = responses[q.id];
  const value = response?.value || "";
  const submitted = !!response?.submitted;
  const correct = submitted && isSatMathAnswerCorrect(q, value);

  const statuses = visible.map((item) => {
    const r = responses[item.id];
    if (r?.submitted) return isSatMathAnswerCorrect(item, r.value) ? "correct" : "incorrect";
    if (r?.value) return "answered";
    return "unanswered";
  });

  function setValue(v) {
    setResponses((prev) => (prev[q.id]?.submitted ? prev : { ...prev, [q.id]: { value: v, submitted: false } }));
  }
  function submit() {
    if (!value) return;
    setResponses((prev) => ({ ...prev, [q.id]: { ...prev[q.id], submitted: true } }));
    saveSatMathAttempt(supabase, user?.id, q, value, isSatMathAnswerCorrect(q, value));
  }
  function retry() {
    setResponses((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });
  }

  return (
    <ExerciseShell
      title="SAT Math"
      exitHref="#/category/sat"
      exitLabel="SAT"
      directions={
        <>
          <p>Work out the problem on the left, then choose or enter your answer on the right. Use Notes as a scratchpad. Press Check answer to see the explanation.</p>
          <p>Want to race a friend instead? <a href={satMathChallengeHref()}>Try SAT Math 1v1</a>.</p>
        </>
      }
      filters={filters}
      questionIds={visible.map((x) => x.id)}
      statuses={statuses}
      index={safeIndex}
      onIndexChange={setIndex}
      passageNode={
        <div className="xs-stimulus">
          <p className="xs-meta">
            {q.topic} - {difficultyLabel(q.difficulty)}
          </p>
          <MathText text={q.prompt} />
        </div>
      }
    >
      {q.type === "mc" ? (
        <div className="xs-options" role="radiogroup" aria-label="Answer choices">
          {q.options.map((opt) => (
            <XsOption
              key={opt.id}
              letter={opt.id}
              selected={opt.id === value}
              correct={submitted && opt.id === q.answer}
              wrong={submitted && opt.id === value && opt.id !== q.answer}
              disabled={submitted}
              onClick={() => setValue(opt.id)}
            >
              <MathText text={opt.text} />
            </XsOption>
          ))}
        </div>
      ) : (
        <div className="xs-spr">
          <label htmlFor={`spr-${q.id}`}>Your answer (student-produced response)</label>
          <input
            id={`spr-${q.id}`}
            className="xs-input"
            value={value}
            disabled={submitted}
            inputMode="decimal"
            onChange={(e) => setValue(e.target.value.trim())}
          />
        </div>
      )}
      <XsCheck
        checked={submitted}
        canCheck={!!value}
        onCheck={submit}
        correct={correct}
        verdict={correct ? "Correct" : `Not quite. The correct answer is ${q.answer}.`}
      >
        <div className="xs-feedback__text">
          <MathText text={q.explanation} />
        </div>
        <button type="button" className="xs-btn xs-btn--ghost" onClick={retry}>
          Try again
        </button>
      </XsCheck>
    </ExerciseShell>
  );
}
