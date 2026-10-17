import { useState } from "react";
import { SAT_CATEGORIES, SAT_QUESTIONS, SAT_DIFFICULTIES } from "../data/satQuestions.js";
import { useSatProgress } from "../hooks/useSatProgress.js";
import ExerciseShell, { XsOption, XsCheck } from "../components/exercise/ExerciseShell.jsx";

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function SatPracticePage({ categoryId }) {
  const category = SAT_CATEGORIES.find((c) => c.id === categoryId);
  const allQuestions = SAT_QUESTIONS[categoryId] || [];
  const { progress, recordAnswer, masteredCount } = useSatProgress();

  const [index, setIndex] = useState(0);
  // answers[questionId] = { selected, checked } so going Back keeps what you did
  const [answers, setAnswers] = useState({});
  const [difficulty, setDifficulty] = useState("all");
  const [skill, setSkill] = useState("all");

  // Questions without metadata (the original 80) only show under "All".
  const skills = [...new Set(allQuestions.map((x) => x.skill).filter(Boolean))].sort();
  const questions = allQuestions.filter(
    (x) => (difficulty === "all" || x.difficulty === difficulty) && (skill === "all" || x.skill === skill),
  );

  function changeFilter(setter, value) {
    setter(value);
    setIndex(0);
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

  const filters =
    skills.length > 0 ? (
      <div className="xs-filters">
        <label className="xs-filters__field">
          Difficulty
          <select value={difficulty} onChange={(e) => changeFilter(setDifficulty, e.target.value)}>
            <option value="all">All</option>
            {SAT_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {cap(d)}
              </option>
            ))}
          </select>
        </label>
        <label className="xs-filters__field">
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
    ) : null;

  if (questions.length === 0) {
    return (
      <section className="section">
        <div className="section__inner">
          <a className="detail__back" href="#/category/sat">&larr; Back to SAT</a>
          <h1 className="section__title">{category.label}</h1>
          {filters}
          <p className="section__lede">No questions match these filters.</p>
        </div>
      </section>
    );
  }

  const safeIndex = Math.min(index, questions.length - 1);
  const q = questions[safeIndex];
  const a = answers[q.id] || { selected: null, checked: false };
  const isCorrect = a.selected === q.answer;

  const statuses = questions.map((item) => {
    const r = answers[item.id];
    if (r?.checked) return r.selected === item.answer ? "correct" : "incorrect";
    if (r?.selected) return "answered";
    return "unanswered";
  });

  function setSelected(id) {
    setAnswers((p) => (p[q.id]?.checked ? p : { ...p, [q.id]: { selected: id, checked: false } }));
  }
  function handleCheck() {
    if (!a.selected || a.checked) return;
    setAnswers((p) => ({ ...p, [q.id]: { selected: a.selected, checked: true } }));
    recordAnswer(q.id, categoryId, a.selected === q.answer);
  }

  const hasPassage = !!q.passage;
  const meta = [q.difficulty ? cap(q.difficulty) : null, q.skill].filter(Boolean).join(" - ");

  return (
    <ExerciseShell
      title={category.label}
      exitHref="#/category/sat"
      exitLabel="SAT"
      directions={
        <>
          <p>Read the passage on the left, then answer the question on the right. Choose the best of the four answers and press Check answer to see the explanation.</p>
          <p>{masteredCount(categoryId)} of {allQuestions.length} questions in this set mastered so far.</p>
        </>
      }
      filters={filters}
      questionIds={questions.map((x) => x.id)}
      statuses={statuses}
      index={safeIndex}
      onIndexChange={setIndex}
      passageText={hasPassage ? q.passage : null}
      passageNode={hasPassage ? null : <p className="xs-stimulus">{q.prompt}</p>}
    >
      {meta && <p className="xs-meta">{meta}</p>}
      {hasPassage && <p className="xs-prompt">{q.prompt}</p>}
      <div className="xs-options" role="radiogroup" aria-label="Answer choices">
        {q.options.map((opt) => (
          <XsOption
            key={opt.id}
            letter={opt.id}
            selected={a.selected === opt.id}
            correct={a.checked && opt.id === q.answer}
            wrong={a.checked && a.selected === opt.id && opt.id !== q.answer}
            disabled={a.checked}
            onClick={() => setSelected(opt.id)}
          >
            {opt.text}
          </XsOption>
        ))}
      </div>
      <XsCheck
        checked={a.checked}
        canCheck={!!a.selected}
        onCheck={handleCheck}
        correct={isCorrect}
        verdict={isCorrect ? "Correct" : `Not quite. The correct answer is ${q.answer}.`}
      >
        <p className="xs-feedback__text">{q.explanation}</p>
      </XsCheck>
    </ExerciseShell>
  );
}
