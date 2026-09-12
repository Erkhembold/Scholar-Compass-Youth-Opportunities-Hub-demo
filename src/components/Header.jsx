import { useEffect, useState } from "react";
import { NAV_LINKS, SITE_NAME } from "../data/config.js";
import { categoryHref, signInHref, useRoute } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const route = useRoute();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [route.name, route.category, route.id]);

  const isActive = (category) => route.name === "category" && route.category === category;

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="wordmark" href="#/" onClick={() => setOpen(false)}>
          <span className="wordmark__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <circle cx="16" cy="16" r="11" fill="none" stroke="#0A84FF" strokeWidth="1.8" />
              <path d="M20.5 11.5 L14.4 14.4 L11.5 20.5 L17.6 17.6 Z" fill="#5AC8FA" />
            </svg>
          </span>
          <span className="wordmark__text">{SITE_NAME}</span>
        </a>

        <nav className="primary-nav" aria-label="Primary">
          <ul>
            <li>
              <a href="#/" aria-current={route.name === "home" ? "page" : undefined}>
                {t("Home")}
              </a>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={categoryHref(link.category)}
                  aria-current={isActive(link.category) ? "page" : undefined}
                  className={isActive(link.category) ? "is-active" : ""}
                >
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--accent btn--small" href="#notify">
            {t("Get notified")}
          </a>
          <LanguageToggle />
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <ThemeToggle />
          <a className="signin-btn" href={signInHref()}>
            {t("Sign In")}
          </a>
        </div>
      </div>

      <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile" hidden={!open}>
        <ul>
          <li>
            <a href="#/" aria-current={route.name === "home" ? "page" : undefined}>
              {t("Home")}
            </a>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={categoryHref(link.category)}
                aria-current={isActive(link.category) ? "page" : undefined}
                className={isActive(link.category) ? "is-active" : ""}
              >
                {t(link.label)}
              </a>
            </li>
          ))}
          <li>
            <a className="btn btn--accent" href="#notify">
              {t("Get notified")}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
