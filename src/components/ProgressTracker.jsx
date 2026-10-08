import { useProgressData } from "../hooks/useProgressData.js";
import { satMathExercisesHref } from "../router.js";
import SubjectProgressCard from "./SubjectProgressCard.jsx";

const SAT_RW_TOTAL = 80; // SAT_CATEGORIES: 4 x 20 questions — see satQuestions.js
const SAT_MATH_TOTAL = 40; // SAT_MATH_QUESTIONS — see satMathQuestions.js

export default function ProgressTracker() {
  const { progress, loading, isSetUp } = useProgressData();

  if (loading) {
    return (
      <div className="progress-tracker">
        <p className="signin__lede">Loading…</p>
      </div>
    );
  }
  if (!isSetUp || !progress) {
    return (
      <div className="progress-tracker">
        <p className="streak-card__note">Progress tracking isn't switched on yet.</p>
      </div>
    );
  }

  const { sat, ielts } = progress;

  // SAT Reading & Writing: sat_progress is a sticky "ever gotten this one
  // right" flag per question, so a completion ring (mastered out of the
  // full 80-question bank) is honest here.
  const rwPercent = (sat.rw.mastered / SAT_RW_TOTAL) * 100;

  // SAT Math and IELTS exercises are per-attempt logs, not sticky mastery,
  // so their rings show accuracy on what's been attempted rather than a
  // "% of the bank completed" claim the data doesn't support.
  const mathPercent = sat.math.accuracy != null ? sat.math.accuracy * 100 : 0;
  // Reading only — the card is labelled and linked as IELTS Reading, so it
  // shouldn't also absorb Writing-exercise attempts (see summarizeIeltsExercises).
  const ieltsReading = ielts.exercises.reading;
  const ieltsPercent = ieltsReading.attempted ? ieltsReading.accuracy * 100 : 0;

  return (
    <div className="progress-tracker">
      <h2 className="progress-tracker__heading">Your progress</h2>
      <div className="subject-card-row">
        <SubjectProgressCard
          icon="📖"
          title="SAT Reading & Writing"
          percent={rwPercent}
          color="var(--blue-500)"
          centerValue={sat.rw.mastered}
          centerUnit={`/ ${SAT_RW_TOTAL}`}
          ringLabel={`${sat.rw.mastered} of ${SAT_RW_TOTAL} questions mastered`}
          statusLine={
            sat.rw.seen > 0
              ? `${sat.rw.mastered}/${sat.rw.seen} tried questions mastered`
              : "No practice yet"
          }
          href="#/category/sat"
        />
        <SubjectProgressCard
          icon="➗"
          title="SAT Math"
          percent={mathPercent}
          color="var(--streak-active-bg)"
          centerValue={sat.math.accuracy != null ? Math.round(sat.math.accuracy * 100) : "—"}
          centerUnit={sat.math.accuracy != null ? "%" : null}
          ringLabel="SAT Math accuracy"
          statusLine={
            sat.math.attempted > 0
              ? `${sat.math.correct}/${sat.math.attempted} correct`
              : "No practice yet"
          }
          href={satMathExercisesHref()}
        />
        <SubjectProgressCard
          icon="🌍"
          title="IELTS Reading"
          percent={ieltsPercent}
          color="#a855f7"
          centerValue={ieltsReading.attempted ? Math.round(ieltsPercent) : "—"}
          centerUnit={ieltsReading.attempted ? "%" : null}
          ringLabel="IELTS Reading exercise accuracy"
          statusLine={
            ieltsReading.attempted
              ? `${ieltsReading.correct}/${ieltsReading.attempted} correct` +
                (ielts.latestBand != null ? ` · Band ${ielts.latestBand}` : "")
              : "No exercises yet"
          }
          href="#/ielts/exercises/reading"
        />
      </div>
      <p className="progress-tracker__note">
        SAT Reading &amp; Writing shows question mastery out of the full bank. SAT Math and IELTS
        show accuracy on what you've attempted so far — not an official score.
      </p>
    </div>
  );
}
