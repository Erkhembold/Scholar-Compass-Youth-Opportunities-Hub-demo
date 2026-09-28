const STORAGE_KEY = "scholarcompass-theme";

export function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (e) {
    // localStorage unavailable (private browsing, etc.) — fall through
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Single shared theme store. Header renders two ThemeToggle instances (desktop
// bar + mobile menu); each used to keep its own useState copy, so flipping one
// left the other showing the wrong icon/label until remount. Every toggle now
// subscribes to the same source of truth instead.
const listeners = new Set();

export function getTheme() {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" || attr === "light" ? attr : getInitialTheme();
}

export function subscribeTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  listeners.forEach((fn) => fn());
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // ignore write failures
  }
}
