import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import LevelCard from "../components/LevelCard.jsx";
import ProgressTracker from "../components/ProgressTracker.jsx";
import DashboardStreakPill from "../components/DashboardStreakPill.jsx";
import OpportunityBoard from "../components/OpportunityBoard.jsx";

// The personalized homepage a signed-in, onboarded user sees instead of
// the public homepage (gated in App.jsx's "home" route — see
// supabase/onboarding.sql for how new vs. existing users are told apart).
// Kept deliberately lean: a greeting + streak readout up top, then just
// Level progress and Your progress, centered. Weak-area diagnosis and the
// roadmap stay one click away on the Profile page rather than living here
// too — this page is the daily at-a-glance check-in, not the full
// dashboard. The Opportunity board underneath is the exact same full
// board every visitor sees, unmodified.
export default function DashboardPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const firstName = (profile?.name || "").trim().split(/\s+/)[0];

  return (
    <>
      <section className="section dashboard">
        <div className="section__inner">
          <div className="dashboard__header">
            <h1 className="dashboard__greeting">
              {firstName ? t("Hello {name}!").replace("{name}", firstName) : t("Hello!")}
            </h1>
            <DashboardStreakPill />
          </div>
          <div className="dashboard__cards dashboard__cards--centered">
            <LevelCard />
            <ProgressTracker />
          </div>
        </div>
      </section>
      <OpportunityBoard />
    </>
  );
}
