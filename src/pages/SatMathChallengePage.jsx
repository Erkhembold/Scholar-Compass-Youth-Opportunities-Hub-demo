import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useSatMathMatch } from "../hooks/useSatMathMatch.js";
import MathText from "../components/MathText.jsx";
import { SAT_MATH_QUESTIONS, getSatMathQuestion } from "../data/satMathQuestions.js";
import { computeClock, isPlayerConnected } from "../utils/satMathTimer.js";
import { recordActivity } from "../utils/streak.js";

const MIN_QUESTIONS = 5;
const MIN_SECONDS = 30;
const MAX_SECONDS = 300;

export default function SatMathChallengePage({ matchId }) {
  const { user, loading } = useAuth();
  const m = useSatMathMatch(matchId);
  const { match, error, resuming } = m;

  // Counts as one qualifying activity, same as the SAT/IELTS 1v1 modes —
  // once per match, guarded locally since the completed screen can
  // re-render several times while results stream in.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (match?.status === "completed" && !recordedRef.current) {
      recordedRef.current = true;
      recordActivity("sat_question", matchId);
    }
  }, [match?.status, matchId]);

  // Ticks ~4x/second so timers and heartbeat checks stay fresh. Uses SERVER time.
  const [nowMs, setNowMs] = useState(() => m.getServerNow());
  useEffect(() => {
    const t = setInterval(() => setNowMs(m.getServerNow()), 250);
    return () => clearInterval(t);
  }, [m.getServerNow]);

  if (loading) return <PlainMessage>Loading…</PlainMessage>;
  if (!user) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">You're not signed in</h1>
          <p className="section__lede">
            <a href="#/signin">Sign in</a> to challenge a friend to a SAT Math 1v1. Both players need an account.
          </p>
        </div>
      </section>
    );
  }
  if (resuming) return <PlainMessage>Reconnecting to your challenge…</PlainMessage>;
  if (!match) return <Landing m={m} />;

  const isHost = match.host_id === m.userId;
  const otherName = (isHost ? match.opponent_name : match.host_name) || "Your opponent";
  const otherSeen = isHost ? match.opponent_last_seen : match.host_last_seen;
  const otherConnected = isPlayerConnected(otherSeen, nowMs);
  const clock = computeClock(match, nowMs);

  if (match.status === "expired") {
    return (
      <Shell>
        <h1 className="signin__title">This challenge expired</h1>
        <p className="signin__lede">Nobody started it in time. Create a new one and share the new PIN.</p>
        <button type="button" className="btn btn--accent" onClick={m.resetLocal}>
          Back to SAT Math 1v1
        </button>
      </Shell>
    );
  }
  if (match.status === "cancelled") {
    return (
      <Shell>
        <h1 className="signin__title">This challenge was cancelled</h1>
        <button type="button" className="btn btn--accent" onClick={m.resetLocal}>
          Back to SAT Math 1v1
        </button>
      </Shell>
    );
  }

  if (match.status === "waiting") return <Lobby m={m} match={match} />;
  if (match.status === "ready")
    return <Ready m={m} match={match} isHost={isHost} otherName={otherName} otherConnected={otherConnected} />;

  if (match.status === "in_progress" || match.status === "completed") {
    if (clock.phase === "countdown") {
      return (
        <Shell>
          <p className="sat-challenge__waiting-note">Both players start on the same clock</p>
          <div className="math-countdown" aria-live="assertive">
            {clock.countdownLeft}
          </div>
          <p className="signin__lede">Get ready…</p>
        </Shell>
      );
    }
    if (match.status === "completed") {
      return <Results m={m} match={match} isHost={isHost} otherName={otherName} />;
    }
    if (clock.phase === "finishing") {
      return (
        <Shell>
          <h1 className="signin__title">Time's up!</h1>
          <p className="signin__lede">Getting the final results…</p>
          <ConnectionBanner online={m.online} />
        </Shell>
      );
    }
    return (
      <Play
        m={m}
        match={match}
        clock={clock}
        otherName={otherName}
        otherConnected={otherConnected}
      />
    );
  }
  return <PlainMessage>Loading…</PlainMessage>;
}

function PlainMessage({ children }) {
  return (
    <section className="section">
      <div className="section__inner">
        <p className="section__lede">{children}</p>
      </div>
    </section>
  );
}

function Shell({ children }) {
  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card sat-challenge__card">
          <a className="detail__back" href="#/category/sat">
            ← Back to SAT
          </a>
          {children}
        </div>
      </div>
    </section>
  );
}

function ConnectionBanner({ online }) {
  if (online) return null;
  return (
    <p className="signin__status signin__status--error" role="status">
      Connection lost. Reconnecting… The clock keeps running, and your answers are saved as soon as you're back online.
    </p>
  );
}

// ----------------------------------------------------------------- landing
function Landing({ m }) {
  const [tab, setTab] = useState("create");
  const [count, setCount] = useState(10);
  const [seconds, setSeconds] = useState(60);
  const [pin, setPin] = useState("");
  const maxQuestions = SAT_MATH_QUESTIONS.length;

  const countOk = Number.isInteger(count) && count >= MIN_QUESTIONS && count <= maxQuestions;
  const secondsOk = Number.isInteger(seconds) && seconds >= MIN_SECONDS && seconds <= MAX_SECONDS;

  return (
    <Shell>
      <h1 className="signin__title">SAT Math 1v1</h1>
      <p className="signin__lede">
        Two players, the same math questions in the same order, one shared clock. Player 1 creates a challenge and shares
        the 4-digit PIN; Player 2 joins with it.
      </p>

      <div className="signin__tabs">
        <button
          type="button"
          className={`signin__tab ${tab === "create" ? "signin__tab--active" : ""}`}
          onClick={() => setTab("create")}
        >
          Create a challenge
        </button>
        <button
          type="button"
          className={`signin__tab ${tab === "join" ? "signin__tab--active" : ""}`}
          onClick={() => setTab("join")}
        >
          Join with a PIN
        </button>
      </div>

      {m.error && (
        <p className="signin__status signin__status--error" role="alert">
          {m.error}
        </p>
      )}

      {tab === "create" ? (
        <form
          className="signin__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (countOk && secondsOk) m.createMatch({ questionCount: count, seconds });
          }}
        >
          <div className="signin__field">
            <label htmlFor="sm-count">Number of questions (min {MIN_QUESTIONS}, max {maxQuestions})</label>
            <input
              id="sm-count"
              type="number"
              inputMode="numeric"
              min={MIN_QUESTIONS}
              max={maxQuestions}
              value={Number.isNaN(count) ? "" : count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="signin__field">
            <label htmlFor="sm-seconds">Time per question, in seconds (min {MIN_SECONDS})</label>
            <input
              id="sm-seconds"
              type="number"
              inputMode="numeric"
              min={MIN_SECONDS}
              max={MAX_SECONDS}
              step={5}
              value={Number.isNaN(seconds) ? "" : seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value, 10))}
            />
          </div>
          {!countOk && (
            <p className="math-field-hint">
              Choose between {MIN_QUESTIONS} and {maxQuestions} questions.
            </p>
          )}
          {!secondsOk && (
            <p className="math-field-hint">
              Choose between {MIN_SECONDS} and {MAX_SECONDS} seconds per question.
            </p>
          )}
          <button type="submit" className="signin__submit" disabled={m.busy || !countOk || !secondsOk}>
            {m.busy ? "Creating…" : "Create challenge"}
          </button>
        </form>
      ) : (
        <form
          className="signin__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (/^\d{4}$/.test(pin)) m.joinMatch(pin);
          }}
        >
          <div className="signin__field">
            <label htmlFor="sm-pin">4-digit PIN</label>
            <input
              id="sm-pin"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="1234"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
          <button type="submit" className="signin__submit" disabled={m.busy || pin.length !== 4}>
            {m.busy ? "Joining…" : "Join challenge"}
          </button>
        </form>
      )}
    </Shell>
  );
}

// ------------------------------------------------------------------- lobby
function Lobby({ m, match }) {
  return (
    <Shell>
      <h1 className="signin__title">Waiting for your opponent</h1>
      <p className="signin__lede">Share this PIN with your friend. The challenge stays open for 20 minutes.</p>
      <div className="sat-challenge__pin" aria-label={`PIN ${match.pin.split("").join(" ")}`}>
        {match.pin}
      </div>
      <p className="sat-challenge__waiting-note">
        {match.question_count} questions · {match.time_per_question_seconds}s each
      </p>
      <ConnectionBanner online={m.online} />
      {m.error && <p className="signin__status signin__status--error">{m.error}</p>}
      <button type="button" className="btn btn--ghost" onClick={m.leaveMatch}>
        Cancel challenge
      </button>
    </Shell>
  );
}

function Ready({ m, match, isHost, otherName, otherConnected }) {
  return (
    <Shell>
      <h1 className="signin__title">{otherName} joined!</h1>
      <p className="signin__lede">
        {match.question_count} questions · {match.time_per_question_seconds} seconds each. Both players get the same
        questions in the same order.
      </p>
      <PresencePill name={otherName} connected={otherConnected} />
      <ConnectionBanner online={m.online} />
      {m.error && <p className="signin__status signin__status--error">{m.error}</p>}
      {isHost ? (
        <button type="button" className="btn btn--accent" onClick={m.startMatch} disabled={m.busy}>
          {m.busy ? "Starting…" : "Start challenge"}
        </button>
      ) : (
        <p className="sat-challenge__waiting-note">Waiting for {match.host_name || "the host"} to start…</p>
      )}
      <button type="button" className="btn btn--ghost" style={{ marginTop: 12 }} onClick={m.leaveMatch}>
        {isHost ? "Cancel challenge" : "Leave challenge"}
      </button>
    </Shell>
  );
}

function PresencePill({ name, connected }) {
  return (
    <p className={`math-pill ${connected ? "math-pill--on" : "math-pill--off"}`} role="status">
      <span className="math-pill__dot" aria-hidden="true" />
      {connected ? `${name} is connected` : `${name} seems disconnected. They can rejoin with the same link.`}
    </p>
  );
}

// -------------------------------------------------------------------- play
function Play({ m, match, clock, otherName, otherConnected }) {
  const { index, secondsLeft, fractionLeft } = clock;
  const total = match.question_count;
  const qid = match.question_ids?.[index];
  const question = qid ? getSatMathQuestion(qid) : null;

  const [drafts, setDrafts] = useState({}); // index -> selected/typed value (not yet locked in)
  const [notice, setNotice] = useState(null);
  const prevIndexRef = useRef(index);

  const locked = m.myAnswers[index];
  const autoRef = useRef(new Set());

  // Last second of a question: lock in whatever is selected. (Also covers the final
  // question, where the clock moves on to "finishing" instead of a next question.)
  useEffect(() => {
    if (secondsLeft <= 1 && drafts[index] && !m.myAnswers[index] && !autoRef.current.has(index)) {
      autoRef.current.add(index);
      m.submitAnswer(index, drafts[index]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, index, drafts, m.myAnswers]);

  // When the clock moves to the next question, lock in a selected-but-unsubmitted answer
  // for the one we just left (the server allows a 2s grace window for exactly this).
  useEffect(() => {
    const prev = prevIndexRef.current;
    if (prev !== index) {
      if (drafts[prev] && !m.myAnswers[prev] && !autoRef.current.has(prev)) {
        autoRef.current.add(prev);
        m.submitAnswer(prev, drafts[prev]);
      }
      setNotice(null);
      prevIndexRef.current = index;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  async function lockIn() {
    const value = drafts[index];
    if (!value || locked) return;
    const result = await m.submitAnswer(index, value);
    if (result === "late") setNotice("Too late: that question had already closed.");
    else if (result === "failed") setNotice("Couldn't save your answer. Check your connection and try again.");
    else setNotice(null);
  }

  if (!question) {
    return (
      <Shell>
        <p className="section__lede">This question isn't available in your app version yet. Refresh the page to update.</p>
      </Shell>
    );
  }

  const lowTime = secondsLeft <= 10;

  return (
    <section className="section sat-workspace">
      <div className="section__inner">
        <div className="sat-workspace__head">
          <h1 className="section__title">SAT Math 1v1</h1>
          <span className="sat-workspace__progress-label">
            Question {index + 1} of {total}
          </span>
        </div>

        <div className={`math-timer ${lowTime ? "math-timer--low" : ""}`} role="timer" aria-label={`${secondsLeft} seconds left`}>
          <div className="math-timer__bar" style={{ width: `${Math.round(fractionLeft * 100)}%` }} />
          <span className="math-timer__text">{secondsLeft}s</span>
        </div>

        <PresencePill name={otherName} connected={otherConnected} />
        <ConnectionBanner online={m.online} />

        <div className="sat-question-card math-q">
          <header className="math-q__meta">
            <span className="math-q__number">Question {index + 1}</span>
            <span className={`math-badge math-badge--${question.difficulty}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
            <span className="math-q__topic">{question.topic}</span>
          </header>

          <div className="sat-question-card__prompt math-q__prompt">
            <MathText text={question.prompt} />
          </div>

          {question.type === "mc" ? (
            <div className="sat-question-card__options">
              {question.options.map((opt) => {
                const chosen = locked ? locked === opt.id : drafts[index] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`sat-option ${chosen ? "sat-option--selected" : ""}`}
                    disabled={!!locked}
                    aria-pressed={chosen}
                    onClick={() => setDrafts((d) => ({ ...d, [index]: opt.id }))}
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
              <label htmlFor="sm-spr">Your answer</label>
              <input
                id="sm-spr"
                value={locked || drafts[index] || ""}
                disabled={!!locked}
                onChange={(e) => setDrafts((d) => ({ ...d, [index]: e.target.value.trim() }))}
              />
            </div>
          )}

          {locked ? (
            <p className="math-locked" role="status">
              Answer locked in ({locked}). Waiting for the next question…
            </p>
          ) : (
            <>
              <button type="button" className="btn btn--accent" disabled={!drafts[index]} onClick={lockIn}>
                Lock in answer
              </button>
              <p className="math-field-hint">If time runs out, your selected answer is submitted automatically.</p>
            </>
          )}
          {notice && <p className="signin__status signin__status--error">{notice}</p>}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------- results
function Results({ m, match, isHost, otherName }) {
  const myScore = isHost ? match.host_score : match.opponent_score;
  const theirScore = isHost ? match.opponent_score : match.host_score;
  const total = match.question_count;
  const otherId = isHost ? match.opponent_id : match.host_id;

  let verdict = "It's a tie!";
  if (myScore > theirScore) verdict = "You won! 🎉";
  else if (myScore < theirScore) verdict = `${otherName} won this one.`;

  const rows = (match.question_ids || []).map((qid, i) => {
    const mine = (m.results || []).find((r) => r.user_id === m.userId && r.question_index === i);
    const theirs = (m.results || []).find((r) => r.user_id === otherId && r.question_index === i);
    return { i, q: getSatMathQuestion(qid), mine, theirs };
  });

  return (
    <Shell>
      <h1 className="signin__title">{verdict}</h1>
      <div className="sat-challenge__results-row">
        <div className="sat-challenge__results-score">
          <span className="sat-challenge__results-label">You</span>
          <span className="sat-challenge__results-value">
            {myScore}/{total}
          </span>
        </div>
        <div className="sat-challenge__results-score">
          <span className="sat-challenge__results-label">{otherName}</span>
          <span className="sat-challenge__results-value">
            {theirScore}/{total}
          </span>
        </div>
      </div>

      <h2 className="math-review__title">Question review</h2>
      <ol className="math-review">
        {rows.map(({ i, q, mine, theirs }) => (
          <li key={i} className="math-review__item">
            <span className="math-review__q">
              {i + 1}. {q ? q.topic : "Question"}
              {q && <span className="math-review__correct"> · correct: {q.answer}</span>}
            </span>
            <span className={`math-review__ans ${mine ? (mine.is_correct ? "math-review__ans--ok" : "math-review__ans--bad") : ""}`}>
              You: {mine ? `${mine.answer} ${mine.is_correct ? "✓" : "✗"}` : "no answer"}
            </span>
            <span className={`math-review__ans ${theirs ? (theirs.is_correct ? "math-review__ans--ok" : "math-review__ans--bad") : ""}`}>
              {otherName}: {theirs ? `${theirs.answer} ${theirs.is_correct ? "✓" : "✗"}` : "no answer"}
            </span>
          </li>
        ))}
      </ol>

      <button type="button" className="btn btn--accent" onClick={m.resetLocal} style={{ marginTop: 16 }}>
        Play again
      </button>
    </Shell>
  );
}
