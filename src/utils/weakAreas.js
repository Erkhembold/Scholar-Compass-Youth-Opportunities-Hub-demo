// Weak-area diagnosis: which category/domain/skill a student should
// practice next, computed only from real answer history, never guessed.
// "Not enough data" is a first-class outcome, not an edge case — see
// MIN_SAMPLE in utils/progress.js (a single wrong answer out of one is
// never reported as a weak area).
import { MIN_SAMPLE, summarizeSatRW, summarizeSatMath, summarizeIeltsExercises, isIeltsWritingExerciseId } from "./progress.js";

// Lowest-mastery / lowest-accuracy entry that has met the sample
// threshold, or null with a reason if nothing qualifies yet.
function pickWeakest(entries, { rateKey, sampleKey }) {
  const eligible = entries.filter((e) => e[sampleKey] >= MIN_SAMPLE);
  if (eligible.length === 0) {
    const anyAttempts = entries.some((e) => e[sampleKey] > 0);
    return { weakest: null, reason: anyAttempts ? "not_enough_data" : "no_data" };
  }
  const weakest = eligible.reduce((worst, e) => (e[rateKey] < worst[rateKey] ? e : worst));
  return { weakest, reason: null };
}

export function diagnoseSatRW(rows) {
  const { categories } = summarizeSatRW(rows);
  const withRate = categories.map((c) => ({ ...c, mastery: c.seen ? c.mastered / c.seen : 0 }));
  const { weakest, reason } = pickWeakest(withRate, { rateKey: "mastery", sampleKey: "seen" });
  return {
    subject: "sat_rw",
    weakest: weakest ? { id: weakest.id, label: weakest.label, rate: weakest.mastery, sample: weakest.seen, metric: "mastery" } : null,
    reason,
  };
}

export function diagnoseSatMath(exerciseRows, matchAnswerRows) {
  const { domains } = summarizeSatMath(exerciseRows, matchAnswerRows);
  const { weakest, reason } = pickWeakest(domains, { rateKey: "accuracy", sampleKey: "attempted" });
  return {
    subject: "sat_math",
    weakest: weakest ? { id: weakest.id, label: weakest.label, rate: weakest.accuracy, sample: weakest.attempted, metric: "accuracy" } : null,
    reason,
  };
}

export function diagnoseIeltsReading(exerciseRows) {
  // Reading only: Writing-exercise attempts share this table (and a couple of
  // skill tags, e.g. cause_effect), and would otherwise surface as a weak
  // "IELTS Reading" topic like "Grammar".
  const readingRows = (exerciseRows || []).filter((r) => !isIeltsWritingExerciseId(r.exercise_id));
  const { skills } = summarizeIeltsExercises(readingRows);
  const { weakest, reason } = pickWeakest(skills, { rateKey: "accuracy", sampleKey: "attempted" });
  return {
    subject: "ielts_reading",
    weakest: weakest ? { id: weakest.id, label: weakest.label, rate: weakest.accuracy, sample: weakest.attempted, metric: "accuracy" } : null,
    reason,
  };
}

export function buildWeakAreas({ satProgressRows, satMathExerciseRows, satMathAnswerRows, ieltsExerciseRows }) {
  return {
    satRW: diagnoseSatRW(satProgressRows),
    satMath: diagnoseSatMath(satMathExerciseRows, satMathAnswerRows),
    ieltsReading: diagnoseIeltsReading(ieltsExerciseRows),
  };
}
