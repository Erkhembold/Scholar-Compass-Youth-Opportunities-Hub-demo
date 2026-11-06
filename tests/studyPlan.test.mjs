import test from "node:test";
import assert from "node:assert/strict";
import {
  plannerState, inviteHidden, formFromState, validateForm, buildSavePayload, generatePlan,
  mondayOf, addDays, dayKeyOf, summarizePlan, milestones, performanceWeakKeys, planAffectingChange, CATALOGUE, PLANNER_VERSION,
} from "../src/utils/studyPlan.js";

const avail = { mon: "60", tue: "45", wed: "", thu: "60", fri: "30", sat: "90", sun: "0" };
const baseForm = () => ({ ...formFromState({ preparing_for_sat: true, preparing_for_ielts: true }, null), availability: { ...avail }, intensity: "balanced", sessionMinutes: 30 });

test("week helpers", () => {
  assert.equal(mondayOf("2026-11-06"), "2026-11-02"); // Friday -> Monday
  assert.equal(mondayOf("2026-11-02"), "2026-11-02");
  assert.equal(mondayOf("2026-11-08"), "2026-11-02"); // Sunday
  assert.equal(addDays("2026-11-30", 1), "2026-12-01");
  assert.equal(dayKeyOf("2026-11-04"), "wed");
});

test("planner state: complete / partial / new", () => {
  assert.equal(plannerState({}, { onboarding_version: PLANNER_VERSION }), "complete");
  assert.equal(plannerState({}, { onboarding_version: 3 }), "complete");
  assert.equal(plannerState({ preparing_for_sat: true }, null), "partial");
  assert.equal(plannerState({ sat_target_date: "2027-03-13" }, { onboarding_version: 0 }), "partial");
  assert.equal(plannerState({}, { onboarding_version: 0, availability: { mon: 30 } }), "partial");
  assert.equal(plannerState({ preparing_for_sat: null }, null), "new");
  assert.equal(plannerState(null, null), "new");
});

test("dismissal only hides while it is in the future", () => {
  assert.equal(inviteHidden({ invite_dismissed_until: new Date(Date.now() + 3600e3).toISOString() }), true);
  assert.equal(inviteHidden({ invite_dismissed_until: new Date(Date.now() - 3600e3).toISOString() }), false);
  assert.equal(inviteHidden(null), false);
});

test("form is pre-filled from existing answers", () => {
  const f = formFromState(
    { preparing_for_sat: true, sat_target_score: 1450, ielts_target_score: 7, sat_target_date: "2027-03-13" },
    { cur_sat: 1250, availability: { mon: 45 }, weak_areas: ["sat-math:algebra"], intensity: "light", session_minutes: 45 }
  );
  assert.equal(f.prepSat, true);
  assert.equal(f.satTarget, "1450");
  assert.equal(f.ieltsTarget, "7");
  assert.equal(f.curSat, "1250");
  assert.equal(f.availability.mon, "45");
  assert.equal(f.availability.tue, "");
  assert.deepEqual(f.weakAreas, ["sat-math:algebra"]);
  assert.equal(f.intensity, "light");
  assert.equal(f.sessionMinutes, 45);
});

test("everything can be skipped; bad values are caught", () => {
  const empty = formFromState(null, null);
  assert.equal(validateForm(empty, "2026-11-06"), null);
  assert.match(validateForm({ ...empty, curSat: "1700" }, "2026-11-06"), /SAT/);
  assert.match(validateForm({ ...empty, curSatMath: "100" }, "2026-11-06"), /200 and 800/);
  assert.match(validateForm({ ...empty, ieltsTarget: "6.3" }, "2026-11-06"), /IELTS/);
  assert.match(validateForm({ ...empty, satDate: "2026-01-01" }, "2026-11-06"), /past/);
  assert.match(validateForm({ ...empty, satDate: "2026-13-45" }, "2026-11-06"), /valid/);
  assert.equal(validateForm({ ...empty, satDate: "2027-03-13" }, "2026-11-06"), null);
  assert.match(validateForm({ ...empty, availability: { ...empty.availability, mon: "700" } }, "2026-11-06"), /Monday/);
});

test("payload keeps stored targets when the student is not preparing for that test", () => {
  const f = { ...baseForm(), prepSat: false, satTarget: "1500", prepIelts: true, ieltsTarget: "7" };
  const p = buildSavePayload(f);
  assert.equal("sat_target" in p, false);
  assert.equal("sat_date" in p, false);
  assert.equal(p.ielts_target, 7);
  assert.deepEqual(p.goals, ["ielts"]);
  assert.equal(p.availability.wed, 0); // blank = rest day
  assert.equal(p.availability.mon, 60);
});

test("plan: respects availability, rest days, budget and session length", () => {
  const tasks = generatePlan({ form: baseForm(), weekStart: "2026-11-02", fromDate: "2026-11-02" });
  assert.ok(tasks.length > 0);
  const perDay = {};
  for (const t of tasks) perDay[t.task_date] = (perDay[t.task_date] || 0) + t.minutes;
  assert.equal(perDay["2026-11-04"], undefined, "Wednesday has no availability");
  assert.equal(perDay["2026-11-08"], undefined, "Sunday is a rest day");
  assert.ok(perDay["2026-11-02"] <= Math.floor(60 * 0.8 / 5) * 5, "balanced uses 80% of Monday");
  assert.ok(tasks.every((t) => t.minutes >= 15 && t.minutes <= 30));
  assert.ok(tasks.every((t) => t.link_href.startsWith("#/")));
});

test("plan: same input gives the same plan; no topic repeats within a day", () => {
  const a = generatePlan({ form: baseForm(), weekStart: "2026-11-02", fromDate: "2026-11-02" });
  const b = generatePlan({ form: baseForm(), weekStart: "2026-11-02", fromDate: "2026-11-02" });
  assert.deepEqual(a, b);
  const seen = new Set();
  for (const t of a) { const k = t.task_date + t.topic; assert.equal(seen.has(k), false); seen.add(k); }
});

test("plan: only the exams the student prepares for", () => {
  const sat = generatePlan({ form: { ...baseForm(), prepIelts: false }, weekStart: "2026-11-02", fromDate: "2026-11-02" });
  assert.ok(sat.length && sat.every((t) => t.exam === "SAT"));
  const none = generatePlan({ form: { ...baseForm(), prepSat: false, prepIelts: false }, weekStart: "2026-11-02", fromDate: "2026-11-02" });
  assert.deepEqual(none, []);
});

test("plan: weak areas get more tasks", () => {
  const form = { ...baseForm(), prepIelts: false, weakAreas: ["sat-math:algebra"], availability: { mon: "90", tue: "90", wed: "90", thu: "90", fri: "90", sat: "90", sun: "90" }, intensity: "intensive" };
  const tasks = generatePlan({ form, weekStart: "2026-11-02", fromDate: "2026-11-02" });
  const count = (topic) => tasks.filter((t) => t.topic === topic).length;
  assert.ok(count("Algebra") > count("Geometry & Trigonometry"));
  assert.ok(count("Algebra") > count("Craft and Structure"));
});

test("plan: a near exam shifts time toward that exam", () => {
  const form = { ...baseForm(), availability: { mon: "90", tue: "90", wed: "90", thu: "90", fri: "90", sat: "90", sun: "90" }, intensity: "intensive", satDate: "2026-11-20", ieltsDate: "2027-06-01" };
  const tasks = generatePlan({ form, weekStart: "2026-11-02", fromDate: "2026-11-02", today: "2026-11-02" });
  assert.ok(tasks.filter((t) => t.exam === "SAT").length > tasks.filter((t) => t.exam === "IELTS").length);
});

test("plan: intensity changes volume", () => {
  const total = (intensity) => generatePlan({ form: { ...baseForm(), intensity }, weekStart: "2026-11-02", fromDate: "2026-11-02" }).reduce((s, t) => s + t.minutes, 0);
  assert.ok(total("light") < total("balanced"));
  assert.ok(total("balanced") < total("intensive"));
});

test("plan: regenerating mid-week skips past days", () => {
  const tasks = generatePlan({ form: baseForm(), weekStart: "2026-11-02", fromDate: "2026-11-05" });
  assert.ok(tasks.length > 0 && tasks.every((t) => t.task_date >= "2026-11-05"));
});

test("summary: today's tasks, minutes, completion and weekly progress", () => {
  const tasks = [
    { task_date: "2026-11-06", position: 1, minutes: 25, completed_at: null },
    { task_date: "2026-11-06", position: 0, minutes: 30, completed_at: "2026-11-06T01:00:00Z" },
    { task_date: "2026-11-05", position: 0, minutes: 40, completed_at: "2026-11-05T01:00:00Z" },
    { task_date: "2026-11-07", position: 0, minutes: 30, completed_at: null },
  ];
  const s = summarizePlan(tasks, "2026-11-06");
  assert.equal(s.today.length, 2);
  assert.equal(s.today[0].position, 0);
  assert.equal(s.todayMinutes, 55);
  assert.equal(s.todayDone, 1);
  assert.equal(s.weekTotal, 4);
  assert.equal(s.weekDone, 2);
  assert.equal(s.weekMinutesDone, 70);
});

test("milestones come from the saved profile and prefs", () => {
  const m = milestones({ preparing_for_sat: true, sat_target_score: 1500, sat_target_date: "2026-11-16", preparing_for_ielts: false }, { cur_sat: 1300 }, "2026-11-06");
  assert.equal(m.length, 1);
  assert.deepEqual([m[0].exam, m[0].daysLeft, m[0].target, m[0].current], ["SAT", 10, "1500", "1300"]);
  assert.deepEqual(milestones({}, null, "2026-11-06"), []);
});

test("performance-based weak keys only point at real catalogue entries", () => {
  const keys = performanceWeakKeys({ satRW: { weakest: { id: "craft-and-structure" } }, satMath: { weakest: { id: "algebra" } }, ieltsReading: { weakest: { id: "not-a-topic" } } });
  assert.deepEqual(keys, ["sat-rw:craft-and-structure", "sat-math:algebra"]);
  assert.ok(CATALOGUE.every((c) => c.href.startsWith("#/")));
});

test("changes that should offer a plan update are detected", () => {
  const a = baseForm();
  assert.equal(planAffectingChange(a, { ...a, availability: { ...a.availability } }), false);
  assert.equal(planAffectingChange(a, { ...a, availability: { ...a.availability, mon: "90" } }), true);
  assert.equal(planAffectingChange(a, { ...a, satDate: "2027-03-13" }), true);
  assert.equal(planAffectingChange(a, { ...a, weakAreas: ["sat-math:algebra"] }), true);
  assert.equal(planAffectingChange(a, { ...a, otherGoal: "x" }), false);
});
