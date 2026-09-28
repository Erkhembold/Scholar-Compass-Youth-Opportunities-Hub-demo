import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SAT_MATH_QUESTIONS,
  SAT_MATH_DOMAINS,
  SAT_MATH_DIFFICULTIES,
  isSatMathAnswerCorrect,
} from "../src/data/satMathQuestions.js";
import { parseMath } from "../src/utils/mathText.js";
import { computeClock, isPlayerConnected } from "../src/utils/satMathTimer.js";

const domainIds = SAT_MATH_DOMAINS.map((d) => d.id);
const difficultyIds = SAT_MATH_DIFFICULTIES.map((d) => d.id);

test("bank has 40 questions, 10 per domain, unique ids", () => {
  assert.equal(SAT_MATH_QUESTIONS.length, 40);
  assert.equal(new Set(SAT_MATH_QUESTIONS.map((q) => q.id)).size, 40);
  for (const d of domainIds) {
    assert.equal(SAT_MATH_QUESTIONS.filter((q) => q.domain === d).length, 10, d);
  }
});

test("every question is well-formed (difficulty, topic, prompt, answer, explanation)", () => {
  for (const q of SAT_MATH_QUESTIONS) {
    assert.ok(domainIds.includes(q.domain), `${q.id} domain`);
    assert.ok(difficultyIds.includes(q.difficulty), `${q.id} difficulty`);
    assert.ok(q.topic && q.prompt && q.explanation, `${q.id} missing text`);
    assert.ok(["mc", "spr"].includes(q.type), `${q.id} type`);
    if (q.type === "mc") {
      assert.equal(q.options.length, 4, `${q.id} options`);
      const ids = q.options.map((o) => o.id);
      assert.deepEqual(ids, ["A", "B", "C", "D"], `${q.id} option ids`);
      assert.ok(ids.includes(q.answer), `${q.id} answer not among options`);
      assert.equal(new Set(q.options.map((o) => o.text)).size, 4, `${q.id} duplicate option text`);
    } else {
      assert.ok(String(q.answer).length > 0, `${q.id} spr answer`);
    }
  }
});

test("every difficulty level has at least one question (so no filter is empty)", () => {
  for (const diff of difficultyIds) {
    assert.ok(SAT_MATH_QUESTIONS.some((q) => q.difficulty === diff), diff);
  }
});

test("math delimiters are balanced in every prompt, option and explanation", () => {
  const strings = SAT_MATH_QUESTIONS.flatMap((q) => [q.prompt, q.explanation, ...q.options.map((o) => o.text)]);
  for (const s of strings) {
    const segs = parseMath(s);
    const text = segs.filter((x) => x.type === "text").map((x) => x.value).join("");
    assert.ok(!text.includes("$$"), `stray $$ in: ${s}`);
    assert.ok(!text.includes("\\(") && !text.includes("\\)"), `stray \\( or \\) in: ${s}`);
    for (const x of segs.filter((y) => y.type !== "text")) assert.ok(x.value.length > 0, `empty math in: ${s}`);
  }
  // prices stay plain text
  const a06 = parseMath(SAT_MATH_QUESTIONS.find((q) => q.id === "A06").prompt);
  assert.ok(a06.every((x) => x.type === "text"));
});

test("answer checking", () => {
  const q = SAT_MATH_QUESTIONS[0];
  assert.equal(isSatMathAnswerCorrect(q, q.answer), true);
  assert.equal(isSatMathAnswerCorrect(q, q.answer.toLowerCase()), true);
  assert.equal(isSatMathAnswerCorrect(q, "Z"), false);
  assert.equal(isSatMathAnswerCorrect(q, ""), false);
  assert.equal(isSatMathAnswerCorrect(q, null), false);
});

test("SQL answer key is in sync with the question bank", () => {
  const sql = readFileSync(new URL("../supabase/sat_math_1v1_schema.sql", import.meta.url), "utf8");
  const block = sql.slice(sql.indexOf("-- BEGIN GENERATED ANSWER KEY"), sql.indexOf("-- END GENERATED ANSWER KEY"));
  const rows = [...block.matchAll(/\('([^']+)', '(mc|spr)', '([^']+)'\)/g)].map((m) => ({ id: m[1], type: m[2], answer: m[3] }));
  assert.equal(rows.length, SAT_MATH_QUESTIONS.length, "run: npm run gen:sat-math-key");
  for (const q of SAT_MATH_QUESTIONS) {
    const row = rows.find((r) => r.id === q.id);
    assert.ok(row, `${q.id} missing from SQL key (run: npm run gen:sat-math-key)`);
    assert.equal(row.answer, q.answer, `${q.id} answer differs from SQL key`);
    assert.equal(row.type, q.type, `${q.id} type differs from SQL key`);
  }
});

// ------------------------------------------------------------------ timer
const T0 = Date.parse("2026-01-01T00:00:00Z");
const match = { status: "in_progress", started_at: new Date(T0).toISOString(), time_per_question_seconds: 30, question_count: 5 };

test("clock: countdown before start, then question windows, then finishing", () => {
  assert.deepEqual(computeClock(match, T0 - 3000), { phase: "countdown", countdownLeft: 3 });
  let c = computeClock(match, T0);
  assert.equal(c.phase, "question");
  assert.equal(c.index, 0);
  assert.equal(c.secondsLeft, 30);
  c = computeClock(match, T0 + 29_999);
  assert.equal(c.index, 0);
  assert.equal(c.secondsLeft, 1);
  c = computeClock(match, T0 + 30_000);
  assert.equal(c.index, 1);
  c = computeClock(match, T0 + 149_999);
  assert.equal(c.index, 4);
  assert.equal(computeClock(match, T0 + 150_000).phase, "finishing");
});

test("clock: refresh/reconnect cannot move the timer (pure function of server time)", () => {
  const a = computeClock(match, T0 + 61_500);
  const b = computeClock({ ...match }, T0 + 61_500); // "after refresh": same inputs, same output
  assert.deepEqual(a, b);
  assert.equal(a.index, 2);
});

test("clock: non-running statuses", () => {
  assert.equal(computeClock({ ...match, status: "ready", started_at: null }, T0).phase, "lobby");
  assert.equal(computeClock({ ...match, status: "completed" }, T0 + 10_000_000).phase, "ended");
  assert.equal(computeClock(null, T0).phase, "lobby");
});

test("presence: connected only if heartbeat is recent", () => {
  const now = T0 + 100_000;
  assert.equal(isPlayerConnected(new Date(now - 5000).toISOString(), now), true);
  assert.equal(isPlayerConnected(new Date(now - 20_000).toISOString(), now), false);
  assert.equal(isPlayerConnected(null, now), false);
});
