import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import ToggleGroup from "../components/ToggleGroup.jsx";

const GRADES = ["9", "10", "11", "12", "Not sure yet"];
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Europe", "Mongolia", "Other"];
const FIELDS = ["Engineering", "Computer Science", "Business", "Medicine", "Social Sciences", "Arts", "Undecided"];


// Shown once, right after a brand-new account is created (see
// profile.onboarding_completed, gated in App.jsx's home route — this page
// is never shown to an existing user; see supabase/onboarding.sql for why
// that's guaranteed at the database level, not just by this page's own
// logic). Every field is skippable: nothing here blocks getting to the
// dashboard, matching "don't force students to enter information they
// genuinely don't know."
export default function OnboardingPage() {
  const { updateProfile } = useAuth();
  const { t } = useLanguage();
  const [grade, setGrade] = useState("");
  const [countries, setCountries] = useState([]);
  const [field, setField] = useState("");
  const [preparingSat, setPreparingSat] = useState(null); // null = not answered
  const [satTarget, setSatTarget] = useState("");
  const [preparingIelts, setPreparingIelts] = useState(null);
  const [ieltsTarget, setIeltsTarget] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleCountry(c) {
    setCountries((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function finish() {
    setSaving(true);
    await updateProfile({
      grade: grade || null,
      intended_countries: countries.length ? countries : null,
      intended_major: field || null,
      preparing_for_sat: preparingSat,
      sat_target_score: preparingSat && satTarget !== "" ? Number(satTarget) : null,
      preparing_for_ielts: preparingIelts,
      ielts_target_score: preparingIelts && ieltsTarget !== "" ? Number(ieltsTarget) : null,
      onboarding_completed: true,
    });
    setSaving(false);
    // The home route re-renders once profile.onboarding_completed flips to
    // true (updateProfile reloads the profile), landing on the dashboard —
    // no navigation needed here.
  }

  return (
    <section className="section signin">
      <div className="section__inner signin__inner">
        <div className="signin__card onboarding-card">
          <h1 className="signin__title">{t("Welcome to ScholarCompass")}</h1>
          <p className="signin__lede">
            {t("A few quick questions to personalize your dashboard — skip anything you're not sure about yet.")}
          </p>

          <div className="onboarding-step">
            <h2 className="onboarding-step__title">{t("What grade are you in?")}</h2>
            <ToggleGroup options={GRADES.map((g) => t(g))} selected={t(grade)} onToggle={(v) => setGrade(GRADES[GRADES.map((g) => t(g)).indexOf(v)])} />
          </div>

          <div className="onboarding-step">
            <h2 className="onboarding-step__title">{t("Where do you plan to apply?")}</h2>
            <ToggleGroup
              options={COUNTRIES.map((c) => t(c))}
              selected={countries.map((c) => t(c))}
              onToggle={(v) => toggleCountry(COUNTRIES[COUNTRIES.map((c) => t(c)).indexOf(v)])}
              multi
            />
          </div>

          <div className="onboarding-step">
            <h2 className="onboarding-step__title">{t("What are you interested in?")}</h2>
            <ToggleGroup options={FIELDS.map((f) => t(f))} selected={t(field)} onToggle={(v) => setField(FIELDS[FIELDS.map((f) => t(f)).indexOf(v)])} />
          </div>

          <div className="onboarding-step">
            <h2 className="onboarding-step__title">{t("Are you preparing for the SAT?")}</h2>
            <ToggleGroup
              options={[t("Yes"), t("No"), t("Not sure yet")]}
              selected={preparingSat === true ? t("Yes") : preparingSat === false ? t("No") : t("Not sure yet")}
              onToggle={(v) => setPreparingSat(v === t("Yes") ? true : v === t("No") ? false : null)}
            />
            {preparingSat && (
              <div className="signin__field onboarding-subfield">
                <label htmlFor="onb-sat-target">{t("SAT target score")}</label>
                <input
                  id="onb-sat-target"
                  type="number"
                  min={400}
                  max={1600}
                  step={10}
                  placeholder={t("Not sure yet")}
                  value={satTarget}
                  onChange={(e) => setSatTarget(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="onboarding-step">
            <h2 className="onboarding-step__title">{t("Are you preparing for IELTS?")}</h2>
            <ToggleGroup
              options={[t("Yes"), t("No"), t("Not sure yet")]}
              selected={preparingIelts === true ? t("Yes") : preparingIelts === false ? t("No") : t("Not sure yet")}
              onToggle={(v) => setPreparingIelts(v === t("Yes") ? true : v === t("No") ? false : null)}
            />
            {preparingIelts && (
              <div className="signin__field onboarding-subfield">
                <label htmlFor="onb-ielts-target">{t("IELTS target band")}</label>
                <input
                  id="onb-ielts-target"
                  type="number"
                  min={1}
                  max={9}
                  step={0.5}
                  placeholder={t("Not sure yet")}
                  value={ieltsTarget}
                  onChange={(e) => setIeltsTarget(e.target.value)}
                />
              </div>
            )}
          </div>

          <button type="button" className="btn btn--accent signin__submit" onClick={finish} disabled={saving}>
            {saving ? t("Saving…") : t("Start using ScholarCompass")}
          </button>
          <button type="button" className="btn btn--ghost onboarding-skip" onClick={finish} disabled={saving}>
            {t("Skip for now")}
          </button>
        </div>
      </div>
    </section>
  );
}
