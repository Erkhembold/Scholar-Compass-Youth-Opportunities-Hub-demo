// Highlighted verified-score card shown under a user's leaderboard row and on
// profile pages. Purely presentational: scores come from public.verified_scores,
// which users can't write to.
export default function UserScoreBadge({ label, score, testType, sublabel, compact = false }) {
  if (score === undefined || score === null || score === "") return null;
  return (
    <div className={`score-badge ${compact ? "score-badge--compact" : ""}`} role="note">
      <span className="score-badge__label">{label || `Verified ${testType || ""} score`}</span>
      <span className="score-badge__score">{score}</span>
      <span className="score-badge__sub">{sublabel || (testType ? `${testType} Overall` : "")}</span>
    </div>
  );
}

export function UserScoreBadges({ scores, compact }) {
  if (!Array.isArray(scores) || scores.length === 0) return null;
  return (
    <div className="score-badges">
      {scores.map((s) => (
        <UserScoreBadge
          key={s.test_type}
          label={s.label}
          score={s.score}
          testType={s.test_type}
          sublabel={s.sublabel}
          compact={compact}
        />
      ))}
    </div>
  );
}
