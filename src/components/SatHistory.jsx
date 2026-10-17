import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { SAT_CATEGORIES } from "../data/satQuestions.js";
import { SAT_MATH_DOMAINS } from "../data/satMathQuestions.js";

const NOTE = "Full SAT mock tests will be listed here once they are added. Until then, this is your recent practice.";
const RW_LABEL = Object.fromEntries(SAT_CATEGORIES.map((c) => [c.id, c.label]));
const MATH_LABEL = Object.fromEntries(SAT_MATH_DOMAINS.map((d) => [d.id, d.label]));
const date = (v) => (v ? new Date(v).toLocaleDateString() : "");

function useRows(table, select, orderCol) {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  useEffect(() => {
    if (!user || !supabase) {
      setRows([]);
      return;
    }
    let cancelled = false;
    supabase
      .from(table)
      .select(select)
      .eq("user_id", user.id)
      .order(orderCol, { ascending: false })
      .limit(15)
      .then(({ data }) => {
        if (!cancelled) setRows(data || []);
      });
    return () => {
      cancelled = true;
    };
  }, [user, table, select, orderCol]);
  return rows;
}

// Reading & Writing: sat_progress keeps one row per question (not one per
// attempt), so each row is "last answered" with its attempt count.
export function SatRwHistory() {
  const rows = useRows("sat_progress", "id, question_id, category, correct, attempts, updated_at", "updated_at");
  return (
    <>
      <p className="history-note">{NOTE}</p>
      {rows === null ? (
        <p className="signin__lede">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="signin__lede">
          No practice yet. <a href="#/category/sat">Start SAT Reading and Writing</a> and your answers will appear here.
        </p>
      ) : (
        <ul className="test-history">
          {rows.map((r) => (
            <li className="test-history__row" key={r.id}>
              <div>
                <span className="test-history__title">{RW_LABEL[r.category] || r.category}</span>
                <span className="test-history__date">
                  {r.question_id} - {r.attempts} {r.attempts === 1 ? "attempt" : "attempts"} - {date(r.updated_at)}
                </span>
              </div>
              <div className={`test-history__score exercise-history__result ${r.correct ? "is-correct" : "is-incorrect"}`}>
                {r.correct ? "Correct" : "Not yet correct"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function SatMathHistory() {
  const rows = useRows("sat_math_exercise_attempts", "id, question_id, domain, topic, difficulty, correct, created_at", "created_at");
  return (
    <>
      <p className="history-note">{NOTE}</p>
      {rows === null ? (
        <p className="signin__lede">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="signin__lede">
          No practice yet. <a href="#/sat/math">Try a SAT Math exercise</a> and every answer will be saved here.
        </p>
      ) : (
        <ul className="test-history">
          {rows.map((r) => (
            <li className="test-history__row" key={r.id}>
              <div>
                <span className="test-history__title">{r.topic || MATH_LABEL[r.domain] || r.domain}</span>
                <span className="test-history__date">
                  {MATH_LABEL[r.domain] || r.domain}
                  {r.difficulty ? ` - ${r.difficulty}` : ""} - {date(r.created_at)}
                </span>
              </div>
              <div className={`test-history__score exercise-history__result ${r.correct ? "is-correct" : "is-incorrect"}`}>
                {r.correct ? "Correct" : "Incorrect"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
