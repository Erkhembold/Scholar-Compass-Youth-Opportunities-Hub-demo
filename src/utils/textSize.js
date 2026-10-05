const STORAGE_KEY = "scholarcompass-text-size";
const VALID_SIZES = new Set(["standard", "large", "larger"]);
const listeners = new Set();

export function getTextSize() {
  if (typeof document === "undefined") return "standard";
  const size = document.documentElement.getAttribute("data-text-size");
  return VALID_SIZES.has(size) ? size : "standard";
}

export function subscribeTextSize(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function applyTextSize(size) {
  if (!VALID_SIZES.has(size)) return;

  document.documentElement.setAttribute("data-text-size", size);
  try {
    if (size === "standard") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, size);
    }
  } catch {
    // The preference still applies for this page when storage is unavailable.
  }

  listeners.forEach((listener) => listener());
}

export function getNextTextSize(size) {
  if (size === "standard") return "large";
  if (size === "large") return "larger";
  return "standard";
}
