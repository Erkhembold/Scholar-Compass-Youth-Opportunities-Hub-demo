// Pure helpers for the first-run onboarding form, kept out of the page so
// they can be unit-tested. The ranges mirror the CHECK constraints in
// supabase/public_profiles_and_avatars.sql (SAT 400-1600, IELTS 1-9 in
// half-band steps): a value outside them would make the database reject the
// WHOLE save, so the page validates first and says what is wrong.

export function validateTargets({ preparingSat, satTarget, preparingIelts, ieltsTarget }) {
  if (preparingSat && satTarget !== "" && satTarget != null) {
    const n = Number(satTarget);
    if (!Number.isFinite(n) || n < 400 || n > 1600) return "SAT target score must be between 400 and 1600.";
  }
  if (preparingIelts && ieltsTarget !== "" && ieltsTarget != null) {
    const n = Number(ieltsTarget);
    if (!Number.isFinite(n) || n < 1 || n > 9 || n * 2 !== Math.floor(n * 2)) {
      return "IELTS target band must be between 1 and 9, in steps of 0.5 (for example 6.5).";
    }
  }
  return null;
}

// Arguments for the complete_onboarding() database function.
export function buildOnboardingArgs({ grade, countries, field, preparingSat, satTarget, preparingIelts, ieltsTarget }) {
  return {
    p_grade: grade || null,
    p_countries: countries && countries.length ? countries : null,
    p_major: field || null,
    p_prep_sat: preparingSat ?? null,
    p_sat_target: preparingSat && satTarget !== "" && satTarget != null ? Number(satTarget) : null,
    p_prep_ielts: preparingIelts ?? null,
    p_ielts_target: preparingIelts && ieltsTarget !== "" && ieltsTarget != null ? Number(ieltsTarget) : null,
  };
}

// The same answers as plain profile columns (used if the database function
// has not been installed yet).
export function argsToProfileFields(a) {
  return {
    grade: a.p_grade,
    intended_countries: a.p_countries,
    intended_major: a.p_major,
    preparing_for_sat: a.p_prep_sat,
    sat_target_score: a.p_sat_target,
    preparing_for_ielts: a.p_prep_ielts,
    ielts_target_score: a.p_ielts_target,
    onboarding_completed: true,
  };
}
