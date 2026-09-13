import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { LEAGUES, LEAGUE_BY_ID } from "../data/leagues.js";
import { getWeekInfo, buildLeaderboard, zoneForRank, processWeeklyReset } from "../utils/leaderboard.js";
import LeagueCountdown from "../components/LeagueCountdown.jsx";
import LeaderboardRow from "../components/LeaderboardRow.jsx";

export default function LeaderboardPage() {
  const { user, profile, loading } = useAuth();
  const [resolvedProfile, setResolvedProfile] = useState(profile);
  const [viewLeagueId, setViewLeagueId] = useState(null);
  const { weekNumber } = getWeekInfo();

  // Run the (possibly multi-week) rollover once we have a real profile,
  // then use the *resolved* league/XP for this page rather than the raw
  // (possibly stale) profile straight out of AuthContext.
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

  const myLeagueId = resolvedProfile?.current_league || "bronze";
  const activeLeagueId = viewLeagueId || myLeagueId;
  const league = LEAGUE_BY_ID[activeLeagueId];
  const isOwnLeagueView = activeLeagueId === myLeagueId;

  const meEntry =
    user && isOwnLeagueView
      ? { id: "me", name: resolvedProfile?.name || "You", xp: resolvedProfile?.weekly_xp || 0 }
      : null;

  const board = useMemo(
    () => buildLeaderboard(activeLeagueId, weekNumber, meEntry),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeLeagueId, weekNumber, meEntry?.xp]
  );

  const myRow = board.find((p) => p.id === "me");

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
            Compete against other students every week. Finish in the top 15 to move up a
            league — land in the bottom 5 and you'll drop to the one below.
          </p>
        </div>

        {!user && (
          <p className="leaderboard-page__signin-note">
            <a href="#/signin">Sign in</a> to join the competition — you can still browse every
            league below.
          </p>
        )}

        <LeagueCountdown />

        <div className="league-selector" role="tablist" aria-label="Choose a league to view">
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={l.id === activeLeagueId}
              className={`league-selector__pill ${l.id === activeLeagueId ? "league-selector__pill--active" : ""}`}
              style={{ "--league-color": l.primary }}
              onClick={() => setViewLeagueId(l.id)}
            >
              {l.name}
              {l.id === myLeagueId && user && <span className="league-selector__you">•</span>}
            </button>
          ))}
        </div>

        <div className="league-header" style={{ "--league-color": league.primary, "--league-soft": league.soft }}>
          <div className="league-header__badge">{league.name}</div>
          <h2 className="league-header__title">{league.name} League</h2>
          {isOwnLeagueView && user && myRow ? (
            <div className="league-header__stats">
              <div>
                <span className="league-header__stat-value">#{myRow.rank}</span>
                <span className="league-header__stat-label">Your rank</span>
              </div>
              <div>
                <span className="league-header__stat-value">{myRow.xp.toLocaleString()}</span>
                <span className="league-header__stat-label">Weekly XP</span>
              </div>
              <div>
                <span className="league-header__stat-value">
                  {zoneForRank(myRow.rank) === "promotion"
                    ? "Promotion zone"
                    : zoneForRank(myRow.rank) === "relegation"
                    ? league.id === "bronze"
                      ? "Stays in Bronze"
                      : "Relegation zone"
                    : "Safe zone"}
                </span>
                <span className="league-header__stat-label">Status</span>
              </div>
            </div>
          ) : (
            <p className="league-header__preview-note">
              {isOwnLeagueView ? "Sign in to see your rank here." : "Browsing — this isn't your current league."}
            </p>
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

        <div className="leaderboard-list" role="list">
          {board.map((player) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              zone={zoneForRank(player.rank, board.length)}
              isBronzeFloor={league.id === "bronze" && zoneForRank(player.rank, board.length) === "relegation"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
