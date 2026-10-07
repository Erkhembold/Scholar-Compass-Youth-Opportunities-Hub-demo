import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import Avatar from "../components/Avatar.jsx";
import FriendButton from "../components/FriendButton.jsx";
import LeagueBadge from "../components/LeagueBadge.jsx";
import ShareCardCanvas from "../components/ShareCardCanvas.jsx";
import { buildCard, publicViewModel } from "../utils/cardModel.js";
import { levelFromXp } from "../utils/levels.js";
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
  const [cardId, setCardId] = useState(null);
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

  return <PublicProfileView data={data} cardId={cardId} setCardId={setCardId} />;
}

// What a visitor sees. `data` comes from get_public_profile, which has ALREADY
// removed everything the owner marked private — anything missing here simply
// isn't drawn.
function PublicProfileView({ data, cardId, setCardId }) {
  const vm = useMemo(() => publicViewModel(data), [data]);
  const league = vm.league && LEAGUE_BY_ID[vm.league.id];
  const badges = vm.badges || [];

  // The owner's chosen cards, featured first; a card whose data is private or
  // empty is never listed.
  const listed = Array.isArray(data.cards) ? data.cards : [];
  const ordered = data.featured && listed.includes(data.featured)
    ? [data.featured, ...listed.filter((c) => c !== data.featured)]
    : listed;
  const cards = ordered.map((k) => buildCard(k, vm)).filter(Boolean);
  const shown = cards.find((c) => c.kind === cardId) || cards[0] || null;
  const KIND_LABEL = { student: "Student", streak: "Streak", league: "League", sat: "SAT", ielts: "IELTS", achievements: "Achievements" };

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card public-profile-card">
          <Avatar path={vm.avatarPath} name={vm.name} size={88} />
          <h1 className="signin__title" style={{ marginTop: 16 }}>
            {vm.name || "ScholarCompass student"}
          </h1>
          {(vm.school || vm.grade) && (
            <p className="public-profile-sub">
              {[vm.school, vm.grade && (/^\d+$/.test(String(vm.grade).trim()) ? `Grade ${String(vm.grade).trim()}` : vm.grade)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {league && (
            <p className="public-profile-league" data-league={league.id}>
              <span className="public-profile-league__chip">{league.name} League</span>
              {vm.league.rank ? (
                <span className="public-profile-league__rank">
                  Rank #{vm.league.rank} of {vm.league.size}
                </span>
              ) : null}
            </p>
          )}
          <FriendButton userId={data.id} />
        </div>

        {shown && (
          <div className="public-cards">
            <ShareCardCanvas card={shown} className="public-cards__canvas" />
            {cards.length > 1 && (
              <div className="public-cards__tabs" role="group" aria-label="Cards">
                {cards.map((c) => (
                  <button
                    key={c.kind}
                    type="button"
                    className={`onboarding-chip ${c.kind === shown.kind ? "onboarding-chip--active" : ""}`}
                    aria-pressed={c.kind === shown.kind}
                    onClick={() => setCardId(c.kind)}
                  >
                    {KIND_LABEL[c.kind] || c.kind}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <dl className="essential-list public-profile-targets">
          {vm.streak && (
            <div className="essential-row">
              <dt>Daily streak</dt>
              <dd>
                {vm.streak.current} {vm.streak.current === 1 ? "day" : "days"}
                {vm.streak.longest > vm.streak.current ? ` · longest ${vm.streak.longest}` : ""}
              </dd>
            </div>
          )}
          {vm.sat && (
            <div className="essential-row">
              <dt>SAT target score</dt>
              <dd>{vm.sat.target ?? "Not set"}</dd>
            </div>
          )}
          {vm.ielts && (
            <div className="essential-row">
              <dt>IELTS target score</dt>
              <dd>{vm.ielts.target ?? "Not set"}</dd>
            </div>
          )}
          {vm.xp && (
            <div className="essential-row">
              <dt>Level</dt>
              <dd>
                {levelFromXp(vm.xp.lifetime || 0)} · {(vm.xp.lifetime || 0).toLocaleString()} XP
              </dd>
            </div>
          )}
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
