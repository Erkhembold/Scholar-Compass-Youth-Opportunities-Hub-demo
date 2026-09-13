import FollowBar from "./FollowBar.jsx";
import ContactSection from "./ContactSection.jsx";
import { FOOTER_CATEGORIES, SITE_NAME } from "../data/config.js";
import { categoryHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <FollowBar />

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__name">{SITE_NAME}</span>
          <p>
            {t(
              "A student opportunity hub for scholarships, competitions, volunteering, internships, and test-prep guidance — built so the next opportunity is easier to find than the last one."
            )}
          </p>
        </div>

        <nav className="site-footer__categories" aria-label="Categories">
          <span className="contact__label">{t("Opportunities")}</span>
          <ul>
            {FOOTER_CATEGORIES.map((cat) => (
              <li key={cat.label}>
                <a href={categoryHref(cat.category)}>{t(cat.label)}</a>
              </li>
            ))}
          </ul>
        </nav>

        <ContactSection />
      </div>

      <div className="site-footer__bottom">
        <p>&copy; {year} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
