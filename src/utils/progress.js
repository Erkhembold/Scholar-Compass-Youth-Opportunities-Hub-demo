// Pure functions that turn raw practice rows into what the dashboard
// shows. No network calls here — see hooks/useProgressData.js for the
// fetching side. Kept separate and dependency-free so the logic below can
// be unit-tested directly (see the test harness used during development).
import { SAT_CATEGORIES } from "../data/satQuestions.js";
import { SAT_MATH_DOMAINS, getSatMathQuestion } from "../data/satMathQuestions.js";
import { TYPE_LABELS } from "./ielts.js";

export const MIN_SAMPLE = 5; // "1 wrong out of 1 isn't a weak area" — spec's rule

// ---- SAT Reading & Writing -------------------------------------------------
// sat_progress is one row per (user, question): a sticky "have they EVER
// gotten this one right" flag, not a per-attempt accuracy log (see
// supabase/sat_progress_schema.sql). So what's real here is a MASTERY rate
// per category — "12 of 20 questions you've tried are mastered" — not an
// attempt-by-attempt accuracy percentage. Reported as such rather than
// relabelled into something the data doesn't actually support.
export function summarizeSatRW(rows) {
  const byCategory = {};
  for (const cat of SAT_CATEGORIES) byCategory[cat.id] = { id: cat.id, label: cat.label, seen: 0, mastered: 0 };
  for (const r of rows || []) {
    const b = byCategory[r.category];
    if (!b) continue;
    b.seen += 1;
    if (r.correct) b.mastered += 1;
  }
  const categories = Object.values(byCategory);
  const seen = categories.reduce((n, c) => n + c.seen, 0);
  const mastered = categories.reduce((n, c) => n + c.mastered, 0);
  return { categories, seen, mastered, attempted: seen };
}

// ---- SAT Math ---------------------------------------------------------------
// Both exercise attempts and 1v1 answers are real per-attempt logs, so a
// true accuracy percentage is meaningful here (unlike R&W above).
export function summarizeSatMath(exerciseRows, matchAnswerRows) {
  const byDomain = {};
  for (const d of SAT_MATH_DOMAINS) byDomain[d.id] = { id: d.id, label: d.short, attempted: 0, correct: 0 };

  for (const r of exerciseRows || []) {
    const b = byDomain[r.domain];
    if (!b) continue;
    b.attempted += 1;
    if (r.correct) b.correct += 1;
  }
  for (const r of matchAnswerRows || []) {
    const q = getSatMathQuestion(r.question_id);
    if (!q) continue; // question retired from the bank since this was answered
    const b = byDomain[q.domain];
    if (!b) continue;
    b.attempted += 1;
    if (r.is_correct) b.correct += 1;
  }

  const domains = Object.values(byDomain).map((d) => ({
    ...d,
    accuracy: d.attempted ? d.correct / d.attempted : null,
  }));
  const attempted = domains.reduce((n, d) => n + d.attempted, 0);
  const correct = domains.reduce((n, d) => n + d.correct, 0);
  return { domains, attempted, correct, accuracy: attempted ? correct / attempted : null };
}

// ---- IELTS Reading exercises (short drills, per-skill accuracy) -----------
export function summarizeIeltsExercises(rows) {
  const bySkill = {};
  let itemsTotal = 0;
  let itemsCorrect = 0;
  for (const r of rows || []) {
    const key = r.skill || r.exercise_type;
    bySkill[key] = bySkill[key] || { id: key, label: TYPE_LABELS[key] || readableSkill(key), attempted: 0, correct: 0 };
    bySkill[key].attempted += 1;
    if (r.correct) bySkill[key].correct += 1;
    itemsTotal += r.items_total || 1;
    itemsCorrect += r.items_correct ?? (r.correct ? 1 : 0);
  }
  const skills = Object.values(bySkill).map((s) => ({ ...s, accuracy: s.attempted ? s.correct / s.attempted : null }));
  return { skills, attempted: rows?.length || 0, itemsTotal, itemsCorrect };
}

function readableSkill(key) {
  return String(key || "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---- Full progress summary for the dashboard -------------------------------
export function buildProgressSummary({ profile, satProgressRows, satMathExerciseRows, satMathAnswerRows, ieltsAttempts, ieltsExerciseRows }) {
  const rw = summarizeSatRW(satProgressRows);
  const math = summarizeSatMath(satMathExerciseRows, satMathAnswerRows);
  const satAttempted = rw.attempted + math.attempted;

  const latestMock = (ieltsAttempts || [])[0] || null; // caller orders desc by completed_at
  const exercises = summarizeIeltsExercises(ieltsExerciseRows);

  return {
    sat: {
      targetScore: profile?.sat_target_score ?? null,
      hasPractice: satAttempted > 0,
      rw,
      math,
      questionsAnswered: satAttempted,
    },
    ielts: {
      targetBand: profile?.ielts_target_score ?? null,
      latestBand: latestMock?.band ?? null,
      latestMockTitle: latestMock?.test_title ?? null,
      mockCount: ieltsAttempts?.length || 0,
      hasPractice: (ieltsAttempts?.length || 0) > 0 || exercises.attempted > 0,
      exercises,
    },
  };
}
