import { useLanguage } from "../context/LanguageContext.jsx";

export default function LanguageToggle({ className = "" }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`lang-switch ${className}`} role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-switch__btn ${lang === "en" ? "lang-switch__btn--active" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="lang-switch__divider" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`lang-switch__btn ${lang === "mn" ? "lang-switch__btn--active" : ""}`}
        aria-pressed={lang === "mn"}
        onClick={() => setLang("mn")}
      >
        MN
      </button>
    </div>
  );
}
