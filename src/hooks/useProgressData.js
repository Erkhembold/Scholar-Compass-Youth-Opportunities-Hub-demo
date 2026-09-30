import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { buildProgressSummary } from "../utils/progress.js";
import { buildWeakAreas } from "../utils/weakAreas.js";
import { buildRoadmap } from "../utils/roadmap.js";

// Fetches every raw signal the progress tracker and weak-area diagnosis
// need, once, then derives both views from the same data with the pure
// functions in utils/progress.js and utils/weakAreas.js. Refetches when a
// qualifying activity is recorded (see utils/streak.js) so the numbers
// stay current without a page reload.
export function useProgressData() {
  const { user, profile } = useAuth();
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user || !supabase) {
      setRaw(null);
      setLoading(false);
      return;
    }
    const [satProgress, satMathExercises, satMathAnswers, ieltsAttempts, ieltsExercises] = await Promise.all([
      supabase.from("sat_progress").select("question_id, category, correct").eq("user_id", user.id),
      supabase.from("sat_math_exercise_attempts").select("question_id, domain, topic, difficulty, correct").eq("user_id", user.id),
      supabase.rpc("get_my_sat_math_answers"),
      supabase.from("ielts_attempts").select("band, test_title, completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }),
      supabase.from("ielts_exercise_attempts").select("exercise_type, skill, difficulty, correct, items_total, items_correct").eq("user_id", user.id),
    ]);
    setRaw({
      satProgressRows: satProgress.data || [],
      satMathExerciseRows: satMathExercises.data || [],
      satMathAnswerRows: satMathAnswers.data || [],
      ieltsAttempts: ieltsAttempts.data || [],
      ieltsExerciseRows: ieltsExercises.data || [],
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    window.addEventListener("sc:activity", load);
    return () => window.removeEventListener("sc:activity", load);
  }, [load]);

  const progress = raw ? buildProgressSummary({ profile, ...raw }) : null;
  const weakAreas = raw ? buildWeakAreas(raw) : null;
  const roadmap = progress && weakAreas ? buildRoadmap({ progress, weakAreas }) : null;

  return { progress, weakAreas, roadmap, loading, isSetUp: !!raw };
}
