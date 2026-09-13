import OrdinalArt from "./OrdinalArt.jsx";
import { ieltsTestHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function MockTestCard({ test, index }) {
  const { t } = useLanguage();
  const number = index + 1;

  if (test.comingSoon) {
    return (
      <div className="opp-card opp-card--disabled" aria-disabled="true">
        <div className="opp-card__media">
          <OrdinalArt number={number} image={test.image} alt={test.title} />
        </div>
        <div className="opp-card__body">
          <div className="opp-card__top">
            <span className="opp-card__category">IELTS Reading</span>
            <span className="opp-card__deadline">{t("Coming soon")}</span>
          </div>
          <h3 className="opp-card__title">{test.title}</h3>
        </div>
      </div>
    );
  }

  return (
    <a className="opp-card" href={ieltsTestHref(test.id)}>
      <div className="opp-card__media">
        <OrdinalArt number={number} image={test.image} alt={test.title} />
      </div>
      <div className="opp-card__body">
        <div className="opp-card__top">
          <span className="opp-card__category">IELTS Reading</span>
          <span className="opp-card__deadline">{t("60 min · 40 questions")}</span>
        </div>
        <h3 className="opp-card__title">{test.title}</h3>
      </div>
    </a>
  );
}
