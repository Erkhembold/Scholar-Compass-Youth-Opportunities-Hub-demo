import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { awardXp } from "../utils/xp.js";

// Tracks per-question mastery for SAT practice. Deliberately granular —
// a small XP award (see XP_REWARDS.satQuestion) fires the first time a
// question is answered correctly, rather than one lump sum for
// finishing a whole test. Answering the same question correctly again
// later doesn't re-award XP; only the first success per question counts.
export function useSatProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState({}); // { [questionId]: { correct, attempts } }
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user || !supabase) {
      setProgress({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("sat_progress")
      .select("question_id, category, correct, attempts")
      .eq("user_id", user.id);
    const map = {};
    (data || []).forEach((row) => {
      map[row.question_id] = { correct: row.correct, attempts: row.attempts, category: row.category };
    });
    setProgress(map);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Records one answer attempt. Returns nothing — callers already know
  // whether the answer was right from their own comparison; this just
  // persists it and awards XP on a genuine first-time success.
  async function recordAnswer(questionId, category, isCorrect) {
    const prev = progress[questionId];
    const wasAlreadyCorrect = prev?.correct === true;
    const attempts = (prev?.attempts || 0) + 1;
    const nowCorrect = isCorrect || wasAlreadyCorrect;

    setProgress((p) => ({ ...p, [questionId]: { correct: nowCorrect, attempts, category } }));

    if (!user || !supabase) return;

    await supabase.from("sat_progress").upsert(
      {
        user_id: user.id,
        question_id: questionId,
        category,
        correct: nowCorrect,
        attempts,
        first_correct_at: !wasAlreadyCorrect && isCorrect ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" }
    );

    if (isCorrect && !wasAlreadyCorrect) {
      awardXp(supabase, user.id, "satQuestion");
    }
  }

  function masteredCount(categoryId) {
    return Object.values(progress).filter((p) => p.category === categoryId && p.correct).length;
  }

  return { progress, recordAnswer, masteredCount, loading, isSignedIn: !!user };
}
