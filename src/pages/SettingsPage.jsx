import { useAuth } from "../context/AuthContext.jsx";
import CollapsibleSection from "../components/CollapsibleSection.jsx";
import AccountDetails from "../components/AccountDetails.jsx";
import StudentCardsSection from "../components/StudentCardsSection.jsx";

// #/settings. Reached from the Settings button on the profile dashboard.
// Both sections are tap-to-expand ("+" / "-") on every screen size.
export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="section settings-page">
        <div className="settings-page__inner">
          <p className="section__lede">Loading...</p>
        </div>
      </section>
    );
  }
  if (!user) {
    return (
      <section className="section settings-page">
        <div className="settings-page__inner">
          <h1 className="settings-page__title">You're not signed in</h1>
          <p className="section__lede">
            <a href="#/signin">Sign in</a> to open your settings.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section settings-page">
      <div className="settings-page__inner">
        <p className="settings-page__back">
          <a href="#/profile">&larr; Profile</a>
        </p>
        <h1 className="settings-page__title">Settings</h1>
        <CollapsibleSection title="Account details" alwaysCollapsible>
          <AccountDetails />
        </CollapsibleSection>
        <CollapsibleSection
          title="Share your progress"
          lede="Make a card from your real streak, league and practice, and choose exactly what other students can see."
          alwaysCollapsible
        >
          <StudentCardsSection />
        </CollapsibleSection>
      </div>
    </section>
  );
}
