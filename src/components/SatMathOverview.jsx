import { SAT_MATH_QUESTIONS } from "../data/satMathQuestions.js";
import { useProgressData } from "../hooks/useProgressData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { satMathExercisesHref, satMathChallengeHref } from "../router.js";

// SAT Math's own overview card — deliberately separate from
// SatCategoryOverview (SAT English), not nested inside it. Mirrors its
// layout (action cards, overall bar, per-topic bars) but SAT Math's numbers
// are accuracy-on-attempts, not completion, since sat_math_exercise_attempts
// is a per-attempt log rather than sat_progress's sticky per-question
// mastery flag — see utils/progress.js for why.
export default function SatMathOverview() {
  const { user } = useAuth();
  const { progress, loading } = useProgressData();

  const math = progress?.sat?.math;
  const totalQuestions = SAT_MATH_QUESTIONS.length;

  return (
    <section className="section practice-picker sat-math-overview" aria-labelledby="sat-math-practice-heading">
      <div className="section__inner">
        <div className="sat-overview__card">
          <h2 id="sat-math-practice-heading" className="practice-picker__eyebrow">
            SAT MATH PRACTICE
          </h2>

          <div className="category-actions">
            <a href={satMathExercisesHref()} className="category-action-card category-action-card--math">
              <span className="category-action-icon" aria-hidden="true">
                ➗
              </span>
              <span className="category-action-text">
                <span className="category-action-title">SAT Math Exercises</span>
                <span className="category-action-sub">
                  {totalQuestions} questions with filters and explanations
                </span>
              </span>
              <span className="category-action-arrow" aria-hidden="true">
                →
              </span>
            </a>

            <a href={satMathChallengeHref()} className="category-action-card category-action-card--math">
              <span className="category-action-icon" aria-hidden="true">
                🧮
              </span>
              <span className="category-action-text">
                <span className="category-action-title">SAT Math 1v1</span>
                <span className="category-action-sub">Race a friend on the same math questions</span>
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

          {user && !loading && math && (
            <>
              <div className="sat-overview__total">
                <span className="sat-overview__total-label">Overall accuracy</span>
                <span className="sat-overview__total-value">
                  {math.attempted > 0
                    ? `${math.correct}/${math.attempted} (${Math.round(math.accuracy * 100)}%)`
                    : "No attempts yet"}
                </span>
              </div>
              <div className="sat-overview__bar">
                <div
                  className="sat-overview__bar-fill"
                  style={{ width: `${math.attempted > 0 ? math.accuracy * 100 : 0}%` }}
                />
              </div>

              <ul className="sat-overview__list">
                {math.domains.map((d) => (
                  <li key={d.id} className="sat-overview__row">
                    <a className="sat-overview__row-link" href={satMathExercisesHref(d.id)}>
                      <span className="sat-overview__row-label">{d.label}</span>
                      <span className="sat-overview__row-count">
                        {d.attempted > 0 ? `${d.correct}/${d.attempted}` : "—"}
                      </span>
                      <div className="sat-overview__row-bar">
                        <div
                          className="sat-overview__row-bar-fill"
                          style={{ width: `${d.attempted > 0 ? d.accuracy * 100 : 0}%` }}
                        />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
