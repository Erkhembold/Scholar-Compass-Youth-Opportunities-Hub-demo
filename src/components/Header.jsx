import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE_NAME } from "../data/config.js";
import { categoryHref, leaderboardHref, profileHref, signInHref, useRoute } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const route = useRoute();
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();

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

  useEffect(() => {
    if (!profileOpen) return;
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [profileOpen]);

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
              <a
                href={leaderboardHref()}
                aria-current={route.name === "leaderboard" ? "page" : undefined}
                className={route.name === "leaderboard" ? "is-active" : ""}
              >
                Leaderboard
              </a>
            </li>
          </ul>
        </nav>

        <div className="site-header__actions">
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
          {user ? (
            <div className="profile-menu" ref={profileRef}>
              <button
                type="button"
                className="signin-btn"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                {t("Profile")}
              </button>
              {profileOpen && (
                <div className="profile-menu__dropdown" role="menu">
                  <p className="profile-menu__name">{profile?.name || "ScholarCompass user"}</p>
                  <p className="profile-menu__email">{user.email}</p>
                  <a className="profile-menu__link" href={profileHref()} role="menuitem">
                    View profile
                  </a>
                  <button
                    type="button"
                    className="profile-menu__link profile-menu__signout"
                    role="menuitem"
                    onClick={async () => {
                      await signOut();
                      setProfileOpen(false);
                      window.location.hash = "#/";
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a className="signin-btn" href={signInHref()}>
              {t("Sign In")}
            </a>
          )}
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
            <a
              href={leaderboardHref()}
              aria-current={route.name === "leaderboard" ? "page" : undefined}
              className={route.name === "leaderboard" ? "is-active" : ""}
            >
              Leaderboard
            </a>
          </li>
          <li>
            <a className="btn btn--accent" href="#notify">
              {t("Get notified")}
            </a>
          </li>
          <li>
            {user ? (
              <a className="btn btn--ghost" href={profileHref()}>
                {t("Profile")}
              </a>
            ) : (
              <a className="btn btn--ghost" href={signInHref()}>
                {t("Sign In")}
              </a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
