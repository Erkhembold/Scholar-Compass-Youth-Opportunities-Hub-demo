import { useProgressData } from "../hooks/useProgressData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ieltsBeginnerGuideHref, ieltsChallengeHref, ieltsExercisesHref } from "../router.js";
import { IELTS_READING_EXERCISES } from "../data/ieltsReadingExercises.js";
import { IELTS_WRITING_EXERCISES } from "../data/ieltsWritingExercises.js";

// The IELTS page's practice overview: Lessons + 1v1 shortcuts, then the
// Reading and Writing exercise rows (the way into the exercises) with an
// overall accuracy bar. Mirrors SatCategoryOverview / SatMathOverview.
//
// The Reading/Writing rows always render, signed in or not — they're the
// only entry point to the exercises, which work without an account. Only
// the accuracy numbers need progress data.
function SectionRow({ label, href, available, stats }) {
  const hasAttempts = stats && stats.attempted > 0;
  return (
    <li className="sat-overview__row">
      <a className="sat-overview__row-link" href={href}>
        <span className="sat-overview__row-label">{label}</span>
        <span className="sat-overview__row-count">
          {hasAttempts ? `${stats.correct}/${stats.attempted}` : `${available} available`}
        </span>
        <div className="sat-overview__row-bar">
          <div className="sat-overview__row-bar-fill" style={{ width: `${hasAttempts ? stats.accuracy * 100 : 0}%` }} />
        </div>
      </a>
    </li>
  );
}

export default function IeltsPracticeOverview() {
  const { user } = useAuth();
  const { progress, loading } = useProgressData();

  const ex = user && !loading ? progress?.ielts?.exercises : null;

  return (
    <div className="sat-overview__card ielts-overview">
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

      {ex && (
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
        </>
      )}

      <ul className="sat-overview__list">
        <SectionRow
          label="Reading exercises"
          href={ieltsExercisesHref("reading")}
          available={IELTS_READING_EXERCISES.length}
          stats={ex?.reading}
        />
        <SectionRow
          label="Writing exercises"
          href={ieltsExercisesHref("writing")}
          available={IELTS_WRITING_EXERCISES.length}
          stats={ex?.writing}
        />
      </ul>
    </div>
  );
}
