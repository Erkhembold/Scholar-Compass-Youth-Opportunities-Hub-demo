import { useState } from "react";
import { ieltsExercisesHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const SKILLS = [
  { id: "reading", label: "Reading", ready: true },
  { id: "listening", label: "Listening", ready: false },
  { id: "speaking", label: "Speaking", ready: false },
  { id: "writing", label: "Writing", ready: false },
];

// Same College Board "Question Bank"-style picker as IeltsPracticePicker,
// but for short, targeted exercises rather than full timed mock tests.
export default function IeltsExercisesPicker() {
  const { t } = useLanguage();
  const [skill, setSkill] = useState("reading");

  function handleSearch() {
    window.location.hash = ieltsExercisesHref(skill);
  }

  return (
    <div className="practice-picker__card">
      <h2 className="practice-picker__eyebrow">IELTS EXERCISES</h2>

      <label className="practice-picker__label" htmlFor="exercises-skill">
        {t("Choose a skill")}
      </label>
      <select
        id="exercises-skill"
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
  );
}
