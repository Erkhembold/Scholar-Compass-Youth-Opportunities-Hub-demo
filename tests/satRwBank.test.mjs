import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SAT_CATEGORIES, SAT_QUESTIONS, getAllSatQuestionsFlat, findSatQuestionById } from "../src/data/satQuestions.js";
import { SAT_RW_BANK_V1 } from "../src/data/satRwBank.js";
import { parseCsv, buildBank } from "../scripts/gen-sat-rw-bank.mjs";

const imported = Object.values(SAT_RW_BANK_V1).flat();
const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();

test("all 100 questions imported with sequential unique ids", () => {
  assert.equal(imported.length, 100);
  const ids = imported.map((q) => q.id);
  assert.equal(new Set(ids).size, 100);
  ids.sort().forEach((id, i) => assert.equal(id, `SC-SAT-RW-${String(i + 1).padStart(3, "0")}`));
});

test("every imported question is well-formed and its answer validates", () => {
  for (const q of imported) {
    assert.deepEqual(q.options.map((o) => o.id), ["A", "B", "C", "D"], q.id);
    q.options.forEach((o) => assert.ok(o.text.length, q.id));
    assert.ok(q.options.some((o) => o.id === q.answer), q.id);
    assert.ok(q.passage && q.prompt && q.explanation && q.skill, q.id);
    assert.ok(["easy", "medium", "hard"].includes(q.difficulty), q.id);
  }
});

test("domain counts and category mapping match the spreadsheet", () => {
  const counts = Object.fromEntries(Object.entries(SAT_RW_BANK_V1).map(([k, v]) => [k, v.length]));
  assert.deepEqual(counts, {
    "craft-and-structure": 28, "information-and-ideas": 26,
    "standard-english-conventions": 26, "expression-of-ideas": 20,
  });
  const rows = parseCsv(fs.readFileSync("data/sat_rw_bank_v1.csv", "utf8"));
  assert.equal(rows.length - 1, 100);
});

test("generated module is in sync with the CSV (verbatim content)", () => {
  const bank = buildBank(fs.readFileSync("data/sat_rw_bank_v1.csv", "utf8"));
  assert.equal(bank.length, 100);
  for (const { category, q } of bank) {
    assert.deepEqual(SAT_RW_BANK_V1[category].find((x) => x.id === q.id), q);
  }
});

test("no duplicates against the existing 80 or within the bank", () => {
  const all = SAT_CATEGORIES.flatMap((c) => SAT_QUESTIONS[c.id]);
  assert.equal(all.length, 180);
  assert.equal(new Set(all.map((q) => q.id)).size, 180);
  assert.equal(new Set(all.map((q) => norm(q.passage) + "|" + norm(q.prompt))).size, 180);
});

test("existing questions untouched; old and new ids resolve for practice and 1v1", () => {
  assert.equal(findSatQuestionById("CS01").category, "craft-and-structure");
  const n = findSatQuestionById("SC-SAT-RW-050");
  assert.ok(n && n.answer && n.category);
  assert.equal(getAllSatQuestionsFlat().length, 180);
  for (const c of SAT_CATEGORIES) assert.equal(SAT_QUESTIONS[c.id].slice(0, 20).every((q) => /^[A-Z]{2}\d\d$/.test(q.id)), true);
});

test("no copy labels the bank as official College Board material", () => {
  const src = fs.readFileSync("src/data/satRwBank.js", "utf8") + fs.readFileSync("src/data/satQuestions.js", "utf8");
  assert.ok(!/official college board (question|material|content)s?/i.test(src.replace(/not official College Board material/gi, "")));
});
