import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE_NAME } from "../data/config.js";
import { categoryHref, leaderboardHref, profileHref, signInHref, useRoute } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import TextSizeToggle from "./TextSizeToggle.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import logoIcon from "../assets/brand/scholarcompass-icon.png";

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
    setProfileOpen(false); // the profile dropdown always closes once you navigate
  }, [route.name, route.category, route.id]);

  useEffect(() => {
    if (!profileOpen) return;
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setProfileOpen(false);
        profileRef.current?.querySelector("button")?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const isActive = (category) => route.name === "category" && route.category === category;

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="wordmark" href="#/" onClick={() => setOpen(false)}>
          <span className="wordmark__mark" aria-hidden="true">
            <img src={logoIcon} alt="" className="wordmark__mark-img" />
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
          <LanguageToggle className="header-only-control" />
          <TextSizeToggle className="header-only-control" />
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
          <ThemeToggle className="header-only-control" />
          {user ? (
            <div className="profile-menu" ref={profileRef}>
              <button
                type="button"
                className="signin-btn profile-menu__trigger"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                aria-label={t("Profile")}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <Avatar path={profile?.avatar_path} name={profile?.name} size={26} />
                <span className="profile-menu__trigger-label">{t("Profile")}</span>
                <span className="profile-menu__caret" aria-hidden="true" data-open={profileOpen} />
              </button>
              {profileOpen && (
                <div className="profile-menu__dropdown" role="menu">
                  <div className="profile-menu__head">
                    <Avatar path={profile?.avatar_path} name={profile?.name} size={44} />
                    <div className="profile-menu__who">
                      <p className="profile-menu__name">{profile?.name || "ScholarCompass user"}</p>
                      <p className="profile-menu__email">{user.email}</p>
                    </div>
                  </div>
                  <a
                    className="profile-menu__link"
                    href={profileHref()}
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    View profile
                  </a>
                  <a
                    className="profile-menu__link"
                    href="#/"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    My dashboard
                  </a>
                  <button
                    type="button"
                    className="profile-menu__link profile-menu__signout"
                    role="menuitem"
                    onClick={async () => {
                      setProfileOpen(false);
                      await signOut();
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
        <div className="mobile-nav__toggles">
          <LanguageToggle />
          <TextSizeToggle />
          <ThemeToggle />
        </div>
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
