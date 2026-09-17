import { useState } from "react";
import { ieltsPracticeHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const SKILLS = [
  { id: "reading", label: "Reading", ready: true },
  { id: "listening", label: "Listening", ready: false },
  { id: "speaking", label: "Speaking", ready: false },
  { id: "writing", label: "Writing", ready: true },
];

// College Board "Question Bank"-style entry point: pick a skill, hit
// Search, and you're taken to a dedicated practice page for just that
// skill. Keeps the IELTS landing page a chooser rather than dumping every
// skill's material onto one screen.
export default function IeltsPracticePicker() {
  const { t } = useLanguage();
  const [skill, setSkill] = useState("reading");

  function handleSearch() {
    window.location.hash = ieltsPracticeHref(skill);
  }

  return (
    <section className="section practice-picker" aria-labelledby="practice-picker-heading">
      <div className="section__inner">
        <div className="practice-picker__card">
          <h2 id="practice-picker-heading" className="practice-picker__eyebrow">
            IELTS PRACTICE
          </h2>

          <label className="practice-picker__label" htmlFor="practice-skill">
            {t("Choose a skill")}
          </label>
          <select
            id="practice-skill"
            className="practice-picker__select"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            {SKILLS.map((s) => (
              <option key={s.id} value={s.id}>
                {t(s.label)}
                {!s.ready ? " — coming soon" : ""}
              </option>
            ))}
          </select>

          <div className="practice-picker__actions">
            <a className="practice-picker__cancel" href="#/">
              {t("Cancel")}
            </a>
            <button type="button" className="btn btn--accent" onClick={handleSearch}>
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
