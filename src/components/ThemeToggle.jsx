import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "../utils/theme.js";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M10 2.5v2M10 15.5v2M4.05 4.05l1.4 1.4M14.55 14.55l1.4 1.4M2.5 10h2M15.5 10h2M4.05 15.95l1.4-1.4M14.55 5.45l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M17 11.5A7 7 0 0 1 8.5 3a7 7 0 1 0 8.5 8.5Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
