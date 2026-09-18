import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { LEAGUE_BY_ID } from "../data/leagues.js";
import { zoneForRank, processWeeklyReset, LEAGUE_CAPACITY } from "../utils/leaderboard.js";
import { useLeagueBoard } from "../hooks/useLeagueBoard.js";
import LeagueCountdown from "../components/LeagueCountdown.jsx";
import LeaderboardRow from "../components/LeaderboardRow.jsx";
import EmptyLeaderboardSlot from "../components/EmptyLeaderboardSlot.jsx";

// Deliberately has NO league selector. A user can only ever see the
// leaderboard of the league they currently belong to — there is no
// client-side control to browse another league, and even if someone
// forged a request for one, Supabase's row-level security on
// leaderboard_entries only returns rows matching the caller's own
// current_league (see supabase/leaderboard_secure.sql). This page can't
// "leak" other leagues because it never asks for anything but the
// signed-in user's own.
export default function LeaderboardPage() {
  const { user, profile, loading } = useAuth();
  const [resolvedProfile, setResolvedProfile] = useState(profile);

  useEffect(() => {
    let cancelled = false;
    if (!user || !profile || !supabase) {
      setResolvedProfile(profile);
      return;
    }
    processWeeklyReset(supabase, { id: user.id, ...profile }).then((updated) => {
      if (!cancelled) setResolvedProfile(updated);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.last_processed_week]);

  const myLeagueId = user ? resolvedProfile?.current_league || "bronze" : null;
  const league = myLeagueId ? LEAGUE_BY_ID[myLeagueId] : null;

  const meEntry = user
    ? { id: user.id, name: resolvedProfile?.name || "You", xp: resolvedProfile?.weekly_xp || 0 }
    : null;

  const { board, loading: boardLoading } = useLeagueBoard(myLeagueId, meEntry);
  const myRow = user ? board.find((p) => p.id === user.id) : null;
  const emptySeats = Math.max(0, LEAGUE_CAPACITY - board.length);

  if (loading) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section leaderboard-page">
      <div className="section__inner">
        <div className="section__head">
          <h1 className="section__title">Leaderboard</h1>
          <p className="section__lede">
            Compete against other students in your league every week. Finish in the top 15 to
            move up a league — land in the bottom 5 and you'll drop to the one below.
          </p>
        </div>

        {!user ? (
          <p className="leaderboard-page__signin-note">
            <a href="#/signin">Sign in</a> to see your league and compete — everyone starts in
            Bronze.
          </p>
        ) : (
          <>
            <LeagueCountdown />

            <div
              className="league-header"
              style={{ "--league-color": league.primary, "--league-soft": league.soft }}
            >
              <div className="league-header__badge">{league.name}</div>
              <h2 className="league-header__title">{league.name} League</h2>
              {myRow ? (
                <div className="league-header__stats">
                  <div>
                    <span className="league-header__stat-value">#{myRow.rank}</span>
                    <span className="league-header__stat-label">Your rank</span>
                  </div>
                  <div>
                    <span className="league-header__stat-value">
                      {myRow.xp.toLocaleString()}
                    </span>
                    <span className="league-header__stat-label">Weekly XP</span>
                  </div>
                  <div>
                    <span className="league-header__stat-value">
                      {zoneForRank(myRow.rank, board.length) === "promotion"
                        ? "Promotion zone"
                        : zoneForRank(myRow.rank, board.length) === "relegation"
                        ? league.id === "bronze"
                          ? "Stays in Bronze"
                          : "Relegation zone"
                        : "Safe zone"}
                    </span>
                    <span className="league-header__stat-label">Status</span>
                  </div>
                  <div>
                    <span className="league-header__stat-value">
                      {board.length} / {LEAGUE_CAPACITY}
                    </span>
                    <span className="league-header__stat-label">Seats filled</span>
                  </div>
                </div>
              ) : (
                <p className="league-header__preview-note">Loading your rank…</p>
              )}
            </div>

            <div className="leaderboard-legend">
              <span className="leaderboard-legend__item leaderboard-legend__item--promotion">
                Top 15 · Promotion
              </span>
              <span className="leaderboard-legend__item leaderboard-legend__item--stay">
                16–35 · Stay
              </span>
              <span className="leaderboard-legend__item leaderboard-legend__item--relegation">
                36–40 · {league.id === "bronze" ? "Stay in Bronze" : "Relegation"}
              </span>
            </div>

            <div className="leaderboard-list" role="list" aria-busy={boardLoading}>
              {boardLoading ? (
                <p className="section__lede">Loading your league…</p>
              ) : (
                <>
                  {board.map((player) => (
                    <LeaderboardRow
                      key={player.id}
                      player={player}
                      zone={zoneForRank(player.rank, board.length)}
                      isMe={!!user && player.id === user.id}
                      isBronzeFloor={
                        league.id === "bronze" &&
                        zoneForRank(player.rank, board.length) === "relegation"
                      }
                    />
                  ))}
                  {Array.from({ length: emptySeats }, (_, i) => (
                    <EmptyLeaderboardSlot key={`empty-${i}`} position={board.length + i + 1} />
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
