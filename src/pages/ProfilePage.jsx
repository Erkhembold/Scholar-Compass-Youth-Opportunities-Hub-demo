import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { ieltsTestHref, leaderboardHref } from "../router.js";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities.js";
import { opportunities } from "../data/opportunities.js";
import OpportunityGrid from "../components/OpportunityGrid.jsx";
import LeagueBadge from "../components/LeagueBadge.jsx";
import { LEAGUE_BY_ID } from "../data/leagues.js";
import { getWeekInfo, zoneForRank, processWeeklyReset } from "../utils/leaderboard.js";
import { useLeagueBoard } from "../hooks/useLeagueBoard.js";

const FIELD_DEFS = [
  { key: "school", label: "School" },
  { key: "grade", label: "Grade / year level" },
  { key: "intended_major", label: "Intended major or field of interest" },
  { key: "target_test", label: "Target scholarship/test" },
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
  }));
  const [saving, setSaving] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [leagueProfile, setLeagueProfile] = useState(profile);

  useEffect(() => {
    let cancelled = false;
    if (!user || !profile || !supabase) {
      setLeagueProfile(profile);
      return;
    }
    processWeeklyReset(supabase, { id: user.id, ...profile }).then((updated) => {
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

  const { weekNumber } = getWeekInfo();
  const myLeagueId = leagueProfile?.current_league || "bronze";
  const meEntry = user ? { id: user.id, name: leagueProfile?.name || "You", xp: leagueProfile?.weekly_xp || 0 } : null;
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
    await updateProfile(form);
    setSaving(false);
    setEditing(false);
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
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card">
          <h1 className="signin__title">{profile?.name || "Your profile"}</h1>
          <p className="signin__lede">{user.email}</p>

          {!editing ? (
            <>
              <dl className="essential-list" style={{ marginTop: 24 }}>
                {FIELD_DEFS.map((f) => (
                  <div className="essential-row" key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{profile?.[f.key] || "Not set"}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                className="btn btn--ghost"
                style={{ marginTop: 20 }}
                onClick={() => setEditing(true)}
              >
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
              <button type="submit" className="btn btn--accent signin__submit" disabled={saving}>
                {saving ? "…" : "Save"}
              </button>
            </form>
          )}

          <button
            type="button"
            className="signin__back"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={async () => {
              await signOut();
              window.location.hash = "#/";
            }}
          >
            Sign out
          </button>
        </div>

        <div
          className="league-header"
          style={{ "--league-color": league.primary, "--league-soft": league.soft, marginTop: 24 }}
        >
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
              <h3 style={{ marginTop: 24, fontSize: "0.95rem", color: "var(--heading)" }}>
                Weekly Achievements
              </h3>
              <div className="achievements-list">
                {badges.map((b, i) => (
                  <LeagueBadge
                    key={i}
                    placement={b.placement}
                    badge={b.badge}
                    leagueId={b.league}
                    week={b.week}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="signin__card" style={{ marginTop: 24 }}>
          <h2 className="signin__title" style={{ fontSize: "1.2rem" }}>
            IELTS Reading history
          </h2>

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
        </div>
      </div>

      <div className="section__inner" style={{ marginTop: 48 }}>
        <div className="section__head">
          <h2 className="section__title" style={{ fontSize: "1.4rem" }}>
            Saved Opportunities
          </h2>
          <p className="section__lede">
            Everything you've bookmarked from the opportunity board, in one place.
          </p>
        </div>

        {savedLoading ? (
          <p className="section__lede">Loading…</p>
        ) : (
          <OpportunityGrid
            opportunities={opportunities.filter((op) => savedIds.has(op.id))}
            emptyMessage="Nothing saved yet — tap the bookmark icon on any opportunity to add it here."
          />
        )}
      </div>
    </section>
  );
}
