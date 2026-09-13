// Centralized configuration. Update real values here once available —
// components read from this file rather than hard-coding strings.

export const NAV_LINKS = [
  { label: "IELTS", category: "ielts" },
  { label: "SAT", category: "sat" },
  { label: "Competitions", category: "competitions" },
  { label: "Volunteer Opportunities", category: "volunteering" },
  { label: "Internships", category: "internships" },
  { label: "Scholarships", category: "scholarships" },
];

export const FOOTER_CATEGORIES = [
  { label: "IELTS", category: "ielts" },
  { label: "SAT", category: "sat" },
  { label: "Scholarships", category: "scholarships" },
  { label: "Competitions", category: "competitions" },
  { label: "Volunteering", category: "volunteering" },
  { label: "Internships", category: "internships" },
];

// TODO: replace with the verified, real ScholarCompass Instagram profile photo
// (see README "Logo asset" section) — do not fabricate a substitute.
export const INSTAGRAM_URL = "https://www.instagram.com/scholarcompass_mongolia/";

// Configurable contact email placeholder — replace with the real inbox
// before launch. Not presented anywhere as a confirmed, live address.
export const CONTACT_EMAIL = "hello@scholarcompass.mn";

export const SITE_NAME = "ScholarCompass";

// Thresholds for the deadline urgency indicator (see utils/deadline.js).
// Change these in one place rather than in each component that shows a
// deadline. Days are inclusive: e.g. redMaxDays: 2 means 0, 1, and 2 days
// remaining all count as "red".
export const DEADLINE_STATUS_RULES = {
  redMaxDays: 2, // 0–2 days remaining
  yellowMaxDays: 7, // 3–7 days remaining
  // anything beyond yellowMaxDays is "green"
};
