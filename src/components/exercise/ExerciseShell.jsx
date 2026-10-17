import { useCallback, useEffect, useRef, useState } from "react";
import { addHighlight, removeHighlightAt, selectionOffsets, splitSegments } from "../../utils/highlights.js";

// Split-pane practice layout shared by SAT Reading & Writing, SAT Math and
// IELTS exercises (modelled on the Digital SAT / Bluebook screen):
//   top bar     directions, filters slot, timer (Hide / pause), highlighter, notes
//   main        left = passage / stimulus, right = question + choices (children)
//   bottom bar  "Question X of Y" map pill, Back / Next
// The shell owns the UI state that belongs to the session, not the question:
// timer, flagged questions, per-question notes and highlights. The caller owns
// the answers (so each runner keeps its own scoring, saving and XP).

const icon = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
const IconHighlighter = () => (
  <svg {...icon}><path d="m9 11 4 4" /><path d="M4 20h6" /><path d="m14.5 3.5 6 6-8.5 8.5-3.5-.5-.5-3.5Z" /></svg>
);
const IconNotes = () => (
  <svg {...icon}><path d="M5 4h14v16H5Z" /><path d="M9 9h6M9 13h6M9 17h3" /></svg>
);
const IconFlag = ({ filled }) => (
  <svg {...icon} width={18} height={18} fill={filled ? "currentColor" : "none"}><path d="M6 21V4h11l-2 4 2 4H6" /></svg>
);
const IconPause = () => (
  <svg {...icon} width={16} height={16}><path d="M9 5v14M15 5v14" /></svg>
);
const IconPlay = () => (
  <svg {...icon} width={16} height={16}><path d="m8 5 11 7-11 7Z" /></svg>
);
const IconChevron = ({ up }) => (
  <svg {...icon} width={16} height={16} style={{ transform: up ? "rotate(180deg)" : "none" }}><path d="m6 9 6 6 6-6" /></svg>
);

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Small button + popover used for "Directions" and "Filters".
export function ShellMenu({ label, children, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className="xs-menu" ref={ref}>
      <button type="button" className="xs-menu__btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {label} <IconChevron up={open} />
      </button>
      {open && <div className={`xs-menu__panel xs-menu__panel--${align}`}>{children}</div>}
    </div>
  );
}

function Passage({ text, highlights, onAdd, onRemove, highlighting }) {
  const ref = useRef(null);
  const segments = splitSegments(text, highlights);
  function handleUp() {
    if (!highlighting) return;
    const sel = window.getSelection();
    const range = selectionOffsets(ref.current, sel);
    if (range) {
      onAdd(range.start, range.end);
      sel.removeAllRanges();
    }
  }
  return (
    <div
      ref={ref}
      className={`xs-passage__text${highlighting ? " is-highlighting" : ""}`}
      onMouseUp={handleUp}
      onTouchEnd={handleUp}
    >
      {segments.map((s) =>
        s.hl ? (
          <mark key={s.start} className="xs-mark" onClick={() => highlighting && onRemove(s.start)} title={highlighting ? "Click to remove" : undefined}>
            {s.text}
          </mark>
        ) : (
          <span key={s.start}>{s.text}</span>
        ),
      )}
    </div>
  );
}

export default function ExerciseShell({
  title,
  exitHref,
  exitLabel = "Exit",
  directions,
  filters = null,
  questionIds,
  statuses,
  index,
  onIndexChange,
  passageText = null, // plain text: can be highlighted
  passageNode = null, // any node: shown as-is, no highlighter
  leftLabel = null,
  children,
}) {
  const total = questionIds.length;
  const qid = questionIds[index];

  // session timer (counts up), hideable and pausable
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timerHidden, setTimerHidden] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const [flagged, setFlagged] = useState(() => new Set());
  const [notes, setNotes] = useState({});
  const [highlights, setHighlights] = useState({});
  const [highlighting, setHighlighting] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  // divider: left pane share of the width (desktop only)
  const [split, setSplit] = useState(50);
  const mainRef = useRef(null);
  const dragging = useRef(false);
  const onDrag = useCallback((e) => {
    if (!dragging.current || !mainRef.current) return;
    const r = mainRef.current.getBoundingClientRect();
    setSplit(Math.max(30, Math.min(70, ((e.clientX - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    const stop = () => {
      dragging.current = false;
      document.body.classList.remove("xs-dragging");
    };
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", stop);
    };
  }, [onDrag]);

  // close popovers when the question changes
  useEffect(() => {
    setMapOpen(false);
  }, [qid]);
  useEffect(() => {
    if (!mapOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMapOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mapOpen]);

  const canHighlight = typeof passageText === "string" && passageText.length > 0;
  const myHighlights = highlights[qid] || [];
  const isFlagged = flagged.has(qid);
  const answeredCount = statuses.filter((s) => s !== "unanswered").length;

  function toggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  }

  return (
    <div className="xs" data-testid="exercise-shell">
      <header className="xs-top">
        <div className="xs-top__left">
          <a className="xs-exit" href={exitHref} aria-label={exitLabel}>
            &larr; {exitLabel}
          </a>
          <div className="xs-top__title">
            <strong>{title}</strong>
            <div className="xs-top__menus">
              {directions && <ShellMenu label="Directions"><div className="xs-directions">{directions}</div></ShellMenu>}
              {filters && <ShellMenu label="Filters">{filters}</ShellMenu>}
            </div>
          </div>
        </div>

        <div className="xs-timer" role="timer" aria-label="Elapsed time">
          <span className="xs-timer__row">
            <span className="xs-timer__time">{timerHidden ? "--:--" : formatTime(seconds)}</span>
            <button type="button" className="xs-icon-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Resume timer" : "Pause timer"}>
              {paused ? <IconPlay /> : <IconPause />}
            </button>
          </span>
          <button type="button" className="xs-pill-btn" onClick={() => setTimerHidden((h) => !h)} aria-pressed={timerHidden}>
            {timerHidden ? "Show" : "Hide"}
          </button>
        </div>

        <div className="xs-tools">
          <button
            type="button"
            className={`xs-tool${highlighting ? " is-on" : ""}`}
            onClick={() => setHighlighting((v) => !v)}
            disabled={!canHighlight}
            aria-pressed={highlighting}
            title={canHighlight ? "Highlight text in the passage" : "Highlighting is available on reading passages"}
          >
            <IconHighlighter />
            <span>Highlight</span>
          </button>
          <button type="button" className={`xs-tool${notesOpen ? " is-on" : ""}`} onClick={() => setNotesOpen((v) => !v)} aria-pressed={notesOpen}>
            <IconNotes />
            <span>Notes{notes[qid] ? " *" : ""}</span>
          </button>
        </div>
      </header>

      <main className="xs-main" ref={mainRef} style={{ "--xs-left": `${split}%` }}>
        <section className="xs-left" aria-label="Passage">
          {leftLabel && <p className="xs-left__label">{leftLabel}</p>}
          {canHighlight ? (
            <Passage
              key={qid}
              text={passageText}
              highlights={myHighlights}
              highlighting={highlighting}
              onAdd={(s, e) => setHighlights((h) => ({ ...h, [qid]: addHighlight(h[qid] || [], s, e) }))}
              onRemove={(offset) => setHighlights((h) => ({ ...h, [qid]: removeHighlightAt(h[qid] || [], offset) }))}
            />
          ) : (
            passageNode
          )}
          {canHighlight && myHighlights.length > 0 && (
            <button type="button" className="xs-link" onClick={() => setHighlights((h) => ({ ...h, [qid]: [] }))}>
              Clear highlights
            </button>
          )}
        </section>

        <div
          className="xs-divider"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          tabIndex={0}
          onPointerDown={(e) => {
            dragging.current = true;
            document.body.classList.add("xs-dragging");
            e.preventDefault();
          }}
          onDoubleClick={() => setSplit(50)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setSplit((s) => Math.max(30, s - 3));
            if (e.key === "ArrowRight") setSplit((s) => Math.min(70, s + 3));
          }}
        />

        <section className="xs-right" aria-label="Question">
          <div className="xs-qhead">
            <span className="xs-qhead__num" aria-label={`Question ${index + 1}`}>{index + 1}</span>
            <button type="button" className={`xs-flag${isFlagged ? " is-on" : ""}`} onClick={toggleFlag} aria-pressed={isFlagged}>
              <IconFlag filled={isFlagged} /> Mark for Review
            </button>
          </div>
          <div className="xs-right__body">{children}</div>
        </section>

        {notesOpen && (
          <aside className="xs-notes" aria-label="Notes">
            <div className="xs-notes__head">
              <strong>Notes for question {index + 1}</strong>
              <button type="button" className="xs-icon-btn" onClick={() => setNotesOpen(false)} aria-label="Close notes">
                &times;
              </button>
            </div>
            <textarea
              className="xs-notes__area"
              value={notes[qid] || ""}
              onChange={(e) => setNotes((n) => ({ ...n, [qid]: e.target.value }))}
              placeholder="Scratchpad: work, eliminated choices, reminders. Kept for this question while you practise."
              aria-label={`Notes for question ${index + 1}`}
            />
          </aside>
        )}
      </main>

      <footer className="xs-bottom">
        <div className="xs-bottom__side" />
        <div className="xs-map-wrap">
          {mapOpen && (
            <div className="xs-map" role="dialog" aria-label="Question map">
              <div className="xs-map__head">
                <strong>Questions</strong>
                <span>{answeredCount} of {total} answered</span>
              </div>
              <div className="xs-map__grid">
                {questionIds.map((id, i) => (
                  <button
                    key={id}
                    type="button"
                    className={`xs-map__cell xs-map__cell--${statuses[i]}${i === index ? " is-current" : ""}${flagged.has(id) ? " is-flagged" : ""}`}
                    onClick={() => {
                      onIndexChange(i);
                      setMapOpen(false);
                    }}
                    aria-label={`Question ${i + 1}, ${statuses[i] === "unanswered" ? "unanswered" : "answered"}${flagged.has(id) ? ", marked for review" : ""}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <ul className="xs-map__legend">
                <li><span className="xs-key xs-key--current" />Current</li>
                <li><span className="xs-key xs-key--answered" />Answered</li>
                <li><span className="xs-key xs-key--unanswered" />Unanswered</li>
                <li><span className="xs-key xs-key--flag" />Marked for Review</li>
              </ul>
            </div>
          )}
          <button type="button" className="xs-counter" aria-expanded={mapOpen} onClick={() => setMapOpen((v) => !v)}>
            Question {index + 1} of {total} <IconChevron up={!mapOpen} />
          </button>
        </div>
        <div className="xs-bottom__nav">
          <button type="button" className="xs-btn xs-btn--ghost" disabled={index === 0} onClick={() => onIndexChange(index - 1)}>
            Back
          </button>
          <button type="button" className="xs-btn xs-btn--primary" disabled={index >= total - 1} onClick={() => onIndexChange(index + 1)}>
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}

// Answer choice used by every runner: lettered circle + text.
export function XsOption({ letter, selected, correct, wrong, disabled, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={!!selected}
      className={`xs-option${selected ? " is-selected" : ""}${correct ? " is-correct" : ""}${wrong ? " is-wrong" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="xs-option__letter">{letter}</span>
      <span className="xs-option__text">{children}</span>
    </button>
  );
}

// "Check answer" button + feedback block.
export function XsCheck({ checked, canCheck, onCheck, correct, verdict, children }) {
  return (
    <>
      {!checked && (
        <button type="button" className="xs-check" disabled={!canCheck} onClick={onCheck}>
          Check answer
        </button>
      )}
      {checked && (
        <div className={`xs-feedback ${correct ? "xs-feedback--correct" : "xs-feedback--wrong"}`} role="status">
          <p className="xs-feedback__verdict">{verdict}</p>
          {children}
        </div>
      )}
    </>
  );
}
