import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import Avatar from "../components/Avatar.jsx";
import { profileHref } from "../router.js";

// Another student's card: name, photo, streak, and target scores only —
// nothing else, and never editable here. What's actually shown is decided
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

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card public-profile-card">
          <Avatar path={data.avatar_path} name={data.name} size={88} />
          <h1 className="signin__title" style={{ marginTop: 16 }}>
            {data.name || "ScholarCompass student"}
          </h1>
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
      </div>
    </section>
  );
}
