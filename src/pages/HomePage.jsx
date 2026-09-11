import Hero from "../components/Hero.jsx";
import OpportunityBoard from "../components/OpportunityBoard.jsx";
import NotificationSection from "../components/NotificationSection.jsx";
import SuggestedReads from "../components/SuggestedReads.jsx";
import AboutSection from "../components/AboutSection.jsx";
import SubmitOpportunitySection from "../components/SubmitOpportunitySection.jsx";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OpportunityBoard />
      <NotificationSection />
      <SuggestedReads />
      <AboutSection />
      <SubmitOpportunitySection />
    </>
  );
}
