const ZONE_LABEL = {
  promotion: "Promotion",
  stay: "Stays",
  relegation: "Relegation",
};

import Avatar from "./Avatar.jsx";
import { publicProfileHref } from "../router.js";

export default function LeaderboardRow({ player, zone, isBronzeFloor, isMe }) {
  const label = isBronzeFloor ? "Stays in Bronze" : ZONE_LABEL[zone];
  // Demo/filler seats have no real id and can't be linked to a profile.
  const canLink = !isMe && !player.isDemo && player.id;

  return (
    <div
      className={`leaderboard-row leaderboard-row--${zone} ${
        isMe ? "leaderboard-row--me" : ""
      }`}
    >
      <span className="leaderboard-row__rank">{player.rank}</span>
      <span className="leaderboard-row__avatar">
        <Avatar path={player.avatarPath} name={player.name} size={30} />
      </span>
      {canLink ? (
        <a className="leaderboard-row__name leaderboard-row__name--link" href={publicProfileHref(player.id)}>
          {player.name}
        </a>
      ) : (
        <span className="leaderboard-row__name">
          {player.name}
          {isMe && <span className="leaderboard-row__you"> (You)</span>}
        </span>
      )}
      <span className="leaderboard-row__xp">{player.xp.toLocaleString()} XP</span>
      <span className={`leaderboard-row__zone leaderboard-row__zone--${zone}`}>{label}</span>
    </div>
  );
}
