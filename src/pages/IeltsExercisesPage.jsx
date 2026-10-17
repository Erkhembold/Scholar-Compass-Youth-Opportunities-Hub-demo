import { useState } from "react";
import { IELTS_READING_EXERCISES } from "../data/ieltsReadingExercises.js";
import { IELTS_WRITING_EXERCISES } from "../data/ieltsWritingExercises.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { saveExerciseAttempt } from "../utils/ieltsExerciseHistory.js";
import ExerciseShell, { XsOption, XsCheck } from "../components/exercise/ExerciseShell.jsx";

const SKILL_META = {
  reading: { label: "Reading", ready: true, exercises: IELTS_READING_EXERCISES },
  listening: { label: "Listening", ready: false },
  speaking: { label: "Speaking", ready: false },
  writing: { label: "Writing", ready: true, exercises: IELTS_WRITING_EXERCISES },
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

  // key={skill} forces a fresh mount (fresh index/selected/checked state)
  // when switching between Reading and Writing rather than carrying over
  // state from one exercise array into the other.
  return <ExerciseRunner key={skill} exercises={meta.exercises} label={meta.label} />;
}

// Shared by Reading and Writing: both use the same question schema
// (see ieltsReadingExercises.js / ieltsWritingExercises.js), so one runner
// works for either as long as it's told which array and which label to show.
function emptyAnswer(exercise) {
  return exercise.type === "tfng" ? Array(exercise.statements.length).fill(null) : null;
}

function ExerciseRunner({ exercises, label }) {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  // answers[exerciseId] = { selected, checked, correct } (kept when you go Back)
  const [answers, setAnswers] = useState({});

  const exercise = exercises[index];
  const a = answers[exercise.id] || { selected: emptyAnswer(exercise), checked: false, correct: false };
  const answeredCount = Object.values(answers).filter((x) => x.checked).length;
  const correctCount = Object.values(answers).filter((x) => x.checked && x.correct).length;

  const statuses = exercises.map((ex) => {
    const r = answers[ex.id];
    if (r?.checked) return r.correct ? "correct" : "incorrect";
    if (r && isAnswered(ex, r.selected)) return "answered";
    return "unanswered";
  });

  function setSelected(next) {
    setAnswers((p) => (p[exercise.id]?.checked ? p : { ...p, [exercise.id]: { selected: next, checked: false, correct: false } }));
  }

  function handleCheck() {
    if (a.checked) return;
    const correct = computeCorrect(exercise, a.selected);
    setAnswers((p) => ({ ...p, [exercise.id]: { selected: a.selected, checked: true, correct } }));
    // Signed-in students get this attempt saved to their history (and it
    // counts toward their daily streak). Anonymous visitors practise as before.
    saveExerciseAttempt(supabase, user?.id, exercise, a.selected, correct);
  }

  const hasPassage = !!exercise.passage;
  const prompt = exercise.type === "mc" ? exercise.question : exercise.type === "completion" ? exercise.prompt : null;

  return (
    <ExerciseShell
      title={`IELTS ${label}`}
      exitHref="#/category/ielts"
      exitLabel="IELTS"
      directions={
        <>
          <p>Short, targeted practice, one question at a time. This is not a timed mock test.</p>
          {!user && (
            <p>
              <a href="#/signin">Sign in</a> to save your exercise history and build a daily streak.
            </p>
          )}
        </>
      }
      questionIds={exercises.map((ex) => ex.id)}
      statuses={statuses}
      index={index}
      onIndexChange={setIndex}
      passageText={hasPassage ? exercise.passage : null}
      passageNode={prompt ? <p className="xs-stimulus">{prompt}</p> : <p className="xs-stimulus xs-stimulus--muted">Answer the question on the right.</p>}
    >
      <p className="xs-meta">
        Exercise {index + 1} of {exercises.length} - {DIFFICULTY_LABEL[exercise.difficulty] || exercise.difficulty}
        {answeredCount > 0 ? ` - Score ${correctCount}/${answeredCount}` : ""}
      </p>
      {hasPassage && prompt && <p className="xs-prompt">{prompt}</p>}
      <ExerciseQuestion exercise={exercise} selected={a.selected} setSelected={setSelected} checked={a.checked} />
      <XsCheck
        checked={a.checked}
        canCheck={isAnswered(exercise, a.selected)}
        onCheck={handleCheck}
        correct={a.correct}
        verdict={a.correct ? "Correct" : "Not quite"}
      >
        {exercise.explanation && <p className="xs-feedback__text">{exercise.explanation}</p>}
        {!exercise.explanation && exercise.answer && <p className="xs-feedback__text">Correct answer: {formatAnswer(exercise)}</p>}
      </XsCheck>
    </ExerciseShell>
  );
}

function ExerciseQuestion({ exercise, selected, setSelected, checked }) {
  if (exercise.type === "mc") {
    return (
      <div className="xs-options" role="radiogroup" aria-label="Answer choices">
        {exercise.options.map((opt) => (
          <XsOption
            key={opt.id}
            letter={opt.id}
            selected={selected === opt.id}
            correct={checked && opt.id === exercise.answer}
            wrong={checked && selected === opt.id && opt.id !== exercise.answer}
            disabled={checked}
            onClick={() => setSelected(opt.id)}
          >
            {opt.text}
          </XsOption>
        ))}
      </div>
    );
  }

  if (exercise.type === "tfng") {
    return (
      <div>
        {exercise.statements.map((st, i) => (
          <div key={i} className="xs-tfng">
            <p className="xs-prompt">
              {i + 1}. {st.text}
            </p>
            <div className="xs-options xs-options--row" role="radiogroup" aria-label={`Statement ${i + 1}`}>
              {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                <XsOption
                  key={val}
                  letter={val[0]}
                  selected={selected?.[i] === val}
                  correct={checked && val === st.answer}
                  wrong={checked && selected?.[i] === val && val !== st.answer}
                  disabled={checked}
                  onClick={() => {
                    const next = [...selected];
                    next[i] = val;
                    setSelected(next);
                  }}
                >
                  {val}
                </XsOption>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (exercise.type === "matching") {
    return (
      <>
        <p className="xs-prompt">Choose the correct heading for this paragraph.</p>
        <div className="xs-options" role="radiogroup" aria-label="Headings">
          {exercise.headings.map((h) => (
            <XsOption
              key={h.id}
              letter={h.id}
              selected={selected === h.id}
              correct={checked && h.id === exercise.answer}
              wrong={checked && selected === h.id && h.id !== exercise.answer}
              disabled={checked}
              onClick={() => setSelected(h.id)}
            >
              {h.text}
            </XsOption>
          ))}
        </div>
      </>
    );
  }

  // completion
  return (
    <div className="xs-spr">
      <label htmlFor="xs-completion">Your answer</label>
      <input
        id="xs-completion"
        type="text"
        className="xs-input"
        value={selected || ""}
        disabled={checked}
        onChange={(e) => setSelected(e.target.value)}
        placeholder="Type your answer"
      />
    </div>
  );
}

function isAnswered(exercise, selected) {
  if (exercise.type === "tfng") return !!selected && selected.every((v) => v);
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
