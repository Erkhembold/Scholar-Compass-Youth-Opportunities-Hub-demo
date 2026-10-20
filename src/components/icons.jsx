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

// Bookmark toggle icon — outline when unsaved, filled when saved. Kept as
// one component with a `filled` prop rather than two, so BookmarkButton
// can swap the visual state without swapping components.
export function IconBookmark({ filled = false, ...props }) {
  return (
    <svg {...common} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M6.5 4A1.5 1.5 0 0 1 8 2.5h8A1.5 1.5 0 0 1 17.5 4v17l-5.5-4-5.5 4Z" />
    </svg>
  );
}

export function IconFlame(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 3c.6 3.2 4.5 5.1 4.5 9.6A4.5 4.5 0 0 1 12 17a4.5 4.5 0 0 1-4.5-4.4c0-1.6.7-2.7 1.6-3.7.2 1.2.8 1.9 1.6 2.1C10.4 8.2 10.8 5.4 12 3Z" />
      <path d="M8 18.5a5.5 5.5 0 0 0 8 0" />
    </svg>
  );
}

// Icons that replace the decorative emoji the interface used to show.
export function IconBookOpen(props) {
  return (
    <svg {...common} {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function IconBook(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </svg>
  );
}

export function IconSigma(props) {
  return (
    <svg {...common} {...props}>
      <path d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}

export function IconCalculator(props) {
  return (
    <svg {...common} {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <path d="M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
    </svg>
  );
}

export function IconBolt(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

export function IconGlobe(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IconPencil(props) {
  return (
    <svg {...common} {...props}>
      <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...common} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconHeadphones(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export function IconMic(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}
