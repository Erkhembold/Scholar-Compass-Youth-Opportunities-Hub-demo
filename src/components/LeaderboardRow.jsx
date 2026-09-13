const ZONE_LABEL = {
  promotion: "Promotion",
  stay: "Stays",
  relegation: "Relegation",
};

export default function LeaderboardRow({ player, zone, isBronzeFloor }) {
  const initial = player.name.trim().charAt(0).toUpperCase();
  const label = isBronzeFloor ? "Stays in Bronze" : ZONE_LABEL[zone];

  return (
    <div
      className={`leaderboard-row leaderboard-row--${zone} ${
        !player.isDemo ? "leaderboard-row--me" : ""
      }`}
    >
      <span className="leaderboard-row__rank">{player.rank}</span>
      <span className="leaderboard-row__avatar" aria-hidden="true">
        {initial}
      </span>
      <span className="leaderboard-row__name">
        {player.name}
        {!player.isDemo && <span className="leaderboard-row__you"> (You)</span>}
      </span>
      <span className="leaderboard-row__xp">{player.xp.toLocaleString()} XP</span>
      <span className={`leaderboard-row__zone leaderboard-row__zone--${zone}`}>{label}</span>
    </div>
  );
}
