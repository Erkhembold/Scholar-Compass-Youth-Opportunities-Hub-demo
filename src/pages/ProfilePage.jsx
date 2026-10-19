import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { ieltsTestHref, leaderboardHref } from "../router.js";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities.js";
import { opportunities } from "../data/opportunities.js";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import LeagueBadge from "../components/LeagueBadge.jsx";
import CollapsibleSection from "../components/CollapsibleSection.jsx";
import { UserScoreBadges } from "../components/UserScoreBadge.jsx";
import { useVerifiedScores } from "../hooks/useVerifiedScores.js";
import ProfileDashboard from "../components/ProfileDashboard.jsx";
import RoadmapCard from "../components/RoadmapCard.jsx";
import { SatRwHistory, SatMathHistory } from "../components/SatHistory.jsx";
import FriendsSection from "../components/FriendsSection.jsx";
import { TYPE_LABELS } from "../utils/ielts.js";
import { leagueFor } from "../data/leagues.js";
import { getWeekInfo, zoneForRank, triggerWeeklyRollover } from "../utils/leaderboard.js";
import { useLeagueBoard } from "../hooks/useLeagueBoard.js";


export default function ProfilePage() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const { savedIds, loading: savedLoading } = useSavedOpportunities();
  const myVerifiedScores = useVerifiedScores([user?.id])[user?.id];
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [exerciseAttempts, setExerciseAttempts] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [leagueProfile, setLeagueProfile] = useState(profile);
  const [friendsSignal, setFriendsSignal] = useState(0);
  const friendsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !profile || !supabase) {
      setLeagueProfile(profile);
      return;
    }
    triggerWeeklyRollover(supabase, { id: user.id, ...profile }).then((updated) => {
      if (!cancelled) setLeagueProfile(updated);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.last_processed_week]);

  useEffect(() => {
    if (!user || !supabase) {
      setAttemptsLoading(false);
      return;
    }
    supabase
      .from("ielts_attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .then(({ data }) => {
        setAttempts(data || []);
        setAttemptsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user || !supabase) {
      setExercisesLoading(false);
      return;
    }
    supabase
      .from("ielts_exercise_attempts")
      .select("id, exercise_id, exercise_type, skill, difficulty, correct, items_total, items_correct, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setExerciseAttempts(data || []);
        setExercisesLoading(false);
      });
  }, [user]);

  const { weekNumber } = getWeekInfo();
  const league = leagueFor(leagueProfile?.current_league);
  const myLeagueId = league.id;
  const meEntry = user ? { id: user.id, name: leagueProfile?.name || "You", xp: leagueProfile?.weekly_xp || 0, avatarPath: leagueProfile?.avatar_path || null } : null;
  const { board, loading: boardLoading } = useLeagueBoard(myLeagueId, meEntry);

  if (loading) {
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
            <a href="#/signin">Sign in</a> to view your profile.
          </p>
        </div>
      </section>
    );
  }

  function handleAvatarProfile(fields) {
    return updateProfile(fields);
  }

  const myRow = board.find((p) => p.id === user.id);
  const zone = myRow ? zoneForRank(myRow.rank, board.length) : "stay";
  const statusLabel =
    zone === "promotion"
      ? "Promotion zone"
      : zone === "relegation"
      ? league.id === "bronze"
        ? "Stays in Bronze"
        : "Relegation zone"
      : "Safe zone";
  const badges = leagueProfile?.badges || [];
  // League/XP come from the weekly-rollover result; name and photo follow live edits.
  const dashboardProfile = {
    ...(leagueProfile || {}),
    ...(profile ? { name: profile.name, avatar_path: profile.avatar_path, lifetime_xp: profile.lifetime_xp ?? leagueProfile?.lifetime_xp } : {}),
  };

  return (
    <section className="section dashboard dashboard--wide">
      <ProfileDashboard
        user={user}
        profile={dashboardProfile}
        onProfileChange={handleAvatarProfile}
        onSignOut={async () => {
          await signOut();
          window.location.hash = "#/";
        }}
        onManageFriends={() => {
          setFriendsSignal((n) => n + 1);
          setTimeout(() => friendsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        }}
      />
      <div className="section__inner dashboard__inner dashboard__inner--wide">
        <UserScoreBadges scores={myVerifiedScores} />

        <div className="dashboard-grid">
          <div className="dashboard-grid__cell dashboard-grid__cell--half">
            <div className="league-header" data-league={league.id}>
              <div className="league-header__badge">{league.name}</div>
              <h2 className="league-header__title">League &amp; Achievements</h2>
              <div className="league-header__stats">
                <div>
                  <span className="league-header__stat-value">{league.name}</span>
                  <span className="league-header__stat-label">Current league</span>
                </div>
                <div>
                  <span className="league-header__stat-value">
                    #{myRow ? myRow.rank : "—"} / {board.length}
                  </span>
                  <span className="league-header__stat-label">Rank</span>
                </div>
                <div>
                  <span className="league-header__stat-value">
                    {(leagueProfile?.weekly_xp || 0).toLocaleString()}
                  </span>
                  <span className="league-header__stat-label">Weekly XP</span>
                </div>
                <div>
                  <span className="league-header__stat-value">{statusLabel}</span>
                  <span className="league-header__stat-label">Status</span>
                </div>
              </div>
              <a className="btn btn--ghost" style={{ marginTop: 18 }} href={leaderboardHref()}>
                View full leaderboard
              </a>

              {badges.length > 0 && (
                <>
                  <h3 style={{ marginTop: 24, fontSize: "0.95rem", color: "var(--league-fg)" }}>
                    Weekly Achievements
                  </h3>
                  <div className="achievements-list">
                    {badges.map((b, i) => (
                      <LeagueBadge key={i} placement={b.placement} badge={b.badge} leagueId={b.league} week={b.week} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="dashboard-grid__cell dashboard-grid__cell--half">
            <RoadmapCard />
          </div>
        </div>

        <div className="profile-split profile-split--single">
        <div ref={friendsRef} className="profile-anchor"><CollapsibleSection title="Friends and requests" defaultOpen openSignal={friendsSignal}>
          <FriendsSection />
        </CollapsibleSection></div>
        </div>

        <CollapsibleSection title="IELTS Reading history" alwaysCollapsible>
          {attemptsLoading ? (
            <p className="signin__lede">Loading…</p>
          ) : attempts.length === 0 ? (
            <p className="signin__lede">
              No attempts yet. <a href="#/category/ielts">Take a mock test</a> and your results
              will show up here.
            </p>
          ) : (
            <ul className="test-history">
              {attempts.map((a) => (
                <li className="test-history__row" key={a.id}>
                  <div>
                    <a className="test-history__title" href={ieltsTestHref(a.test_id)}>
                      {a.test_title}
                    </a>
                    <span className="test-history__date">
                      {new Date(a.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="test-history__score">
                    Band {a.band} · {a.raw_score}/40
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3 className="profile-subhead">Reading exercises</h3>
          {exercisesLoading ? (
            <p className="signin__lede">Loading…</p>
          ) : exerciseAttempts.length === 0 ? (
            <p className="signin__lede">
              No exercises yet. <a href="#/ielts/exercises/reading">Try a Reading exercise</a> and
              every answer you submit will be saved here.
            </p>
          ) : (
            <>
              <p className="signin__lede">
                {exerciseAttempts.length >= 200 ? "Last 200" : exerciseAttempts.length} answers ·{" "}
                {Math.round(
                  (100 * exerciseAttempts.reduce((n, a) => n + a.items_correct, 0)) /
                    Math.max(1, exerciseAttempts.reduce((n, a) => n + a.items_total, 0))
                )}
                % of questions correct
              </p>
              <ul className="test-history">
                {exerciseAttempts.slice(0, 15).map((a) => (
                  <li className="test-history__row" key={a.id}>
                    <div>
                      <span className="test-history__title">
                        {TYPE_LABELS[a.exercise_type] || a.exercise_type}
                      </span>
                      <span className="test-history__date">
                        {a.exercise_id} · {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`test-history__score exercise-history__result ${
                        a.correct ? "is-correct" : "is-incorrect"
                      }`}
                    >
                      {a.items_total > 1 ? `${a.items_correct}/${a.items_total}` : a.correct ? "Correct" : "Incorrect"}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="SAT Reading and Writing test history" alwaysCollapsible>
          <SatRwHistory />
        </CollapsibleSection>

        <CollapsibleSection title="SAT Math test history" alwaysCollapsible>
          <SatMathHistory />
        </CollapsibleSection>

        <div style={{ marginTop: 48 }}>
          <CollapsibleSection
            title="Saved Opportunities"
            alwaysCollapsible
            lede="Everything you've bookmarked from the opportunity board, in one place."
          >
            {savedLoading ? (
              <p className="section__lede">Loading…</p>
            ) : (
              <OpportunityGrid
                opportunities={opportunities.filter((op) => savedIds.has(op.id))}
                emptyMessage="Nothing saved yet — tap the bookmark icon on any opportunity to add it here."
              />
            )}
          </CollapsibleSection>
        </div>
      </div>
    </section>
  );
}
