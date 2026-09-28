// Regenerates the answer-key block inside supabase/sat_math_1v1_schema.sql
// from src/data/satMathQuestions.js.   Usage: npm run gen:sat-math-key
import { readFileSync, writeFileSync } from "node:fs";
import { SAT_MATH_QUESTIONS } from "../src/data/satMathQuestions.js";

const FILE = new URL("../supabase/sat_math_1v1_schema.sql", import.meta.url);
const BEGIN = "-- BEGIN GENERATED ANSWER KEY (npm run gen:sat-math-key rewrites this block)";
const END = "-- END GENERATED ANSWER KEY";

const esc = (s) => String(s).replace(/'/g, "''");
const rows = SAT_MATH_QUESTIONS.map(
  (q) => `  ('${esc(q.id)}', '${q.type === "spr" ? "spr" : "mc"}', '${esc(q.answer)}')`
).join(",\n");

const block = `${BEGIN}
insert into public.sat_math_answer_key (question_id, answer_type, correct_answer) values
${rows}
on conflict (question_id) do update
  set answer_type = excluded.answer_type, correct_answer = excluded.correct_answer;
${END}`;

const sql = readFileSync(FILE, "utf8");
const start = sql.indexOf(BEGIN);
const end = sql.indexOf(END);
if (start === -1 || end === -1) throw new Error("Markers not found in schema file");
writeFileSync(FILE, sql.slice(0, start) + block + sql.slice(end + END.length));
console.log(`Wrote ${SAT_MATH_QUESTIONS.length} answer-key rows to supabase/sat_math_1v1_schema.sql`);
