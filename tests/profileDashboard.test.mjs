import test from "node:test";
import assert from "node:assert/strict";
import { buildWeakestList, buildProgressCards, percent } from "../src/utils/profileDashboard.js";

const progress = {
  sat: {
    rw: { categories: [{ id: "a", label: "Words", seen: 10, mastered: 3 }, { id: "b", label: "Few", seen: 2, mastered: 0 }], seen: 12, mastered: 3, attempted: 12 },
    math: { domains: [{ id: "alg", label: "Algebra", attempted: 8, correct: 6 }], attempted: 8, correct: 6, accuracy: 0.75 },
  },
  ielts: { exercises: { skills: [{ id: "tfng", label: "T/F/NG", attempted: 5, correct: 1 }], itemsTotal: 5, itemsCorrect: 1, reading: { attempted: 5, correct: 1, accuracy: 0.2 } }, latestBand: 6.5, targetBand: 7 },
};

test("weakest list: only topics with enough data, lowest first", () => {
  const list = buildWeakestList(progress);
  assert.deepEqual(list.map((r) => r.label), ["T/F/NG", "Words", "Algebra"]);
  assert.equal(percent(list[0].rate), 20);
});
test("weakest list: empty with no data", () => {
  assert.deepEqual(buildWeakestList(null), []);
  const none = structuredClone(progress);
  none.sat.rw.categories = []; none.sat.math.domains = []; none.ielts.exercises.skills = [];
  assert.deepEqual(buildWeakestList(none), []);
});
test("limit respected", () => {
  assert.equal(buildWeakestList(progress, 1).length, 1);
});
test("progress cards use real totals", () => {
  const c = buildProgressCards(progress, 100);
  assert.equal(c.answered.value, 12 + 8 + 5);
  assert.equal(c.rw.fraction, 0.03);
  assert.equal(c.ielts.latestBand, 6.5);
  assert.equal(buildProgressCards(null, 100), null);
});

import { leagueFor } from "../src/data/leagues.js";
test("leagueFor never returns undefined, whatever the database holds", () => {
  assert.equal(leagueFor("gold").id, "gold");
  assert.equal(leagueFor(" Gold ").id, "gold");
  for (const bad of ["platinum", "celestial", "", null, undefined, 42, {}]) {
    assert.equal(leagueFor(bad).id, "bronze");
  }
});

test("weakest rows say where to practise", () => {
  const list = buildWeakestList(progress);
  const kinds = Object.fromEntries(list.map((r) => [r.label, r.practice]));
  assert.deepEqual(kinds["T/F/NG"], { kind: "ielts-reading", id: "tfng" });
  assert.deepEqual(kinds["Words"], { kind: "sat-rw", id: "a" });
  assert.deepEqual(kinds["Algebra"], { kind: "sat-math", id: "alg" });
});
