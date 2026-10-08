import { useProgressData } from "../hooks/useProgressData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ieltsBeginnerGuideHref, ieltsChallengeHref, ieltsExercisesHref } from "../router.js";
import { IELTS_READING_EXERCISES } from "../data/ieltsReadingExercises.js";
import { IELTS_WRITING_EXERCISES } from "../data/ieltsWritingExercises.js";

// IELTS's own progress overview — mirrors SatCategoryOverview /
// SatMathOverview's card (action cards + an overall bar + per-section rows)
// rather than inventing a different pattern. IELTS's natural "domains" are
// Reading and Writing exercises (not a fixed small skill-tag set the way
// SAT Math has 4 domains), so those are the two rows here.
export default function IeltsPracticeOverview() {
  const { user } = useAuth();
  const { progress, loading } = useProgressData();

  const ex = progress?.ielts?.exercises;
  const readingTotal = IELTS_READING_EXERCISES.length;
  const writingTotal = IELTS_WRITING_EXERCISES.length;

  return (
    <div className="section__inner">
      <div className="sat-overview__card">
        <div className="category-actions">
          <a href={ieltsBeginnerGuideHref()} className="category-action-card category-action-card--lessons">
            <span className="category-action-icon" aria-hidden="true">
              📘
            </span>
            <span className="category-action-text">
              <span className="category-action-title">IELTS Lessons</span>
              <span className="category-action-sub">Start with the Beginner Guide</span>
            </span>
            <span className="category-action-arrow" aria-hidden="true">
              →
            </span>
          </a>

          <a href={ieltsChallengeHref()} className="category-action-card category-action-card--challenge">
            <span className="category-action-icon" aria-hidden="true">
              ⚡
            </span>
            <span className="category-action-text">
              <span className="category-action-title">1v1 Challenge</span>
              <span className="category-action-sub">Go head-to-head with a friend</span>
            </span>
            <span className="category-action-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        {!user && (
          <p className="sat-overview__signin-note">
            <a href="#/signin">Sign in</a> to save your progress and earn XP as you go.
          </p>
        )}

        {user && !loading && ex && (
          <>
            <div className="sat-overview__total">
              <span className="sat-overview__total-label">Overall exercise accuracy</span>
              <span className="sat-overview__total-value">
                {ex.attempted > 0
                  ? `${ex.itemsCorrect}/${ex.itemsTotal} (${Math.round((ex.itemsCorrect / Math.max(1, ex.itemsTotal)) * 100)}%)`
                  : "No attempts yet"}
              </span>
            </div>
            <div className="sat-overview__bar">
              <div
                className="sat-overview__bar-fill"
                style={{ width: `${ex.itemsTotal > 0 ? (ex.itemsCorrect / ex.itemsTotal) * 100 : 0}%` }}
              />
            </div>

            <ul className="sat-overview__list">
              <li className="sat-overview__row">
                <a className="sat-overview__row-link" href={ieltsExercisesHref("reading")}>
                  <span className="sat-overview__row-label">Reading exercises</span>
                  <span className="sat-overview__row-count">
                    {ex.reading.attempted > 0 ? `${ex.reading.correct}/${ex.reading.attempted}` : `${readingTotal} available`}
                  </span>
                  <div className="sat-overview__row-bar">
                    <div
                      className="sat-overview__row-bar-fill"
                      style={{ width: `${ex.reading.attempted > 0 ? ex.reading.accuracy * 100 : 0}%` }}
                    />
                  </div>
                </a>
              </li>
              <li className="sat-overview__row">
                <a className="sat-overview__row-link" href={ieltsExercisesHref("writing")}>
                  <span className="sat-overview__row-label">Writing exercises</span>
                  <span className="sat-overview__row-count">
                    {ex.writing.attempted > 0 ? `${ex.writing.correct}/${ex.writing.attempted}` : `${writingTotal} available`}
                  </span>
                  <div className="sat-overview__row-bar">
                    <div
                      className="sat-overview__row-bar-fill"
                      style={{ width: `${ex.writing.attempted > 0 ? ex.writing.accuracy * 100 : 0}%` }}
                    />
                  </div>
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
