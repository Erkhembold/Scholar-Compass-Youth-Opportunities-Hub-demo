import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useSatMatch } from "../hooks/useSatMatch.js";
import { useSatProgress } from "../hooks/useSatProgress.js";
import { getAllSatQuestionsFlat, findSatQuestionById } from "../data/satQuestions.js";
import { satPracticeHref } from "../router.js";

const QUESTION_COUNT_OPTIONS = [5, 10, 15];
const TIME_OPTIONS = [15, 20, 30];

function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SatChallengePage({ matchId }) {
  const { user, loading } = useAuth();
  const { recordAnswer } = useSatProgress();
  const {
    match,
    error,
    busy,
    resuming,
    createMatch,
    joinMatch,
    cancelMatch,
    startMatch,
    submitResult,
    leaveToLanding,
  } = useSatMatch(matchId);

  if (loading) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">Loading…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">You're not signed in</h1>
          <p className="section__lede">
            <a href="#/signin">Sign in</a> to challenge another student to a 1v1 SAT match.
          </p>
        </div>
      </section>
    );
  }

  if (resuming) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">Reconnecting to your match…</p>
        </div>
      </section>
    );
  }

  if (!match) {
    return <ChallengeLanding onCreate={createMatch} onJoin={joinMatch} busy={busy} error={error} />;
  }

  const isHost = match.host_id === user.id;
  const opponentJoined = !!match.opponent_id;
  const started = !!match.started_at;
  const bothFinished = match.host_finished && match.opponent_finished;

  async function handleStart() {
    const pool = getAllSatQuestionsFlat();
    const chosen = shuffled(pool).slice(0, match.question_count);
    await startMatch(chosen);
  }

  async function handleFinish(score) {
    await submitResult({ isHost, score });
  }

  if (!opponentJoined) {
    return <LobbyWaiting match={match} onCancel={cancelMatch} />;
  }

  if (!started) {
    return <ReadyToStart match={match} isHost={isHost} onStart={handleStart} busy={busy} onCancel={cancelMatch} />;
  }

  if (!bothFinished) {
    return (
      <PlayView
        match={match}
        isHost={isHost}
        recordAnswer={recordAnswer}
        onFinish={handleFinish}
      />
    );
  }

  return <ResultsView match={match} isHost={isHost} onPlayAgain={leaveToLanding} />;
}

function ChallengeShell({ children }) {
  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card sat-challenge__card">
          <a className="detail__back" href={satPracticeHref("craft-and-structure")}>
            ← Back to SAT
          </a>
          {children}
        </div>
      </div>
    </section>
  );
}

function ChallengeLanding({ onCreate, onJoin, busy, error }) {
  const [tab, setTab] = useState("create");
  const [questionCount, setQuestionCount] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [pin, setPin] = useState("");

  return (
    <ChallengeShell>
      <h1 className="signin__title">SAT 1v1 Challenge</h1>
      <p className="signin__lede">
        Go head-to-head with another student on the same set of SAT questions, under a shared
        timer.
      </p>

      <div className="signin__tabs">
        <button
          type="button"
          className={`signin__tab ${tab === "create" ? "signin__tab--active" : ""}`}
          onClick={() => setTab("create")}
        >
          Create a match
        </button>
        <button
          type="button"
          className={`signin__tab ${tab === "join" ? "signin__tab--active" : ""}`}
          onClick={() => setTab("join")}
        >
          Join with a PIN
        </button>
      </div>

      {error && <p className="signin__status signin__status--error">{error}</p>}

      {tab === "create" ? (
        <form
          className="signin__form"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate({ questionCount, timePerQuestion });
          }}
        >
          <div className="signin__field">
            <label htmlFor="challenge-question-count">Number of questions</label>
            <select
              id="challenge-question-count"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
          </div>

          <div className="signin__field">
            <label htmlFor="challenge-time">Time per question</label>
            <select
              id="challenge-time"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
            >
              {TIME_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} seconds
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn--accent signin__submit" disabled={busy}>
            {busy ? "Creating…" : "Create match"}
          </button>
        </form>
      ) : (
        <form
          className="signin__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (pin.trim().length === 4) onJoin(pin.trim());
          }}
        >
          <div className="signin__field">
            <label htmlFor="challenge-pin">4-digit PIN</label>
            <input
              id="challenge-pin"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
          <button type="submit" className="btn btn--accent signin__submit" disabled={busy || pin.length !== 4}>
            {busy ? "Joining…" : "Join match"}
          </button>
        </form>
      )}
    </ChallengeShell>
  );
}

function LobbyWaiting({ match, onCancel }) {
  return (
    <ChallengeShell>
      <h1 className="signin__title">Waiting for your opponent</h1>
      <p className="signin__lede">Share this PIN with your friend so they can join.</p>
      <div className="sat-challenge__pin">{match.pin}</div>
      <p className="sat-challenge__waiting-note">
        {match.question_count} questions · {match.time_per_question_seconds}s each — watching for
        them to join…
      </p>
      <button type="button" className="btn btn--ghost" onClick={onCancel}>
        Cancel match
      </button>
    </ChallengeShell>
  );
}

function ReadyToStart({ match, isHost, onStart, busy, onCancel }) {
  const otherName = isHost ? match.opponent_name : match.host_name;
  return (
    <ChallengeShell>
      <h1 className="signin__title">{otherName || "Your opponent"} is here!</h1>
      <p className="signin__lede">
        {match.question_count} questions · {match.time_per_question_seconds} seconds each. Both
        players see the same questions at the same time.
      </p>
      {isHost ? (
        <button type="button" className="btn btn--accent" onClick={onStart} disabled={busy}>
          {busy ? "Starting…" : "Start match"}
        </button>
      ) : (
        <p className="sat-challenge__waiting-note">Waiting for {match.host_name || "the host"} to start…</p>
      )}
      <button type="button" className="btn btn--ghost" style={{ marginTop: 12 }} onClick={onCancel}>
        Leave match
      </button>
    </ChallengeShell>
  );
}

function PlayView({ match, isHost, recordAnswer, onFinish }) {
  const questionRefs = match.question_ids || [];
  const total = questionRefs.length;
  const perQuestion = match.time_per_question_seconds;
  const startedAt = new Date(match.started_at).getTime();

  const [now, setNow] = useState(Date.now());
  const [selected, setSelected] = useState(null);
  const scoreRef = useRef(0);
  const scoredIndexRef = useRef(-1);
  const finishedRef = useRef(false);

  const ownFinished = isHost ? match.host_finished : match.opponent_finished;
  const opponentFinished = isHost ? match.opponent_finished : match.host_finished;
  const opponentName = (isHost ? match.opponent_name : match.host_name) || "Your opponent";

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  const elapsedSeconds = Math.max(0, (now - startedAt) / 1000);
  const rawIndex = Math.floor(elapsedSeconds / perQuestion);
  const index = Math.min(rawIndex, total - 1);
  const timeLeft = Math.max(0, Math.ceil(perQuestion - (elapsedSeconds % perQuestion)));
  const isOver = rawIndex >= total;

  // Score/record the question we just moved past, exactly once.
  useEffect(() => {
    if (ownFinished || finishedRef.current) return;
    const indexToScore = isOver ? total - 1 : index - 1;
    if (indexToScore < 0 || indexToScore <= scoredIndexRef.current) return;
    const ref = questionRefs[indexToScore];
    if (!ref) return;
    const q = findSatQuestionById(ref.id);
    if (!q) return;
    scoredIndexRef.current = indexToScore;
    if (selected === q.answer) {
      scoreRef.current += 1;
      recordAnswer(q.id, q.category, true);
    } else if (selected) {
      recordAnswer(q.id, q.category, false);
    }
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isOver]);

  useEffect(() => {
    if (isOver && !ownFinished && !finishedRef.current) {
      finishedRef.current = true;
      onFinish(scoreRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver, ownFinished]);

  if (ownFinished || isOver) {
    return (
      <ChallengeShell>
        <h1 className="signin__title">Nice work!</h1>
        <p className="signin__lede">
          You scored {isHost ? match.host_score : match.opponent_score} out of {total}.
        </p>
        <p className="sat-challenge__waiting-note">
          {opponentFinished ? "Getting results…" : `Waiting for ${opponentName} to finish…`}
        </p>
      </ChallengeShell>
    );
  }

  const currentRef = questionRefs[index];
  const q = currentRef ? findSatQuestionById(currentRef.id) : null;

  if (!q) {
    return (
      <ChallengeShell>
        <p className="section__lede">Loading question…</p>
      </ChallengeShell>
    );
  }

  return (
    <section className="section sat-workspace">
      <div className="section__inner">
        <div className="sat-workspace__head">
          <h1 className="section__title">1v1 Challenge</h1>
          <span className="sat-workspace__progress-label">
            Question {index + 1} of {total} · {timeLeft}s left
          </span>
        </div>

        <div className="sat-question-card">
          <p className="sat-question-card__passage">{q.passage}</p>
          <p className="sat-question-card__prompt">{q.prompt}</p>

          <div className="sat-question-card__options">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`sat-option ${selected === opt.id ? "sat-option--selected" : ""}`}
                onClick={() => setSelected(opt.id)}
              >
                <span className="sat-option__id">{opt.id}</span>
                <span className="sat-option__text">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultsView({ match, isHost, onPlayAgain }) {
  const myScore = isHost ? match.host_score : match.opponent_score;
  const theirScore = isHost ? match.opponent_score : match.host_score;
  const theirName = (isHost ? match.opponent_name : match.host_name) || "Your opponent";
  const total = (match.question_ids || []).length;

  let verdict = "It's a tie!";
  if (myScore > theirScore) verdict = "You won! 🎉";
  else if (myScore < theirScore) verdict = `${theirName} won this one.`;

  return (
    <ChallengeShell>
      <h1 className="signin__title">{verdict}</h1>
      <div className="sat-challenge__results-row">
        <div className="sat-challenge__results-score">
          <span className="sat-challenge__results-label">You</span>
          <span className="sat-challenge__results-value">
            {myScore}/{total}
          </span>
        </div>
        <div className="sat-challenge__results-score">
          <span className="sat-challenge__results-label">{theirName}</span>
          <span className="sat-challenge__results-value">
            {theirScore}/{total}
          </span>
        </div>
      </div>
      <button type="button" className="btn btn--accent" onClick={onPlayAgain} style={{ marginTop: 16 }}>
        Play again
      </button>
    </ChallengeShell>
  );
}
