// An unoccupied league position. Deliberately styled to look nothing
// like a real row — no name, no avatar, no XP, no zone label — so it can
// never be mistaken for a person. `position` is just the seat number
// (1-40), not a competitive rank; empty seats never factor into
// promotion/relegation math.
export default function EmptyLeaderboardSlot({ position }) {
  return (
    <div className="leaderboard-row leaderboard-row--empty" aria-hidden="true">
      <span className="leaderboard-row__rank leaderboard-row__rank--empty">{position}</span>
      <span className="leaderboard-row__avatar leaderboard-row__avatar--empty">—</span>
      <span className="leaderboard-row__name leaderboard-row__name--empty">Available slot</span>
      <span className="leaderboard-row__xp leaderboard-row__xp--empty">—</span>
    </div>
  );
}
