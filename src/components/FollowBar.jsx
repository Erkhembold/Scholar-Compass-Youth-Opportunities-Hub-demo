import { INSTAGRAM_URL, SITE_NAME } from "../data/config.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function FollowBar() {
  const { t } = useLanguage();

  return (
    <div className="follow-bar">
      <span className="follow-bar__label">{t(`Follow ${SITE_NAME}`)}</span>
      <a
        className="follow-bar__link"
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ScholarCompass on Instagram"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
        </svg>
        <span>Instagram</span>
      </a>
    </div>
  );
}
