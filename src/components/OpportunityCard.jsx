import PlaceholderArt from "./PlaceholderArt.jsx";
import { CATEGORY_LABELS } from "../data/categories.js";
import { formatDeadline } from "../utils/deadline.js";
import { opportunityHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function OpportunityCard({ opportunity }) {
  const { t } = useLanguage();

  return (
    <a className="opp-card" href={opportunityHref(opportunity.id)}>
      <div className="opp-card__media">
        {opportunity.image ? (
          <img src={opportunity.image} alt="" className="opp-card__image" />
        ) : (
          <PlaceholderArt pattern={opportunity.pattern} />
        )}
      </div>
      <div className="opp-card__body">
        <div className="opp-card__top">
          <span className="opp-card__category">
            {t(CATEGORY_LABELS[opportunity.category] ?? opportunity.category)}
          </span>
          <span className="opp-card__deadline">
            {formatDeadline(opportunity.deadline, { withPrefix: true })}
          </span>
        </div>
        <h3 className="opp-card__title">{opportunity.title}</h3>
      </div>
    </a>
  );
}
