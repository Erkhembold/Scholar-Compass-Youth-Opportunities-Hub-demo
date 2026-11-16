import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { WRITING_TASKS, taskDataToText } from "../src/data/writingTasks.js";

test("writing tasks: unique ids, valid types, task1 has data, correct minimums", () => {
  assert.equal(new Set(WRITING_TASKS.map((t) => t.id)).size, WRITING_TASKS.length);
  for (const t of WRITING_TASKS) {
    assert.ok(["task1", "task2"].includes(t.type), t.id);
    assert.ok(t.prompt.length >= 20 && t.prompt.length <= 1500, t.id);
    if (t.type === "task1") {
      assert.equal(t.minWords, 150);
      assert.ok(t.dataTable && taskDataToText(t).length <= 2500, t.id);
      for (const r of t.dataTable.rows) assert.equal(r.length, t.dataTable.columns.length, t.id);
    } else {
      assert.equal(t.minWords, 250);
      assert.ok(!t.dataTable);
    }
  }
  assert.ok(WRITING_TASKS.filter((t) => t.type === "task1").length >= 4);
  assert.ok(WRITING_TASKS.filter((t) => t.type === "task2").length >= 5);
});

test("existing task ids are unchanged (saved history depends on them)", () => {
  for (let i = 1; i <= 5; i++) assert.ok(WRITING_TASKS.some((t) => t.id === `writing-task-${i}`));
});

test("budget table percentages sum to 100 per year", () => {
  const t = WRITING_TASKS.find((x) => x.id === "writing-task1-budget").dataTable;
  for (const col of [1, 2]) assert.equal(t.rows.reduce((a, r) => a + Number(r[col]), 0), 100);
});

test("no AI provider keys or provider calls in the browser bundle sources", () => {
  const files = fs.readdirSync("src", { recursive: true }).filter((f) => /\.(js|jsx)$/.test(f));
  for (const f of files) {
    const src = fs.readFileSync(`src/${f}`, "utf8");
    assert.ok(!/api\.anthropic\.com|api\.openai\.com|sk-ant-|sk-proj-/.test(src), f);
  }
});

test("only the server can write assessments (no client insert policies in the SQL)", () => {
  const sql = fs.readFileSync("supabase/writing_assessments.sql", "utf8").replace(/--.*$/gm, "");
  assert.ok(!/for (insert|update|delete|all)/i.test(sql));
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /auth\.uid\(\) = user_id/);
  const clientSrc = fs.readFileSync("src/utils/writingAssessments.js", "utf8");
  assert.ok(!/\.insert\(|\.update\(|\.delete\(|\.upsert\(/.test(clientSrc));
});
