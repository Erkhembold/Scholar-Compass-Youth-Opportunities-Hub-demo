import { SAT_CATEGORIES, SAT_QUESTIONS } from "../data/satQuestions.js";
import { useSatProgress } from "../hooks/useSatProgress.js";
import { satPracticeHref } from "../router.js";

export default function SatCategoryOverview() {
  const { masteredCount, isSignedIn } = useSatProgress();

  const totalQuestions = SAT_CATEGORIES.reduce(
    (sum, c) => sum + SAT_QUESTIONS[c.id].length,
    0
  );
  const totalMastered = SAT_CATEGORIES.reduce((sum, c) => sum + masteredCount(c.id), 0);

  return (
    <section className="section practice-picker" aria-labelledby="sat-practice-heading">
      <div className="section__inner">
        <div className="sat-overview__card">
          <h2 id="sat-practice-heading" className="practice-picker__eyebrow">
            SAT ENGLISH PRACTICE
          </h2>

          {!isSignedIn && (
            <p className="sat-overview__signin-note">
              <a href="#/signin">Sign in</a> to save your progress and earn XP as you go.
            </p>
          )}

          <div className="sat-overview__total">
            <span className="sat-overview__total-label">Overall progress</span>
            <span className="sat-overview__total-value">
              {totalMastered}/{totalQuestions} ({Math.round((totalMastered / totalQuestions) * 100)}%)
            </span>
          </div>
          <div className="sat-overview__bar">
            <div
              className="sat-overview__bar-fill"
              style={{ width: `${(totalMastered / totalQuestions) * 100}%` }}
            />
          </div>

          <ul className="sat-overview__list">
            {SAT_CATEGORIES.map((cat) => {
              const total = SAT_QUESTIONS[cat.id].length;
              const mastered = masteredCount(cat.id);
              return (
                <li key={cat.id} className="sat-overview__row">
                  <a className="sat-overview__row-link" href={satPracticeHref(cat.id)}>
                    <span className="sat-overview__row-label">{cat.label}</span>
                    <span className="sat-overview__row-count">
                      {mastered}/{total}
                    </span>
                    <div className="sat-overview__row-bar">
                      <div
                        className="sat-overview__row-bar-fill"
                        style={{ width: `${(mastered / total) * 100}%` }}
                      />
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
