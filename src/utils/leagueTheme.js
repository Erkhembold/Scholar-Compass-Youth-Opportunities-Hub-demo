import { LEAGUES } from "../data/leagues.js";

// Central, theme-aware league color system.
//
// Problem this replaces: each league used to be ONE `primary` plus a light
// pastel `soft`, injected as inline CSS variables. The pastel stayed pastel
// in dark mode while text flipped to near-white — so league cards/badges were
// white-on-pastel, and solid chips hardcoded `#fff` even on light tiers
// (Gold, Silver, Pearl, Diamond).
//
// Now every league resolves to the same semantic tokens, per theme:
//   --league-bg      card / badge background
//   --league-fg      main text on that background   (>= 7:1)
//   --league-muted   secondary text on that background (>= 4.5:1)
//   --league-border  outline
//   --league-accent  stripes / dots / decorative color (>= 3:1 vs the theme)
//   --league-chip-bg / --league-chip-fg   solid pill (accent + best text)
//
// Components never touch league hex values: they set `data-league="<id>"` and
// use the tokens. The tokens are derived from each tier's identity color
// (`primary`) and verified by scripts/check-league-contrast.mjs, so changing
// a color in data/leagues.js can't silently reintroduce unreadable tiers.

const INK = "#0b1220"; // dark text used across the site
const WHITE = "#ffffff";
const DARK_BASE = "#0d1526"; // tint base for dark-mode league backgrounds
const DARK_PAGE = "#101828"; // matches --white (card surface) in dark mode

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

export function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
}

// mix(a, b, t): t=0 -> a, t=1 -> b
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Move `color` toward `target` in small steps until it reaches `min`
// contrast against `against`. Keeps as much of the hue as possible.
function pushUntil(color, target, against, min) {
  for (let t = 0; t <= 1.0001; t += 0.02) {
    const c = mix(color, target, Math.min(t, 1));
    if (contrast(c, against) >= min) return c;
  }
  return target;
}

// Weaken `fg` toward `bg` as far as it can go while staying >= min contrast.
function softenUntil(fg, bg, min) {
  let best = fg;
  for (let t = 0; t <= 1; t += 0.02) {
    const c = mix(fg, bg, t);
    if (contrast(c, bg) >= min) best = c;
    else break;
  }
  return best;
}

function bestChipText(bg) {
  return contrast(WHITE, bg) >= contrast(INK, bg) ? WHITE : INK;
}

// Neutral tiers can't carry "identity" through hue alone in dark mode
// (Obsidian is near-black on a near-black page), so a tier may set an
// explicit dark-mode accent.
const DARK_ACCENT_OVERRIDE = { obsidian: "#9aa3b2" };

export function leagueTokens(league) {
  // ---- light theme ----
  const lightBg = league.soft;
  const lightFg = pushUntil(league.primary, INK, lightBg, 7);
  const light = {
    bg: lightBg,
    fg: lightFg,
    muted: softenUntil(lightFg, lightBg, 4.6),
    // Same hue, darkened only as far as needed so the stripe/border stays
    // visible (3:1) on the tier's own card — matters for the naturally pale
    // tiers (Silver, Gold, Pearl, Diamond). The chip keeps the true color.
    accent: pushUntil(league.primary, INK, lightBg, 3),
    border: mix(pushUntil(league.primary, INK, lightBg, 3), lightBg, 0.5),
    chipBg: league.primary,
    chipFg: bestChipText(league.primary),
  };

  // ---- dark theme ----
  const darkBg = mix(DARK_BASE, league.primary, 0.2);
  let darkAccent = DARK_ACCENT_OVERRIDE[league.id] || league.primary;
  // visible on the tier card (the stricter surface) and on the page
  darkAccent = pushUntil(darkAccent, WHITE, darkBg, 3.05);
  darkAccent = pushUntil(darkAccent, WHITE, DARK_PAGE, 3.05);
  const darkFg = pushUntil(league.primary, WHITE, darkBg, 7);
  const dark = {
    bg: darkBg,
    fg: darkFg,
    muted: softenUntil(darkFg, darkBg, 4.6),
    border: mix(darkAccent, darkBg, 0.5),
    accent: darkAccent,
    chipBg: darkAccent,
    chipFg: bestChipText(darkAccent),
  };

  return { light, dark };
}

export const LEAGUE_TOKENS = Object.fromEntries(
  LEAGUES.map((l) => [l.id, leagueTokens(l)])
);

const decl = (t) =>
  [
    `--league-bg:${t.bg}`,
    `--league-fg:${t.fg}`,
    `--league-muted:${t.muted}`,
    `--league-border:${t.border}`,
    `--league-accent:${t.accent}`,
    `--league-chip-bg:${t.chipBg}`,
    `--league-chip-fg:${t.chipFg}`,
  ].join(";");

// One rule per tier per theme. Because these hang off `[data-theme]` /
// `[data-league]` attributes (not React state), a theme switch re-colors every
// league surface instantly with no re-render and no stale inline colors.
export function buildLeagueCss() {
  return LEAGUES.map((l) => {
    const { light, dark } = LEAGUE_TOKENS[l.id];
    return (
      `[data-league="${l.id}"]{${decl(light)}}` +
      `[data-theme="dark"] [data-league="${l.id}"],` +
      `[data-theme="dark"][data-league="${l.id}"]{${decl(dark)}}`
    );
  }).join("\n");
}

export function injectLeagueTokens() {
  if (typeof document === "undefined") return;
  let el = document.getElementById("league-tokens");
  if (!el) {
    el = document.createElement("style");
    el.id = "league-tokens";
    document.head.appendChild(el);
  }
  el.textContent = buildLeagueCss();
}
