import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { WRITING_TASKS } from "../data/writingTasks.js";
import { WRITING_DAILY_LIMIT } from "../data/config.js";

const CRITERIA_LABELS = {
  taskResponse: "Task Response",
  coherenceCohesion: "Coherence & Cohesion",
  lexicalResource: "Lexical Resource",
  grammar: "Grammar",
};

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function WritingTaskPage({ id }) {
  const { user, loading: authLoading } = useAuth();
  const task = useMemo(() => WRITING_TASKS.find((t) => t.id === id), [id]);

  const [essay, setEssay] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [remainingToday, setRemainingToday] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || !supabase) {
      setRemainingToday(null);
      return;
    }
    supabase
      .from("writing_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("completed_at", startOfTodayIso())
      .then(({ count }) => {
        if (!cancelled) setRemainingToday(Math.max(0, WRITING_DAILY_LIMIT - (count || 0)));
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!task) {
    return (
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Task not found</h1>
          <p className="section__lede">
            <a href="#/category/ielts">Back to IELTS</a>
          </p>
        </div>
      </section>
    );
  }

  const words = wordCount(essay);
  const underLimit = words > 0 && words < task.minWords;
  const canSubmit =
    !!user && !submitting && words >= 30 && (remainingToday === null || remainingToday > 0);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("evaluate-essay", {
        body: { taskPrompt: task.prompt, essayText: essay },
      });

      if (fnError) throw new Error(fnError.message || "Evaluation failed.");
      if (data?.error) throw new Error(data.error);

      setResult(data);

      await supabase.from("writing_attempts").insert({
        user_id: user.id,
        task_id: task.id,
        task_title: task.title,
        essay_text: essay,
        word_count: words,
        overall_band: data.overallBand,
        result: data,
      });

      setRemainingToday((r) => (r === null ? null : Math.max(0, r - 1)));
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="section__inner">
        <a href="#/category/ielts" className="detail__back">
          ← Back to IELTS
        </a>

        <h1 className="section__title" style={{ marginTop: 16 }}>
          {task.title}
        </h1>
        <p className="section__lede" style={{ maxWidth: "70ch" }}>
          {task.prompt}
        </p>

        {authLoading ? null : !user ? (
          <p className="leaderboard-page__signin-note">
            <a href="#/signin">Sign in</a> to write and submit an essay for evaluation.
          </p>
        ) : remainingToday === 0 ? (
          <p className="leaderboard-page__signin-note">
            You've used all {WRITING_DAILY_LIMIT} of today's evaluations — come back tomorrow for more.
          </p>
        ) : null}

        {!result && (
          <div style={{ marginTop: 24 }}>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              disabled={!user || submitting}
              rows={16}
              placeholder="Write your essay here…"
              style={{
                width: "100%",
                maxWidth: 760,
                padding: 16,
                fontSize: 15,
                lineHeight: 1.6,
                borderRadius: 10,
                border: "1px solid var(--line, #ddd)",
                fontFamily: "inherit",
              }}
            />
            <p style={{ fontSize: 13, color: underLimit ? "#d69a00" : "var(--ink-soft, #666)" }}>
              {words} words {task.minWords ? `(minimum ${task.minWords})` : ""}
              {remainingToday !== null && user
                ? ` · ${remainingToday} evaluation${remainingToday === 1 ? "" : "s"} left today`
                : ""}
            </p>

            {error && <p style={{ color: "#d7373f", fontSize: 14 }}>{error}</p>}

            <button
              type="button"
              className="btn btn--accent"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting ? "Evaluating…" : "Submit for evaluation"}
            </button>
          </div>
        )}

        {result && <WritingResult result={result} onWriteAnother={() => { setResult(null); setEssay(""); }} />}
      </div>
    </section>
  );
}

function WritingResult({ result, onWriteAnother }) {
  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          background: "var(--navy-950, #061A3A)",
          color: "#fff",
          borderRadius: 16,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ opacity: 0.7, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Your band score
        </p>
        <p style={{ fontSize: 44, fontWeight: 800, color: "var(--blue-300, #5AC8FA)", margin: "4px 0" }}>
          Band {result.overallBand}
        </p>
        {result.wordCount && <p style={{ opacity: 0.6, fontSize: 13 }}>{result.wordCount} words</p>}
      </div>

      {result.summary && (
        <p style={{ marginTop: 16, fontSize: 15, color: "var(--ink-soft, #555)" }}>{result.summary}</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {Object.entries(result.criteria || {}).map(([key, c]) => (
          <div key={key} style={{ border: "1px solid var(--line, #ddd)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong>{CRITERIA_LABELS[key] || key}</strong>
              <span>Band {c.band}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--ink-soft, #555)" }}>
              {(c.notes || []).map((note, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn--ghost" style={{ marginTop: 24 }} onClick={onWriteAnother}>
        Write another attempt
      </button>
    </div>
  );
}
