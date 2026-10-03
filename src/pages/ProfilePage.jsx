import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { ieltsTestHref, leaderboardHref } from "../router.js";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities.js";
import { opportunities } from "../data/opportunities.js";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import LeagueBadge from "../components/LeagueBadge.jsx";
import CollapsibleSection from "../components/CollapsibleSection.jsx";
import StreakCard from "../components/StreakCard.jsx";
import AvatarUpload from "../components/AvatarUpload.jsx";
import ProgressTracker from "../components/ProgressTracker.jsx";
import WeakAreaCard from "../components/WeakAreaCard.jsx";
import RoadmapCard from "../components/RoadmapCard.jsx";
import { TYPE_LABELS } from "../utils/ielts.js";
import { LEAGUE_BY_ID } from "../data/leagues.js";
import { getWeekInfo, zoneForRank, triggerWeeklyRollover } from "../utils/leaderboard.js";
import { useLeagueBoard } from "../hooks/useLeagueBoard.js";

const FIELD_DEFS = [
  { key: "school", label: "School" },
  { key: "grade", label: "Grade / year level" },
  { key: "intended_major", label: "Intended major or field of interest" },
  { key: "target_test", label: "Target scholarship/test" },
];

const TARGET_FIELD_DEFS = [
  { key: "sat_target_score", label: "SAT target score", type: "number", min: 400, max: 1600, step: 10 },
  { key: "ielts_target_score", label: "IELTS target score", type: "number", min: 1, max: 9, step: 0.5 },
];

export default function ProfilePage() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const { savedIds, loading: savedLoading } = useSavedOpportunities();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    school: profile?.school || "",
    grade: profile?.grade || "",
    intended_major: profile?.intended_major || "",
    target_test: profile?.target_test || "",
    sat_target_score: profile?.sat_target_score ?? "",
    ielts_target_score: profile?.ielts_target_score ?? "",
  }));
  const [visible, setVisible] = useState(profile?.profile_visible !== false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [exerciseAttempts, setExerciseAttempts] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [leagueProfile, setLeagueProfile] = useState(profile);

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
  const myLeagueId = leagueProfile?.current_league || "bronze";
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

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      ...form,
      sat_target_score: form.sat_target_score === "" ? null : Number(form.sat_target_score),
      ielts_target_score: form.ielts_target_score === "" ? null : Number(form.ielts_target_score),
    });
    setSaving(false);
    setEditing(false);
  }

  async function handleAvatarUploaded(path) {
    await updateProfile({ avatar_path: path });
  }

  async function handleVisibilityToggle() {
    const next = !visible;
    setVisible(next); // optimistic — other students only ever see this via
    // get_public_profile(), which is fully server-enforced regardless
    setVisibilitySaving(true);
    const { error } = await updateProfile({ profile_visible: next });
    if (error) setVisible(!next);
    setVisibilitySaving(false);
  }

  const league = LEAGUE_BY_ID[myLeagueId];
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

  return (
    <section className="section dashboard">
      <div className="section__inner dashboard__inner">
        <header className="dashboard-header">
          <AvatarUpload
            userId={user.id}
            name={profile?.name}
            avatarPath={profile?.avatar_path}
            onUploaded={handleAvatarUploaded}
          />
          <div className="dashboard-header__text">
            <h1 className="dashboard-header__greeting">Hey {profile?.name || "there"} 👋</h1>
            <p className="dashboard-header__email">{user.email}</p>
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={async () => {
              await signOut();
              window.location.hash = "#/";
            }}
          >
            Sign out
          </button>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-grid__cell dashboard-grid__cell--streak">
            <StreakCard />
          </div>
          <div className="dashboard-grid__cell dashboard-grid__cell--progress">
            <ProgressTracker />
          </div>
          <div className="dashboard-grid__cell dashboard-grid__cell--half">
            <WeakAreaCard />
          </div>
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

          <div className="dashboard-grid__cell">
            <RoadmapCard />
          </div>
        </div>

        <CollapsibleSection title="Account details">
          <label className="visibility-toggle">
            <input type="checkbox" checked={visible} disabled={visibilitySaving} onChange={handleVisibilityToggle} />
            Show my streak and target scores to other students
          </label>

          {!editing ? (
            <>
              <dl className="essential-list" style={{ marginTop: 24 }}>
                {FIELD_DEFS.map((f) => (
                  <div className="essential-row" key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{profile?.[f.key] || "Not set"}</dd>
                  </div>
                ))}
                {TARGET_FIELD_DEFS.map((f) => (
                  <div className="essential-row" key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{profile?.[f.key] ?? "Not set"}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" className="btn btn--ghost" style={{ marginTop: 20 }} onClick={() => setEditing(true)}>
                Edit details
              </button>
            </>
          ) : (
            <form className="signin__form" onSubmit={handleSave}>
              {FIELD_DEFS.map((f) => (
                <div className="signin__field" key={f.key}>
                  <label htmlFor={`profile-${f.key}`}>{f.label}</label>
                  <input
                    id={`profile-${f.key}`}
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              {TARGET_FIELD_DEFS.map((f) => (
                <div className="signin__field" key={f.key}>
                  <label htmlFor={`profile-${f.key}`}>{f.label}</label>
                  <input
                    id={`profile-${f.key}`}
                    type="number"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    placeholder="Not set"
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn--accent signin__submit" disabled={saving}>
                {saving ? "…" : "Save"}
              </button>
            </form>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="IELTS Reading history">
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

        <div style={{ marginTop: 48 }}>
          <CollapsibleSection
            title="Saved Opportunities"
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
