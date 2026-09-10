// Display label for every category value that can appear in opportunity
// data — including "events", which intentionally has no nav entry or
// filter chip (see NAV_LINKS in config.js and FILTERS in opportunities.js).
// It only ever surfaces here, as the tag shown on a card/detail page.
export const CATEGORY_LABELS = {
  scholarships: "Scholarship",
  competitions: "Competition",
  volunteering: "Volunteering",
  internships: "Internship",
  ielts: "IELTS",
  sat: "SAT",
  events: "Event",
};

// Intro copy + a placeholder-art pattern for each of the six navbar
// categories' dedicated pages. "events" is deliberately absent — it has
// no nav entry and no standalone page.
export const CATEGORY_META = {
  ielts: {
    label: "IELTS",
    pattern: "grid",
    intro:
      "IELTS prep here means practical resources: writing feedback, speaking practice, and realistic band-score benchmarks, not just theory. If you're aiming for a specific score for university admission, study plans and practice-test guidance will be added here as they're ready.",
  },
  sat: {
    label: "SAT",
    pattern: "dots",
    intro:
      "SAT resources here focus on what actually moves a score: timed section practice, common mistake breakdowns, and a study calendar that fits around a normal school week. Expect guidance on when to sit the test relative to your application deadlines.",
  },
  competitions: {
    label: "Competitions",
    pattern: "diagonal",
    intro:
      "From science olympiads to essay prizes, this is where academic and creative competitions worth your weekends get listed, each with a real deadline and a clear sense of what it's actually judging. Check back as new contests are added.",
  },
  volunteering: {
    label: "Volunteering",
    pattern: "radial",
    intro:
      "Volunteering opportunities here range from single event days to ongoing community roles, in Ulaanbaatar and beyond. Every listing is upfront about the time commitment, so you know what you're signing up for before you register.",
  },
  internships: {
    label: "Internships",
    pattern: "stripe",
    intro:
      "Internships posted here are aimed at secondary and gap-year students getting a first real look at a workplace, paid or unpaid, remote or in-person. Listings describe what you'd actually be doing, not just a job title.",
  },
  scholarships: {
    label: "Scholarships",
    pattern: "grid",
    intro:
      "Scholarships listed here cover tuition support, merit awards, and sponsor-run ambassador programs open to students in Mongolia and abroad. Each entry lays out eligibility and what applying actually requires.",
  },
};

export const CATEGORY_ORDER = [
  "ielts",
  "sat",
  "competitions",
  "volunteering",
  "internships",
  "scholarships",
];
