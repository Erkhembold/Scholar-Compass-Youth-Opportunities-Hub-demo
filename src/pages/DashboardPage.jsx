import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import StreakCard from "../components/StreakCard.jsx";
import ProgressTracker from "../components/ProgressTracker.jsx";
import WeakAreaCard from "../components/WeakAreaCard.jsx";
import RoadmapCard from "../components/RoadmapCard.jsx";
import OpportunityBoard from "../components/OpportunityBoard.jsx";

// The personalized homepage a signed-in, onboarded user sees instead of
// the public homepage (gated in App.jsx's "home" route — see
// supabase/onboarding.sql for how new vs. existing users are told apart).
// Deliberately doesn't repeat the public homepage's Hero/Notification/
// SuggestedReads/About sections — those are for first-time visitors
// deciding whether to sign up; a returning student wants their own
// standing first, per the spec's "feel like MY ScholarCompass" framing.
// The Opportunity board underneath is the exact same full board every
// visitor sees, unmodified, so no functionality is lost by no longer
// landing on the public homepage.
export default function DashboardPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const firstName = (profile?.name || "").trim().split(/\s+/)[0];

  return (
    <>
      <section className="section dashboard">
        <div className="section__inner">
          <h1 className="dashboard__greeting">
            {firstName ? t("Good to see you, {name}").replace("{name}", firstName) : t("Good to see you")}
          </h1>
          <div className="dashboard__cards">
            <StreakCard />
            <ProgressTracker />
            <WeakAreaCard />
            <RoadmapCard />
          </div>
        </div>
      </section>
      <OpportunityBoard />
    </>
  );
}
