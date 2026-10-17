import { MIN_SAMPLE, buildOverallStats } from "./progress.js";

// Rows for the dashboard's "Your weakest areas" list, built only from real
// answer history. Every SAT Reading & Writing category, SAT Math domain and
// IELTS Reading skill that has at least MIN_SAMPLE attempts is a candidate;
// the lowest few are returned (lowest rate first). Nothing is invented: with
// too little data the list is empty and the UI says so.
//   SAT R&W   rate = mastered / seen   (sat_progress is a sticky mastery flag)
//   SAT Math  rate = accuracy
//   IELTS     rate = accuracy (Reading drills only)
export function buildWeakestList(progress, limit = 4) {
  if (!progress) return [];
  const rows = [];
  for (const c of progress.sat.rw.categories) {
    if (c.seen >= MIN_SAMPLE) {
      rows.push({ key: `rw-${c.id}`, subject: "SAT Reading & Writing", label: c.label, rate: c.mastered / c.seen, sample: c.seen, metric: "mastered" });
    }
  }
  for (const d of progress.sat.math.domains) {
    if (d.attempted >= MIN_SAMPLE) {
      rows.push({ key: `math-${d.id}`, subject: "SAT Math", label: d.label, rate: d.correct / d.attempted, sample: d.attempted, metric: "accuracy" });
    }
  }
  for (const s of progress.ielts.exercises.skills) {
    if (s.attempted >= MIN_SAMPLE) {
      rows.push({ key: `ielts-${s.id}`, subject: "IELTS Reading", label: s.label, rate: s.correct / s.attempted, sample: s.attempted, metric: "accuracy" });
    }
  }
  return rows.sort((a, b) => a.rate - b.rate || b.sample - a.sample).slice(0, limit);
}

export function percent(rate) {
  return Math.round((rate || 0) * 100);
}

// Headline numbers for the four "Your progress" cards. `rwTotal` is the size of
// the SAT Reading & Writing bank (passed in so this file stays dependency-free).
export function buildProgressCards(progress, rwTotal) {
  if (!progress) return null;
  const overall = buildOverallStats(progress);
  const { sat, ielts } = progress;
  const reading = ielts.exercises.reading;
  return {
    answered: { value: overall.totalAnswered, accuracy: overall.accuracy == null ? null : percent(overall.accuracy) },
    rw: { mastered: sat.rw.mastered, total: rwTotal, seen: sat.rw.seen, fraction: rwTotal ? sat.rw.mastered / rwTotal : 0 },
    math: { attempted: sat.math.attempted, correct: sat.math.correct, accuracy: sat.math.accuracy },
    ielts: {
      attempted: reading.attempted,
      correct: reading.correct,
      accuracy: reading.accuracy,
      latestBand: ielts.latestBand,
      targetBand: ielts.targetBand,
    },
  };
}
