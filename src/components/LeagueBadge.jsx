import { LEAGUE_BY_ID } from "../data/leagues.js";

const MEDAL = { Gold: "🥇", Silver: "🥈", Bronze: "🥉" };

// A single weekly achievement badge: placement medal + the color identity
// of the league it was earned in. Reusable both in the small "Weekly
// Achievements" list on the profile and anywhere else a badge needs to
// render (leaderboard results screen, share cards, etc.).
export default function LeagueBadge({ placement, badge, leagueId, week, compact = false }) {
  const league = LEAGUE_BY_ID[leagueId] || LEAGUE_BY_ID.bronze;

  return (
    <div
      className={`league-badge ${compact ? "league-badge--compact" : ""}`}
      style={{
        "--badge-color": league.primary,
        "--badge-soft": league.soft,
      }}
      title={`${badge} — ${league.name} League${week != null ? `, week ${week}` : ""}`}
    >
      <span className="league-badge__medal" aria-hidden="true">
        {MEDAL[badge] || "🏅"}
      </span>
      <span className="league-badge__text">
        <span className="league-badge__title">
          {badge} — {league.name}
        </span>
        {!compact && (
          <span className="league-badge__meta">
            #{placement} finish{week != null ? ` · Week ${week}` : ""}
          </span>
        )}
      </span>
    </div>
  );
}
