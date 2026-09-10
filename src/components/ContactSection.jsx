import { CONTACT_EMAIL, INSTAGRAM_URL } from "../data/config.js";

export default function ContactSection() {
  return (
    <div className="contact">
      <span className="contact__label">Contact</span>
      <ul className="contact__list">
        <li>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScholarCompass on Instagram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
            </svg>
            Instagram
          </a>
        </li>
        <li>
          <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`Email ScholarCompass at ${CONTACT_EMAIL}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 6 12 12.5 20.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {CONTACT_EMAIL}
          </a>
        </li>
      </ul>
    </div>
  );
}
