import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeIeltsExercises } from "../src/utils/progress.js";

test("summarizeIeltsExercises splits Reading vs Writing by exercise_id prefix", () => {
  const rows = [
    { exercise_id: "R-MC-101", skill: "main_idea", correct: true, items_total: 1, items_correct: 1 },
    { exercise_id: "R-MC-102", skill: "cause_effect", correct: false, items_total: 1, items_correct: 0 },
    { exercise_id: "W-MC-001", skill: "grammar", correct: true, items_total: 1, items_correct: 1 },
    { exercise_id: "W-MC-019", skill: "cause_effect", correct: true, items_total: 1, items_correct: 1 },
  ];
  const summary = summarizeIeltsExercises(rows);
  assert.equal(summary.reading.attempted, 2);
  assert.equal(summary.reading.correct, 1);
  assert.equal(summary.writing.attempted, 2);
  assert.equal(summary.writing.correct, 2);
  // the shared "cause_effect" skill tag doesn't bleed the two sections together
  assert.equal(summary.itemsTotal, 4);
  assert.equal(summary.itemsCorrect, 3);
});

test("summarizeIeltsExercises handles no rows", () => {
  const summary = summarizeIeltsExercises([]);
  assert.equal(summary.reading.attempted, 0);
  assert.equal(summary.reading.accuracy, null);
  assert.equal(summary.writing.attempted, 0);
  assert.equal(summary.writing.accuracy, null);
});

import { diagnoseIeltsReading } from "../src/utils/weakAreas.js";

test("IELTS Reading weak-area diagnosis ignores Writing-exercise attempts", () => {
  // Three wrong Writing answers on "grammar" must NOT show up as a weak
  // "IELTS Reading" topic (MIN_SAMPLE is met), and a shared skill tag
  // (cause_effect) must not merge Reading and Writing attempts.
  const rows = [
    ...[1, 2, 3, 4, 5].map((n) => ({ exercise_id: `W-MC-00${n}`, skill: "grammar", correct: false })),
    ...[1, 2, 3, 4, 5].map((n) => ({ exercise_id: `W-MC-01${n}`, skill: "cause_effect", correct: false })),
    ...[1, 2, 3, 4, 5].map((n) => ({ exercise_id: `R-MC-10${n}`, skill: "main_idea", correct: true })),
  ];
  const d = diagnoseIeltsReading(rows);
  assert.equal(d.weakest.id, "main_idea");
  assert.equal(d.weakest.rate, 1);
});

test("IELTS Reading diagnosis reports no data when only Writing was practiced", () => {
  const rows = [1, 2, 3, 4, 5].map((n) => ({ exercise_id: `W-MC-00${n}`, skill: "grammar", correct: false }));
  const d = diagnoseIeltsReading(rows);
  assert.equal(d.weakest, null);
  assert.equal(d.reason, "no_data");
});
