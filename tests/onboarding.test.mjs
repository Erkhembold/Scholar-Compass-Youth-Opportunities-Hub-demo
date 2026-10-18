import test from "node:test";
import assert from "node:assert/strict";
import { validateTargets, buildOnboardingArgs, argsToProfileFields } from "../src/utils/onboarding.js";

test("valid and blank targets pass", () => {
  assert.equal(validateTargets({ preparingSat: true, satTarget: "1400", preparingIelts: true, ieltsTarget: "6.5" }), null);
  assert.equal(validateTargets({ preparingSat: true, satTarget: "", preparingIelts: null, ieltsTarget: "" }), null);
});
test("out-of-range targets are caught before saving", () => {
  assert.match(validateTargets({ preparingSat: true, satTarget: "1700" }), /SAT/);
  assert.match(validateTargets({ preparingSat: true, satTarget: "300" }), /SAT/);
  assert.match(validateTargets({ preparingIelts: true, ieltsTarget: "6.3" }), /IELTS/);
  assert.match(validateTargets({ preparingIelts: true, ieltsTarget: "10" }), /IELTS/);
});
test("a target for a test you are not preparing for is ignored", () => {
  assert.equal(validateTargets({ preparingSat: false, satTarget: "9999" }), null);
  const a = buildOnboardingArgs({ grade: "", countries: [], field: "", preparingSat: false, satTarget: "1400", preparingIelts: null, ieltsTarget: "7" });
  assert.equal(a.p_sat_target, null);
  assert.equal(a.p_ielts_target, null);
  assert.equal(a.p_countries, null);
  assert.equal(a.p_grade, null);
});
test("args and fallback fields carry the same answers", () => {
  const a = buildOnboardingArgs({ grade: "11", countries: ["Canada"], field: "Business", preparingSat: true, satTarget: "1450", preparingIelts: true, ieltsTarget: "7" });
  assert.deepEqual(a, { p_grade: "11", p_countries: ["Canada"], p_major: "Business", p_prep_sat: true, p_sat_target: 1450, p_prep_ielts: true, p_ielts_target: 7 });
  const f = argsToProfileFields(a);
  assert.equal(f.sat_target_score, 1450);
  assert.equal(f.onboarding_completed, true);
});
