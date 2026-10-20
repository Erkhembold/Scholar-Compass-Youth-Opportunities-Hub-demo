import { ieltsPracticeHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { IconBookOpen, IconPencil, IconHeadphones, IconMic, IconArrowRight } from "./icons.jsx";

const SKILLS = [
  { id: "reading", label: "Reading", ready: true, Icon: IconBookOpen, sub: "Passages, True/False/Not Given, matching" },
  { id: "writing", label: "Writing", ready: true, Icon: IconPencil, sub: "Task practice with model answers" },
  { id: "listening", label: "Listening", ready: false, Icon: IconHeadphones, sub: "Coming soon" },
  { id: "speaking", label: "Speaking", ready: false, Icon: IconMic, sub: "Coming soon" },
];

// IELTS landing page entry point: one direct action per skill instead of a
// dropdown plus a Search button. Skills that are not built yet are shown as
// quiet, non-clickable cards so nobody wonders where they went.
export default function IeltsPracticePicker() {
  const { t } = useLanguage();

  return (
    <div className="practice-picker__card">
      <h2 id="practice-picker-heading" className="practice-picker__eyebrow">
        IELTS PRACTICE
      </h2>
      <div className="skill-actions">
        {SKILLS.map(({ id, label, ready, Icon, sub }) =>
          ready ? (
            <a key={id} className="skill-action" href={ieltsPracticeHref(id)}>
              <span className="skill-action__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="skill-action__text">
                <span className="skill-action__title">
                  {t("Start IELTS")} {t(label)}
                </span>
                <span className="skill-action__sub">{t(sub)}</span>
              </span>
              <span className="skill-action__arrow" aria-hidden="true">
                <IconArrowRight />
              </span>
            </a>
          ) : (
            <div key={id} className="skill-action skill-action--soon" aria-disabled="true">
              <span className="skill-action__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="skill-action__text">
                <span className="skill-action__title">IELTS {t(label)}</span>
                <span className="skill-action__sub">{t(sub)}</span>
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
