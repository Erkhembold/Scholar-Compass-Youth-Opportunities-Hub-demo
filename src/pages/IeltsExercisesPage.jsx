import { useMemo, useState } from "react";
import { IELTS_READING_EXERCISES } from "../data/ieltsReadingExercises.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const SKILL_META = {
  reading: { label: "Reading", ready: true },
  listening: { label: "Listening", ready: false },
  speaking: { label: "Speaking", ready: false },
  writing: { label: "Writing", ready: false },
};

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

export default function IeltsExercisesPage({ skill }) {
  const { t } = useLanguage();
  const meta = SKILL_META[skill];

  if (!meta) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Exercises not found</h1>
          <p className="section__lede">
            <a href="#/category/ielts">Back to IELTS.</a>
          </p>
        </div>
      </section>
    );
  }

  if (!meta.ready) {
    return (
      <section className="section board">
        <div className="section__inner">
          <a className="detail__back" href="#/category/ielts">
            ← {t("Back")} to IELTS
          </a>
          <div className="section__head">
            <h1 className="section__title">IELTS {t(meta.label)} Exercises</h1>
            <p className="section__lede">
              {t(meta.label)} exercises aren't available yet — it's next on the list. In the
              meantime, <a href="#/ielts/exercises/reading">try the Reading exercises</a>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return <ReadingExerciseRunner />;
}

function ReadingExerciseRunner() {
  const { t } = useLanguage();
  const exercises = IELTS_READING_EXERCISES;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // mc/matching: string; tfng: array; completion: string
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const exercise = exercises[index];

  const isCorrect = useMemo(() => {
    if (!checked) return null;
    return computeCorrect(exercise, selected);
  }, [checked, exercise, selected]);

  function resetForExercise() {
    setSelected(exercise.type === "tfng" ? Array(exercise.statements.length).fill(null) : null);
    setChecked(false);
  }

  function goTo(newIndex) {
    const clamped = Math.max(0, Math.min(exercises.length - 1, newIndex));
    setIndex(clamped);
    setSelected(
      exercises[clamped].type === "tfng"
        ? Array(exercises[clamped].statements.length).fill(null)
        : null
    );
    setChecked(false);
  }

  function handleCheck() {
    if (checked) return;
    setChecked(true);
    setAnsweredCount((c) => c + 1);
    if (computeCorrect(exercise, selected)) setCorrectCount((c) => c + 1);
  }

  return (
    <section className="section board">
      <div className="section__inner">
        <a className="detail__back" href="#/category/ielts">
          ← {t("Back")} to IELTS
        </a>

        <div className="section__head">
          <h1 className="section__title">IELTS Reading Exercises</h1>
          <p className="section__lede">
            Short, targeted practice — one passage and a quick question at a time. Not a timed
            mock test.
          </p>
        </div>

        <div className="exercise-runner">
          <div className="exercise-runner__meta">
            <span>
              Exercise {index + 1} of {exercises.length}
            </span>
            <span className={`exercise-runner__difficulty exercise-runner__difficulty--${exercise.difficulty}`}>
              {DIFFICULTY_LABEL[exercise.difficulty]}
            </span>
            {answeredCount > 0 && (
              <span className="exercise-runner__score">
                Score: {correctCount}/{answeredCount}
              </span>
            )}
          </div>

          <div className="exercise-runner__passage">{exercise.passage}</div>

          <ExerciseQuestion
            exercise={exercise}
            selected={selected}
            setSelected={setSelected}
            checked={checked}
          />

          {checked && (
            <div
              className={`exercise-runner__feedback ${
                isCorrect ? "exercise-runner__feedback--correct" : "exercise-runner__feedback--incorrect"
              }`}
            >
              <strong>{isCorrect ? "Correct" : "Not quite"}</strong>
              {exercise.explanation && <p>{exercise.explanation}</p>}
              {!exercise.explanation && exercise.answer && (
                <p>Correct answer: {formatAnswer(exercise)}</p>
              )}
            </div>
          )}

          <div className="exercise-runner__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
            >
              Previous
            </button>
            {!checked ? (
              <button
                type="button"
                className="btn btn--accent"
                onClick={handleCheck}
                disabled={!isAnswered(exercise, selected)}
              >
                Check answer
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--accent"
                onClick={() => goTo(index + 1)}
                disabled={index === exercises.length - 1}
              >
                Next exercise
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExerciseQuestion({ exercise, selected, setSelected, checked }) {
  if (exercise.type === "mc") {
    return (
      <div className="exercise-runner__question">
        <p className="exercise-runner__prompt">{exercise.question}</p>
        <div className="exercise-runner__options">
          {exercise.options.map((opt) => (
            <label
              key={opt.id}
              className={`exercise-runner__option ${selected === opt.id ? "is-selected" : ""} ${
                checked && opt.id === exercise.answer ? "is-correct-answer" : ""
              } ${checked && selected === opt.id && opt.id !== exercise.answer ? "is-wrong-answer" : ""}`}
            >
              <input
                type="radio"
                name="mc-answer"
                checked={selected === opt.id}
                disabled={checked}
                onChange={() => setSelected(opt.id)}
              />
              <span>
                {opt.id}. {opt.text}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (exercise.type === "tfng") {
    return (
      <div className="exercise-runner__question">
        {exercise.statements.map((st, i) => (
          <div key={i} className="exercise-runner__tfng-row">
            <p className="exercise-runner__prompt">
              {i + 1}. {st.text}
            </p>
            <div className="exercise-runner__options exercise-runner__options--inline">
              {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                <label
                  key={val}
                  className={`exercise-runner__option ${selected?.[i] === val ? "is-selected" : ""} ${
                    checked && val === st.answer ? "is-correct-answer" : ""
                  } ${checked && selected?.[i] === val && val !== st.answer ? "is-wrong-answer" : ""}`}
                >
                  <input
                    type="radio"
                    name={`tfng-${i}`}
                    checked={selected?.[i] === val}
                    disabled={checked}
                    onChange={() => {
                      const next = [...selected];
                      next[i] = val;
                      setSelected(next);
                    }}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (exercise.type === "matching") {
    return (
      <div className="exercise-runner__question">
        <p className="exercise-runner__prompt">Choose the correct heading for this paragraph.</p>
        <div className="exercise-runner__options">
          {exercise.headings.map((h) => (
            <label
              key={h.id}
              className={`exercise-runner__option ${selected === h.id ? "is-selected" : ""} ${
                checked && h.id === exercise.answer ? "is-correct-answer" : ""
              } ${checked && selected === h.id && h.id !== exercise.answer ? "is-wrong-answer" : ""}`}
            >
              <input
                type="radio"
                name="matching-answer"
                checked={selected === h.id}
                disabled={checked}
                onChange={() => setSelected(h.id)}
              />
              <span>
                {h.id}. {h.text}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // completion
  return (
    <div className="exercise-runner__question">
      <p className="exercise-runner__prompt">{exercise.prompt}</p>
      <input
        type="text"
        className="exercise-runner__text-input"
        value={selected || ""}
        disabled={checked}
        onChange={(e) => setSelected(e.target.value)}
        placeholder="Type your answer"
      />
    </div>
  );
}

function isAnswered(exercise, selected) {
  if (exercise.type === "tfng") return selected && selected.every((v) => v);
  if (exercise.type === "completion") return !!(selected && selected.trim());
  return !!selected;
}

function computeCorrect(exercise, selected) {
  if (exercise.type === "tfng") {
    return exercise.statements.every((st, i) => selected?.[i] === st.answer);
  }
  if (exercise.type === "completion") {
    return (selected || "").trim().toLowerCase() === String(exercise.answer).trim().toLowerCase();
  }
  return selected === exercise.answer;
}

function formatAnswer(exercise) {
  if (exercise.type === "tfng") {
    return exercise.statements.map((s) => s.answer).join(", ");
  }
  return exercise.answer;
}
