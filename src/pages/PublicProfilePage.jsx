import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import Avatar from "../components/Avatar.jsx";
import FriendButton from "../components/FriendButton.jsx";
import LeagueBadge from "../components/LeagueBadge.jsx";
import { LEAGUE_BY_ID } from "../data/leagues.js";
import { leaderboardHref, profileHref } from "../router.js";

// Another student's card: name, photo, streak, target scores, league and
// rank, weekly-achievement badges, plus the friend button — nothing else,
// and never editable here. What's actually shown is decided
// entirely by public.get_public_profile() in
// supabase/public_profiles_and_avatars.sql: it returns exactly these
// fields, returns nothing at all if the profile doesn't exist or its
// owner turned visibility off, and only works for a signed-in viewer.
// This page has no way to ask it for more.
export default function PublicProfilePage({ id }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(undefined); // undefined = loading, null = not found/private
  const [notSetUp, setNotSetUp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user || !supabase) return undefined;
    setData(undefined);
    supabase
      .rpc("get_public_profile", { p_id: id })
      .then(({ data: result, error }) => {
        if (cancelled) return;
        if (error) {
          setNotSetUp(true);
          setData(null);
          return;
        }
        setData(result);
      });
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  if (authLoading) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">Loading…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">You're not signed in</h1>
          <p className="section__lede">
            <a href="#/signin">Sign in</a> to view student profiles.
          </p>
        </div>
      </section>
    );
  }

  if (id === user.id) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">
            That's you — see your full profile <a href={profileHref()}>here</a>.
          </p>
        </div>
      </section>
    );
  }

  if (data === undefined) {
    return (
      <section className="section">
        <div className="section__inner">
          <p className="section__lede">Loading…</p>
        </div>
      </section>
    );
  }

  if (data === null) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Profile not available</h1>
          <p className="section__lede">
            {notSetUp
              ? "Student profiles aren't switched on yet."
              : "This student's profile doesn't exist or is set to private."}
          </p>
        </div>
      </section>
    );
  }

  const hasStreak = data.current_streak > 0;
  // league fields only exist once supabase/friends.sql has been run
  const league = data.current_league ? LEAGUE_BY_ID[data.current_league] : null;
  const badges = Array.isArray(data.badges) ? data.badges : [];

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card public-profile-card">
          <Avatar path={data.avatar_path} name={data.name} size={88} />
          <h1 className="signin__title" style={{ marginTop: 16 }}>
            {data.name || "ScholarCompass student"}
          </h1>
          {league && (
            <p className="public-profile-league" data-league={league.id}>
              <span className="public-profile-league__chip">{league.name} League</span>
              {data.league_rank ? (
                <span className="public-profile-league__rank">
                  Rank #{data.league_rank} of {data.league_size}
                </span>
              ) : null}
            </p>
          )}
          <FriendButton userId={data.id} />
        </div>

        <div className="streak-card" data-state={hasStreak ? "done_today" : "none"} style={{ marginTop: 24 }}>
          <div className="streak-card__head">
            <span className="streak-card__flame" aria-hidden="true">
              🔥
            </span>
            <div>
              <p className="streak-card__headline">{data.current_streak} DAY STREAK</p>
            </div>
          </div>
          <div className="streak-card__stats">
            <div>
              <span className="streak-card__stat-label">Current streak</span>
              <span className="streak-card__stat-value">{data.current_streak} days</span>
            </div>
            <div>
              <span className="streak-card__stat-label">Longest streak</span>
              <span className="streak-card__stat-value">{data.longest_streak} days</span>
            </div>
          </div>
        </div>

        <dl className="essential-list public-profile-targets">
          <div className="essential-row">
            <dt>SAT target score</dt>
            <dd>{data.sat_target_score ?? "Not set"}</dd>
          </div>
          <div className="essential-row">
            <dt>IELTS target score</dt>
            <dd>{data.ielts_target_score ?? "Not set"}</dd>
          </div>
        </dl>

        {badges.length > 0 && (
          <div className="public-profile-badges">
            <h2 className="public-profile-badges__title">Weekly achievements</h2>
            <div className="achievements-list">
              {badges.map((b, i) => (
                <LeagueBadge key={i} placement={b.placement} badge={b.badge} leagueId={b.league} week={b.week} />
              ))}
            </div>
          </div>
        )}
        <p className="public-profile-back">
          <a href={leaderboardHref()}>← Back to leaderboard</a>
        </p>
      </div>
    </section>
  );
}
