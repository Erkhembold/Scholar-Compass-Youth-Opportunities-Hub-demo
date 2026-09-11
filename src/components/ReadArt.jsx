// Topic-illustrated cover art for Suggested Reads cards. Each category gets
// a distinct hand-drawn icon over a brand-consistent gradient, so cards read
// as real editorial covers rather than abstract placeholders — no external
// images or licensing to worry about, since it's all drawn in code.

const ICONS = {
  ielts: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M100 65c-14-6-30-6-42 0v58c12-6 28-6 42 0Z" />
      <path d="M100 65c14-6 30-6 42 0v58c-12-6-28-6-42 0Z" />
      <path d="M100 65v58" />
    </g>
  ),
  sat: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M78 118 84 96l38-38 12 12-38 38-18 6Z" />
      <path d="M114 66l12 12" />
      <circle cx="128" cy="104" r="20" />
      <path d="M119 104l6 6 12-13" />
    </g>
  ),
  scholarships: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 84l40-18 40 18-40 18Z" />
      <path d="M78 92v22c0 6 10 12 22 12s22-6 22-12V92" />
      <path d="M132 88v22" />
    </g>
  ),
  "9th grade": (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M76 76c0-8 10-14 24-14s24 6 24 14" />
      <rect x="70" y="76" width="60" height="48" rx="10" />
      <path d="M88 76v-6a12 12 0 0 1 24 0v6" />
      <path d="M92 96h16" />
    </g>
  ),
  applications: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="74" y="66" width="52" height="62" rx="6" />
      <path d="M88 62h24a4 4 0 0 1 4 4v4H84v-4a4 4 0 0 1 4-4Z" />
      <path d="M85 96l9 9 18-20" />
    </g>
  ),
  competitions: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M82 66h36v20c0 12-8 22-18 22s-18-10-18-22Z" />
      <path d="M82 70h-8c0 12 6 18 14 20" />
      <path d="M118 70h8c0 12-6 18-14 20" />
      <path d="M100 108v10M88 128h24l-4-10h-16Z" />
    </g>
  ),
  volunteering: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M100 116c-18-11-30-21-30-34a15 15 0 0 1 30-7 15 15 0 0 1 30 7c0 13-12 23-30 34Z" />
    </g>
  ),
  internships: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="66" y="82" width="68" height="42" rx="6" />
      <path d="M86 82v-8a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v8" />
      <path d="M66 100h68" />
      <rect x="92" y="94" width="16" height="12" rx="2" />
    </g>
  ),
  projects: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M100 62c-14 0-24 10-24 22 0 8 4 13 8 17 3 3 5 5 5 9h22c0-4 2-6 5-9 4-4 8-9 8-17 0-12-10-22-24-22Z" />
      <path d="M91 118h18M94 124h12" />
    </g>
  ),
  "profile building": (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M68 72l32-12 32 12-32 12Z" />
      <path d="M68 88l32 12 32-12" />
      <path d="M68 104l32 12 32-12" />
    </g>
  ),
  "test prep": (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="100" cy="95" r="30" />
      <circle cx="100" cy="95" r="17" />
      <circle cx="100" cy="95" r="4" fill="var(--white)" />
    </g>
  ),
  opportunities: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="100" cy="95" r="30" />
      <path d="M112 83l-9 20-20 9 9-20Z" fill="var(--blue-300)" fillOpacity="0.5" />
    </g>
  ),
  "student life": (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M68 70h48a10 10 0 0 1 10 10v18a10 10 0 0 1-10 10H92l-14 12v-12h-2a10 10 0 0 1-8-10V80a10 10 0 0 1 8-10Z" />
    </g>
  ),
  essays: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M72 128l6-20 42-42 14 14-42 42-20 6Z" />
      <path d="M112 72l14 14" />
    </g>
  ),
  deadlines: (
    <g fill="none" stroke="var(--white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="68" y="70" width="64" height="52" rx="6" />
      <path d="M68 84h64" />
      <path d="M84 62v14M116 62v14" />
      <path d="M88 98l8 8 16-16" />
    </g>
  ),
};

const FALLBACK = ICONS.opportunities;

export default function ReadArt({ category, pattern = "grid" }) {
  const icon = ICONS[(category || "").toLowerCase()] || FALLBACK;
  const gradientId = `read-art-grad-${(category || "default").replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg
      className={`read-art read-art--${pattern}`}
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--navy-900)" />
          <stop offset="100%" stopColor="var(--navy-700)" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${gradientId})`} />
      <circle cx="332" cy="30" r="90" fill="var(--blue-500)" opacity="0.16" />
      <g transform="translate(200,112.5) scale(1.6) translate(-100,-95)">{icon}</g>
    </svg>
  );
}
