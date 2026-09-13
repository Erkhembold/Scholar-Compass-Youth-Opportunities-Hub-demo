import { useState } from "react";
import PlaceholderArt from "../components/PlaceholderArt.jsx";
import BookmarkButton from "../components/BookmarkButton.jsx";
import DeadlineStatus from "../components/DeadlineStatus.jsx";
import { RichText } from "../components/RichText.jsx";
import {
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconClock,
  IconCoin,
  IconTag,
  IconUser,
  IconUsers,
} from "../components/icons.jsx";
import { opportunities } from "../data/opportunities.js";
import { CATEGORY_LABELS } from "../data/categories.js";
import { formatDeadline } from "../utils/deadline.js";
import { categoryHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities.js";

const LANGUAGE_TABS = [
  { id: "mn", label: "Монгол" },
  { id: "en", label: "English" },
];

function EssentialRow({ icon, label, value }) {
  return (
    <div className="essential-row">
      <span className="essential-row__icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}

export default function OpportunityDetailPage({ id }) {
  const { t } = useLanguage();
  const { isSaved, toggleSave } = useSavedOpportunities();
  const opportunity = opportunities.find((op) => op.id === id);
  const isBilingual = opportunity && typeof opportunity.description === "object";
  const [lang, setLang] = useState("mn");

  if (!opportunity) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Opportunity not found</h1>
          <p className="section__lede">
            This listing may have been removed. <a href="#/">Back to the homepage.</a>
          </p>
        </div>
      </section>
    );
  }

  const {
    title,
    category,
    pattern,
    image,
    deadline,
    essential,
    description,
    links = [],
    contactNote,
  } = opportunity;

  const categoryLabel = t(CATEGORY_LABELS[category] ?? category);

  return (
    <article className="section detail">
      <div className="section__inner detail__inner">
        <a className="detail__back" href={categoryHref(category)}>
          <IconArrowLeft /> Back to {categoryLabel}
        </a>

        <div className="detail__banner">
          {image ? (
            <img src={image} alt="" className="detail__banner-image" />
          ) : (
            <PlaceholderArt pattern={pattern} />
          )}
        </div>

        <header className="detail__header">
          <div className="detail__header-top">
            <span className="opp-card__category">{categoryLabel}</span>
            <BookmarkButton
              size="lg"
              saved={isSaved(opportunity.id)}
              onToggle={() => toggleSave(opportunity.id)}
            />
          </div>
          <h1 className="detail__title">{title}</h1>
        </header>

        <div className="detail__columns">
          <aside className="detail__essential" aria-labelledby="essential-heading">
            <h2 id="essential-heading" className="detail__section-title">
              {t("Essential Information")}
            </h2>
            <dl className="essential-list">
              <EssentialRow icon={<IconTag />} label={t("Category")} value={categoryLabel} />
              <EssentialRow icon={<IconClock />} label={t("Duration")} value={essential.duration} />
              <EssentialRow icon={<IconCoin />} label={t("Cost")} value={essential.cost} />
              <EssentialRow icon={<IconUsers />} label={t("Participants")} value={essential.participants} />
              <EssentialRow
                icon={<IconCalendar />}
                label={t("Deadline")}
                value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    {formatDeadline(deadline)}
                    <DeadlineStatus deadline={deadline} size="lg" />
                  </span>
                }
              />
              <EssentialRow icon={<IconUser />} label={t("Who it's for")} value={essential.whoFor} />
              <EssentialRow icon={<IconBuilding />} label={t("Organizer")} value={essential.organizer} />
            </dl>
          </aside>

          <div className="detail__content">
            <section aria-labelledby="general-info-heading">
              <div className="detail__content-head">
                <h2 id="general-info-heading" className="detail__section-title">
                  {t("General Info")}
                </h2>
                {isBilingual && (
                  <div className="lang-toggle" role="group" aria-label="Language">
                    {LANGUAGE_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`lang-toggle__btn ${lang === tab.id ? "lang-toggle__btn--active" : ""}`}
                        aria-pressed={lang === tab.id}
                        onClick={() => setLang(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <RichText text={isBilingual ? description[lang] : description} />
            </section>

            {(links.length > 0 || contactNote) && (
              <section className="detail__contact" aria-labelledby="contact-heading">
                <h2 id="contact-heading" className="detail__section-title">
                  {t("Contact")}
                </h2>
                {links.length > 0 && (
                  <div className="detail__links">
                    {links.map((link) => (
                      <a
                        key={link.href}
                        className="btn btn--accent"
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(link.label)}
                      </a>
                    ))}
                  </div>
                )}
                {contactNote && <p className="detail__contact-note">{contactNote}</p>}
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
