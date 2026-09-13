import TiltImage from "./TiltImage.jsx";
import HoverText from "./HoverText.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import heroImage from "../assets/student-raising-hand.png";

const CATEGORIES = [
  "Scholarships",
  "Competitions",
  "Volunteering",
  "Internships",
  "IELTS",
  "SAT",
];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero hero--home" aria-label="Introduction">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Student opportunity hub</p>
          <h1 className="hero__headline">
            <HoverText text="Opportunities don’t just happen." className="hero__headline-line" />
            <br />
            <HoverText text="You build them." className="hero__headline-line" />
          </h1>
          <p className="hero__lede">
            {t(
              "ScholarCompass brings scholarships, competitions, volunteering, internships, and test-prep guidance into one place, so finding your next step takes minutes instead of a dozen open tabs."
            )}
          </p>
          <div className="hero__actions">
            <a className="btn btn--accent" href="#opportunities">
              {t("Explore Opportunities")}
            </a>
            <a className="btn btn--ghost" href="#notify">
              {t("Get Notified")}
            </a>
          </div>
          <ul className="hero__categories">
            {CATEGORIES.map((cat) => (
              <li key={cat}>{t(cat)}</li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <TiltImage
            src={heroImage}
            alt="A student raises their hand to ask a question during a classroom presentation."
          />
        </div>
      </div>
    </section>
  );
}
