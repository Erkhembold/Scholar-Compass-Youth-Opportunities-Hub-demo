import { useEffect, useRef, useState } from "react";
import { TESTS } from "../data/ieltsTests.js";
import { scoreToBand, isCorrect, correctAnswerLabel, TYPE_LABELS } from "../utils/ielts.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import PassageArt from "../components/PassageArt.jsx";

const TEST_DURATION_SECONDS = 60 * 60;
const WARNING_THRESHOLD_SECONDS = 5 * 60;
const HISTORY_KEY = "scholarcompass:ielts-attempts";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function flattenQuestions(test) {
  const all = [];
  test.passages.forEach((passage) => {
    passage.groups.forEach((group) => {
      group.questions.forEach((q) => {
        all.push({ ...q, type: group.type, passageId: passage.id, passageTitle: passage.title });
      });
    });
  });
  return all.sort((a, b) => a.number - b.number);
}

function buildReport(test, answers) {
  const questions = flattenQuestions(test);
  let correctCount = 0;
  const byType = {};
  const byPassage = {};

  const perQuestion = questions.map((q) => {
    const userValue = answers[q.number];
    const correct = isCorrect(q, userValue);
    if (correct) correctCount += 1;

    byType[q.type] = byType[q.type] || { correct: 0, total: 0 };
    byType[q.type].total += 1;
    if (correct) byType[q.type].correct += 1;

    byPassage[q.passageId] = byPassage[q.passageId] || {
      title: q.passageTitle,
      correct: 0,
      total: 0,
    };
    byPassage[q.passageId].total += 1;
    if (correct) byPassage[q.passageId].correct += 1;

    return { ...q, userValue, correct };
  });

  const raw = correctCount;
  const band = scoreToBand(raw);

  function weakest(map) {
    let weak = null;
    Object.entries(map).forEach(([key, v]) => {
      if (v.total < 2) return;
      const accuracy = v.correct / v.total;
      if (!weak || accuracy < weak.accuracy) {
        weak = { key, accuracy, ...v };
      }
    });
    return weak;
  }

  const weakType = weakest(byType);
  const weakPassage = weakest(byPassage);

  let suggestion;
  if (raw >= 36) {
    suggestion =
      "Strong, consistent performance across all passages and question types. Keep practicing under timed conditions to hold this level steady.";
  } else if (weakType && weakPassage) {
    suggestion = `Most of your mistakes clustered around ${TYPE_LABELS[weakType.key]} questions (${weakType.correct}/${weakType.total} correct), largely in "${weakPassage.title}" (${weakPassage.correct}/${weakPassage.total} correct). That combination is a good place to focus your next practice session.`;
  } else if (weakType) {
    suggestion = `Most of your mistakes were in ${TYPE_LABELS[weakType.key]} questions (${weakType.correct}/${weakType.total} correct) — worth targeted practice on that question type specifically.`;
  } else {
    suggestion =
      "Your mistakes were spread fairly evenly across question types and passages — try timing yourself more tightly per passage on the next attempt.";
  }

  return { raw, band, byType, byPassage, perQuestion, suggestion };
}

function saveAttempt(test, report) {
  try {
    const history = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || "[]");
    history.push({
      testId: test.id,
      testTitle: test.title,
      date: new Date().toISOString(),
      raw: report.raw,
      band: report.band,
      byType: report.byType,
      byPassage: report.byPassage,
    });
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Prototype-only persistence — if storage is unavailable, the result
    // still renders on screen, it just won't carry over between visits.
  }
}

function PassageBody({ passage }) {
  if (passage.paragraphs) {
    return (
      <div className="reading-passage__text">
        {passage.paragraphs.map((p) => (
          <p key={p.id}>
            <strong>{p.id}. </strong>
            {p.text}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className="reading-passage__text">
      {passage.text
        .trim()
        .split(/\n{2,}/)
        .map((para, i) => (
          <p key={i}>{para}</p>
        ))}
    </div>
  );
}

function HeadingMatching({ group, answers, onAnswer }) {
  const [draggedId, setDraggedId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [overQuestion, setOverQuestion] = useState(null);

  const usedIds = new Set(
    group.questions.map((q) => answers[q.number]).filter(Boolean)
  );
  const headingById = Object.fromEntries(group.headings.map((h) => [h.id, h]));
  const bankHeadings = group.headings.filter((h) => !usedIds.has(h.id));

  function assign(questionNumber, headingId) {
    if (!headingId) return;
    onAnswer(questionNumber, headingId);
    setSelectedId(null);
    setDraggedId(null);
  }

  function unassign(questionNumber) {
    onAnswer(questionNumber, "");
  }

  return (
    <div className="heading-matching">
      <p className="heading-matching__hint">
        Drag a heading onto the paragraph it belongs to, or tap a heading
        then tap a paragraph to place it.
      </p>

      <ul className="heading-bank" aria-label="Available headings">
        {bankHeadings.length === 0 && (
          <li className="heading-bank__empty">All headings placed.</li>
        )}
        {bankHeadings.map((h) => (
          <li
            key={h.id}
            className={`heading-chip ${selectedId === h.id ? "heading-chip--selected" : ""} ${
              draggedId === h.id ? "heading-chip--dragging" : ""
            }`}
            draggable
            role="button"
            tabIndex={0}
            aria-pressed={selectedId === h.id}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", h.id);
              e.dataTransfer.effectAllowed = "move";
              setDraggedId(h.id);
            }}
            onDragEnd={() => setDraggedId(null)}
            onClick={() => setSelectedId((prev) => (prev === h.id ? null : h.id))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedId((prev) => (prev === h.id ? null : h.id));
              }
            }}
          >
            <span className="heading-chip__handle" aria-hidden="true">
              ⠿
            </span>
            <span className="heading-chip__id">{h.id}</span>
            <span className="heading-chip__text">{h.text}</span>
          </li>
        ))}
      </ul>

      <div className="question-list">
        {group.questions.map((q) => {
          const assignedId = answers[q.number];
          const assignedHeading = assignedId ? headingById[assignedId] : null;
          const isOver = overQuestion === q.number;
          return (
            <div
              className={`heading-dropzone ${isOver ? "heading-dropzone--over" : ""} ${
                assignedHeading ? "heading-dropzone--filled" : ""
              }`}
              key={q.number}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setOverQuestion(q.number);
              }}
              onDragLeave={() => setOverQuestion((prev) => (prev === q.number ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain") || draggedId;
                assign(q.number, id);
                setOverQuestion(null);
              }}
              onClick={() => {
                if (selectedId) assign(q.number, selectedId);
              }}
            >
              <span className="heading-dropzone__label">
                {q.number}. Paragraph {q.paragraphId}
              </span>
              {assignedHeading ? (
                <span className="heading-dropzone__answer">
                  <span className="heading-chip__id">{assignedHeading.id}</span>
                  <span className="heading-dropzone__answer-text">{assignedHeading.text}</span>
                  <button
                    type="button"
                    className="heading-dropzone__remove"
                    aria-label={`Remove heading from paragraph ${q.paragraphId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      unassign(q.number);
                    }}
                  >
                    ×
                  </button>
                </span>
              ) : (
                <span className="heading-dropzone__placeholder">Drop heading here</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionGroup({ group, answers, onAnswer }) {
  return (
    <div className="question-group">
      <p className="question-group__instruction">{group.instruction}</p>

      {group.type === "matching" ? (
        <HeadingMatching group={group} answers={answers} onAnswer={onAnswer} />
      ) : (
      <div className="question-list">
        {group.questions.map((q) => {
          if (group.type === "mc") {
            return (
              <fieldset className="question-row question-row--mc" key={q.number}>
                <legend>
                  {q.number}. {q.prompt}
                </legend>
                {q.options.map((opt) => (
                  <label className="mc-option" key={opt.id}>
                    <input
                      type="radio"
                      name={`q${q.number}`}
                      value={opt.id}
                      checked={answers[q.number] === opt.id}
                      onChange={() => onAnswer(q.number, opt.id)}
                    />
                    <span>
                      {opt.id}. {opt.text}
                    </span>
                  </label>
                ))}
              </fieldset>
            );
          }

          if (group.type === "tfng") {
            return (
              <fieldset className="question-row question-row--mc" key={q.number}>
                <legend>
                  {q.number}. {q.prompt}
                </legend>
                {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => (
                  <label className="mc-option" key={opt}>
                    <input
                      type="radio"
                      name={`q${q.number}`}
                      value={opt}
                      checked={answers[q.number] === opt}
                      onChange={() => onAnswer(q.number, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </fieldset>
            );
          }

          // completion
          return (
            <div className="question-row" key={q.number}>
              <label htmlFor={`q${q.number}`}>
                {q.number}. {q.prompt}
              </label>
              <input
                id={`q${q.number}`}
                type="text"
                value={answers[q.number] || ""}
                onChange={(e) => onAnswer(q.number, e.target.value)}
                autoComplete="off"
              />
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

export default function IeltsTestPage({ id }) {
  const { t } = useLanguage();
  const test = TESTS.find((test) => test.id === id);
  const [phase, setPhase] = useState("intro"); // intro | running | results
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_SECONDS);
  const [report, setReport] = useState(null);
  const intervalRef = useRef(null);
  const submittedRef = useRef(false);

  function handleAnswer(number, value) {
    setAnswers((prev) => ({ ...prev, [number]: value }));
  }

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const r = buildReport(test, answers);
    saveAttempt(test, r);
    setReport(r);
    setPhase("results");
  }

  useEffect(() => {
    if (phase !== "running") return undefined;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!test) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Test not found</h1>
          <p className="section__lede">
            <a href="#/category/ielts">{t("Back")} to IELTS.</a>
          </p>
        </div>
      </section>
    );
  }

  if (test.comingSoon) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">{test.title}</h1>
          <p className="section__lede">
            {t("This test hasn't been built yet — check back soon.")}{" "}
            <a href="#/category/ielts">{t("Back")} to IELTS.</a>
          </p>
        </div>
      </section>
    );
  }

  if (phase === "intro") {
    return (
      <section className="section test-intro">
        <div className="section__inner">
          <a className="detail__back" href="#/category/ielts">
            ← {t("Back")} to IELTS
          </a>
          <h1 className="section__title">{test.title}</h1>
          <p className="section__lede">
            {t(
              "3 passages, 40 questions, 60 minutes. The timer starts as soon as you click Start, and the test auto-submits when time runs out."
            )}
          </p>
          <ul className="test-intro__facts">
            <li>{t("60-minute countdown timer, always visible")}</li>
            <li>
              {t(
                "Mix of True/False/Not Given, multiple choice, matching headings, and sentence completion"
              )}
            </li>
            <li>{t("Full band score and answer review immediately after submitting")}</li>
          </ul>
          <button type="button" className="btn btn--accent" onClick={() => setPhase("running")}>
            {t("Start Test")}
          </button>
        </div>
      </section>
    );
  }

  if (phase === "running") {
    const isWarning = secondsLeft <= WARNING_THRESHOLD_SECONDS;
    return (
      <div className="test-runner">
        <div className={`test-timer ${isWarning ? "test-timer--warning" : ""}`}>
          <span className="test-timer__label">{test.title}</span>
          <span className="test-timer__clock">{formatTime(secondsLeft)}</span>
          <button type="button" className="btn btn--accent btn--small" onClick={handleSubmit}>
            {t("Submit Test")}
          </button>
        </div>

        <div className="section test-runner__body">
          <div className="section__inner">
            {test.passages.map((passage, i) => (
              <article className="reading-passage" key={passage.id}>
                <PassageArt number={i + 1} image={passage.image} alt={passage.title} />
                <h2 className="detail__section-title">
                  {t("Passage")} {i + 1}: {passage.title}
                </h2>
                <div className="reading-passage__columns">
                  <PassageBody passage={passage} />
                  <div className="reading-passage__questions">
                    {passage.groups.map((group, gi) => (
                      <QuestionGroup key={gi} group={group} answers={answers} onAnswer={handleAnswer} />
                    ))}
                  </div>
                </div>
              </article>
            ))}

            <div className="test-runner__submit">
              <button type="button" className="btn btn--accent" onClick={handleSubmit}>
                {t("Submit Test")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // results
  return (
    <section className="section results">
      <div className="section__inner">
        <a className="detail__back" href="#/category/ielts">
          ← {t("Back")} to IELTS
        </a>

        <div className="results__score">
          <span className="results__score-label">{t("Your band score")}</span>
          <span className="results__band">Band {report.band}</span>
          <span className="results__raw">{report.raw}/40 {t("correct")}</span>
        </div>

        <div className="results__breakdown">
          <div className="results__breakdown-block">
            <h3>{t("By question type")}</h3>
            <ul>
              {Object.entries(report.byType).map(([type, v]) => (
                <li key={type}>
                  {TYPE_LABELS[type]}: {v.correct}/{v.total}
                </li>
              ))}
            </ul>
          </div>
          <div className="results__breakdown-block">
            <h3>{t("By passage")}</h3>
            <ul>
              {Object.values(report.byPassage).map((v) => (
                <li key={v.title}>
                  {v.title}: {v.correct}/{v.total}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="results__suggestion">{report.suggestion}</p>

        <h3 className="detail__section-title" style={{ marginTop: 40 }}>
          {t("Full answer review")}
        </h3>
        <div className="review-list">
          {report.perQuestion.map((q) => (
            <div
              key={q.number}
              className={`review-item ${q.correct ? "review-item--correct" : "review-item--incorrect"}`}
            >
              <span className="review-item__number">{q.number}</span>
              <div className="review-item__body">
                <p className="review-item__prompt">
                  {q.prompt || `Paragraph ${q.paragraphId}`}
                </p>
                <p className="review-item__answers">
                  {t("Your Answer")}: <strong>{q.userValue || t("No answer")}</strong>
                  {" · "}{t("Correct Answer")}: <strong>{correctAnswerLabel(q)}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
