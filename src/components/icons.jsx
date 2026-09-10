// Minimal line icons matching the rest of the site's hand-drawn inline SVGs
// (see FollowBar / ContactSection). Kept as one file so Essential Information
// rows can import a single `icons` map instead of six separate components.

const common = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function IconTag(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12.6 3.5H6a2.5 2.5 0 0 0-2.5 2.5v6.6a2 2 0 0 0 .59 1.41l8.9 8.9a2 2 0 0 0 2.82 0l6.6-6.6a2 2 0 0 0 0-2.82l-8.9-8.9a2 2 0 0 0-1.41-.59Z" />
      <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  );
}

export function IconCoin(props) {
  return (
    <svg {...common} {...props}>
      <ellipse cx="12" cy="7" rx="7.5" ry="3.2" />
      <path d="M4.5 7v10c0 1.77 3.36 3.2 7.5 3.2s7.5-1.43 7.5-3.2V7" />
      <path d="M4.5 12.2c0 1.77 3.36 3.2 7.5 3.2s7.5-1.43 7.5-3.2" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="8.8" cy="8.2" r="3" />
      <path d="M2.8 19c0-3 2.68-5.2 6-5.2s6 2.2 6 5.2" />
      <path d="M15.5 5.5a3 3 0 0 1 0 5.9" />
      <path d="M17.3 13.9c2.4.5 4 2.4 4 5.1" />
    </svg>
  );
}

export function IconCalendar(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
      <path d="M3.5 9.8h17" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="8.3" r="3.6" />
      <path d="M4.8 19.6c0-3.6 3.2-6.5 7.2-6.5s7.2 2.9 7.2 6.5" />
    </svg>
  );
}

export function IconBuilding(props) {
  return (
    <svg {...common} {...props}>
      <rect x="4" y="3.5" width="10" height="17" rx="1.2" />
      <rect x="14" y="9.5" width="6" height="11" rx="1.2" />
      <path d="M7 7.5h1M10.5 7.5h1M7 11h1M10.5 11h1M7 14.5h1M10.5 14.5h1" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 8h9.5M8 3.5 13 8l-5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconArrowLeft(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13 8H3.5M8 3.5 3 8l5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
