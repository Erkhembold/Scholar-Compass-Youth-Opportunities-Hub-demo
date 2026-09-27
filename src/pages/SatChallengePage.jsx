import { useAuth } from "../context/AuthContext.jsx";
import { satPracticeHref } from "../router.js";

// Step 1 of the SAT 1v1 Challenge build: nav entry + page shell only.
// Create/join/lobby forms, the Supabase-backed match table, and realtime
// sync all land in the next steps — see HANDOFF.md "PENDING TASK" for the
// full build order. This page intentionally does NOT fake a working
// matchmaking flow (no client-side PIN generation, no pretend "waiting
// for opponent" state) since that would be live on production for real
// users before there's anything real behind it.
export default function SatChallengePage() {
  const { user, loading } = useAuth();

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
            <a href="#/signin">Sign in</a> to challenge another student to a 1v1 SAT match.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card sat-challenge__card">
          <a className="detail__back" href={satPracticeHref("craft-and-structure")}>
            ← Back to SAT
          </a>
          <h1 className="signin__title">SAT 1v1 Challenge</h1>
          <p className="signin__lede">
            Go head-to-head with another student on the same set of SAT questions, under a
            shared timer. Create a match and share a 4-digit PIN, or join a friend's match with
            theirs.
          </p>

          <div className="sat-challenge__actions">
            <button type="button" className="btn btn--accent" disabled>
              Create a match
            </button>
            <button type="button" className="btn btn--ghost" disabled>
              Join with a PIN
            </button>
          </div>

          <p className="sat-challenge__soon-note">
            Matchmaking is still being built — these buttons will turn on soon.
          </p>
        </div>
      </div>
    </section>
  );
}
