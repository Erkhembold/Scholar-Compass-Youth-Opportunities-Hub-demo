// Personalized roadmap: an ordered, adaptive checklist per subject,
// derived entirely from real progress + weak-area data (utils/progress.js,
// utils/weakAreas.js) — never a fixed script, never guessed content.
// Pure functions, no network calls, so this is directly unit-testable.
//
// A step is one of:
//   done      — the condition it represents is already satisfied; stays
//               visible (checked), never hidden, per the spec's "if a
//               user has already completed a step, do not continue
//               showing it as incomplete."
//   current   — the first not-done step; the one thing to do next.
//   upcoming  — later, not-yet-relevant steps.
//
// MASTERY_BAR is the bar a weak area must clear before its "practice this"
// step counts as done — deliberately higher than the streak/weak-area
// MIN_SAMPLE threshold's bar (which only decides whether we're confident
// enough to name a weak area at all, not whether it's fixed).
const MASTERY_BAR = 0.7;

function step(id, title, done) {
  return { id, title, done };
}

// ---- SAT ----------------------------------------------------------------
export function buildSatRoadmap({ sat, weakArea }) {
  const hasGoal = sat.targetScore != null || sat.hasPractice;
  if (!hasGoal) {
    return [step("sat-set-target", "Set a SAT target score to get your personalized roadmap", false)];
  }

  const steps = [step("sat-set-target", "Set your SAT target score", sat.targetScore != null)];

  steps.push(
    step("sat-first-practice", "Answer some SAT Reading & Writing and Math questions", sat.hasPractice)
  );

  if (sat.hasPractice) {
    const rwReady = weakArea.satRW.weakest != null;
    const mathReady = weakArea.satMath.weakest != null;
    if (!rwReady || !mathReady) {
      steps.push(
        step(
          "sat-more-data",
          "Answer a few more questions in each area so we can find your weak spots",
          rwReady && mathReady
        )
      );
    }
    if (weakArea.satMath.weakest) {
      const w = weakArea.satMath.weakest;
      steps.push(step("sat-practice-math-weak", `Practice ${w.label} (SAT Math)`, w.rate >= MASTERY_BAR));
    }
    if (weakArea.satRW.weakest) {
      const w = weakArea.satRW.weakest;
      steps.push(step("sat-practice-rw-weak", `Practice ${w.label} (SAT Reading & Writing)`, w.rate >= MASTERY_BAR));
    }
  }

  steps.push(step("sat-keep-practicing", "Keep practicing toward your target score", false));
  return steps;
}

// ---- IELTS ----------------------------------------------------------------
export function buildIeltsRoadmap({ ielts, weakArea }) {
  const hasGoal = ielts.targetBand != null || ielts.hasPractice;
  if (!hasGoal) {
    return [step("ielts-set-target", "Set an IELTS target band to get your personalized roadmap", false)];
  }

  const steps = [step("ielts-set-target", "Set your IELTS target band", ielts.targetBand != null)];

  steps.push(step("ielts-first-practice", "Try a few IELTS Reading exercises", ielts.exercises.attempted > 0));
  steps.push(step("ielts-diagnostic", "Take a full IELTS mock test for a real band score", ielts.mockCount > 0));

  if (weakArea.ieltsReading.weakest) {
    const w = weakArea.ieltsReading.weakest;
    steps.push(step("ielts-practice-weak", `Practice ${w.label} (IELTS Reading)`, w.rate >= MASTERY_BAR));
  } else if (ielts.exercises.attempted > 0) {
    steps.push(
      step(
        "ielts-more-data",
        "Try a few more Reading exercises so we can find your weak spots",
        weakArea.ieltsReading.weakest != null
      )
    );
  }

  steps.push(step("ielts-keep-practicing", "Keep practicing toward your target band", false));
  return steps;
}

// Marks the first not-done step "current"; everything before it is
// implicitly done, everything after is upcoming. Returns the same steps
// with a `status` field added, plus `nextStep` (null if every step is done).
export function withStatus(steps) {
  let currentAssigned = false;
  const withStatuses = steps.map((s) => {
    if (s.done) return { ...s, status: "done" };
    if (!currentAssigned) {
      currentAssigned = true;
      return { ...s, status: "current" };
    }
    return { ...s, status: "upcoming" };
  });
  return { steps: withStatuses, nextStep: withStatuses.find((s) => s.status === "current") || null };
}

export function buildRoadmap({ progress, weakAreas }) {
  const sat = withStatus(buildSatRoadmap({ sat: progress.sat, weakArea: { satRW: weakAreas.satRW, satMath: weakAreas.satMath } }));
  const ielts = withStatus(buildIeltsRoadmap({ ielts: progress.ielts, weakArea: { ieltsReading: weakAreas.ieltsReading } }));
  return { sat, ielts };
}
