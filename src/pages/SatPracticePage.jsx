import { useState } from "react";
import { SAT_CATEGORIES, SAT_QUESTIONS, SAT_DIFFICULTIES } from "../data/satQuestions.js";
import { useSatProgress } from "../hooks/useSatProgress.js";

export default function SatPracticePage({ categoryId }) {
  const category = SAT_CATEGORIES.find((c) => c.id === categoryId);
  const allQuestions = SAT_QUESTIONS[categoryId] || [];
  const { progress, recordAnswer, masteredCount } = useSatProgress();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [skill, setSkill] = useState("all");

  // Questions without metadata (the original 80) only show under "All".
  const skills = [...new Set(allQuestions.map((x) => x.skill).filter(Boolean))].sort();
  const questions = allQuestions.filter(
    (x) =>
      (difficulty === "all" || x.difficulty === difficulty) &&
      (skill === "all" || x.skill === skill)
  );

  function changeFilter(setter, value) {
    setter(value);
    setIndex(0);
    setSelected(null);
    setChecked(false);
  }

  if (!category) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Practice set not found</h1>
          <p className="section__lede">
            <a href="#/category/sat">Back to SAT.</a>
          </p>
        </div>
      </section>
    );
  }

  const q = questions[index];
  const isCorrect = q ? selected === q.answer : false;

  function selectQuestion(i) {
    setIndex(i);
    setSelected(null);
    setChecked(false);
  }

  function handleCheck() {
    if (!selected || checked) return;
    setChecked(true);
    recordAnswer(q.id, categoryId, selected === q.answer);
  }

  function handleNext() {
    if (index < questions.length - 1) selectQuestion(index + 1);
  }

  return (
    <section className="section sat-workspace">
      <div className="section__inner">
        <a className="detail__back" href="#/category/sat">
          ← Back to SAT
        </a>

        <div className="sat-workspace__head">
          <h1 className="section__title">{category.label}</h1>
          <span className="sat-workspace__progress-label">
            {masteredCount(categoryId)}/{questions.length} mastered
          </span>
        </div>

        {skills.length > 0 ? (
          <div className="sat-filters">
            <label className="sat-filters__field">
              Difficulty
              <select value={difficulty} onChange={(e) => changeFilter(setDifficulty, e.target.value)}>
                <option value="all">All</option>
                {SAT_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d[0].toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="sat-filters__field">
              Skill
              <select value={skill} onChange={(e) => changeFilter(setSkill, e.target.value)}>
                <option value="all">All</option>
                {skills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {!q ? (
          <p className="section__lede">No questions match these filters.</p>
        ) : (
        <div className="sat-workspace__layout">
          <div className="sat-workspace__main">
            <div className="sat-question-card">
              <span className="sat-question-card__number">
                Question {index + 1} of {questions.length}
                {q.difficulty ? ` · ${q.difficulty[0].toUpperCase() + q.difficulty.slice(1)}` : ""}
                {q.skill ? ` · ${q.skill}` : ""}
              </span>
              <p className="sat-question-card__passage">{q.passage}</p>
              <p className="sat-question-card__prompt">{q.prompt}</p>

              <div className="sat-question-card__options">
                {q.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const showCorrect = checked && opt.id === q.answer;
                  const showWrong = checked && isSelected && opt.id !== q.answer;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`sat-option ${isSelected ? "sat-option--selected" : ""} ${
                        showCorrect ? "sat-option--correct" : ""
                      } ${showWrong ? "sat-option--wrong" : ""}`}
                      onClick={() => !checked && setSelected(opt.id)}
                      disabled={checked}
                    >
                      <span className="sat-option__id">{opt.id}</span>
                      <span className="sat-option__text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {checked ? (
                <div
                  className={`sat-question-card__feedback ${
                    isCorrect ? "sat-question-card__feedback--correct" : "sat-question-card__feedback--wrong"
                  }`}
                >
                  <p className="sat-question-card__verdict">
                    {isCorrect ? "Correct!" : `Not quite — the correct answer is ${q.answer}.`}
                  </p>
                  <p className="sat-question-card__explanation">{q.explanation}</p>
                  {index < questions.length - 1 ? (
                    <button type="button" className="btn btn--accent" onClick={handleNext}>
                      Next question
                    </button>
                  ) : (
                    <p className="sat-question-card__done">
                      That's the last question in this set —{" "}
                      <a href="#/category/sat">back to SAT overview</a>.
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn--accent"
                  disabled={!selected}
                  onClick={handleCheck}
                >
                  Check answer
                </button>
              )}
            </div>
          </div>

          <aside className="sat-workspace__sidebar" aria-label="Question list">
            <div className="sat-question-grid">
              {questions.map((item, i) => {
                const p = progress[item.id];
                const state = p?.correct ? "correct" : p?.attempts ? "attempted" : "unanswered";
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`sat-question-chip sat-question-chip--${state} ${
                      i === index ? "sat-question-chip--active" : ""
                    }`}
                    onClick={() => selectQuestion(i)}
                    aria-label={`Question ${i + 1}${p?.correct ? ", answered correctly" : ""}`}
                  >
                    {p?.correct ? "✓" : i + 1}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
        )}
      </div>
    </section>
  );
}
