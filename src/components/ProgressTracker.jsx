import { useProgressData } from "../hooks/useProgressData.js";
import { satMathExercisesHref } from "../router.js";

function pct(rate) {
  return rate == null ? "—" : `${Math.round(rate * 100)}%`;
}

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

  return (
    <div className="progress-tracker">
      <h2 className="progress-tracker__heading">Your progress</h2>

      <div className="progress-subject">
        <div className="progress-subject__head">
          <span className="progress-subject__name">SAT</span>
          <span className="progress-subject__target">
            Target: {sat.targetScore ?? <a href="#/profile">Set a target</a>}
          </span>
        </div>
        {!sat.hasPractice ? (
          <p className="progress-subject__empty">
            No practice yet. <a href="#/category/sat">Take your first SAT questions</a> to
            start tracking progress.
          </p>
        ) : (
          <>
            <p className="progress-subject__note">
              {sat.questionsAnswered} question{sat.questionsAnswered === 1 ? "" : "s"} answered so far. This is real practice
              performance, not an official SAT score — there's no diagnostic test yet.
            </p>
            <div className="progress-rows">
              <div className="progress-row">
                <span>Reading &amp; Writing</span>
                <span>
                  {sat.rw.seen > 0 ? `Mastered ${sat.rw.mastered}/${sat.rw.seen} questions tried` : "No practice yet"}
                </span>
              </div>
              <div className="progress-row">
                <span>Math</span>
                <span>
                  {sat.math.attempted > 0 ? (
                    <>
                      {pct(sat.math.accuracy)} accuracy · {sat.math.attempted} question{sat.math.attempted === 1 ? "" : "s"}
                    </>
                  ) : (
                    <>No practice yet — <a href={satMathExercisesHref()}>try SAT Math</a></>
                  )}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="progress-subject">
        <div className="progress-subject__head">
          <span className="progress-subject__name">IELTS</span>
          <span className="progress-subject__target">
            Target: {ielts.targetBand ?? <a href="#/profile">Set a target</a>}
          </span>
        </div>
        {!ielts.hasPractice ? (
          <p className="progress-subject__empty">
            No practice yet. <a href="#/ielts">Take a mock test</a> to start tracking progress.
          </p>
        ) : (
          <div className="progress-rows">
            <div className="progress-row">
              <span>Latest practice test</span>
              <span>{ielts.latestBand != null ? `Band ${ielts.latestBand}` : "No mock test yet"}</span>
            </div>
            <div className="progress-row">
              <span>Reading exercises</span>
              <span>
                {ielts.exercises.attempted > 0
                  ? `${pct(ielts.exercises.itemsTotal ? ielts.exercises.itemsCorrect / ielts.exercises.itemsTotal : null)} correct · ${ielts.exercises.itemsTotal} question${ielts.exercises.itemsTotal === 1 ? "" : "s"}`
                  : "No exercises yet"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
