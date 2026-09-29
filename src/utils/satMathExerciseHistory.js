import { recordActivity } from "./streak.js";

// Saves one submitted SAT Math exercise answer to
// public.sat_math_exercise_attempts (supabase/sat_math_progress.sql) and
// reports it as streak-qualifying activity. Mirrors
// utils/ieltsExerciseHistory.js. Never throws: if the table isn't set up
// yet, or the user isn't signed in, the practice page keeps working
// exactly as it did before this existed.
export async function saveSatMathAttempt(supabase, userId, question, value, correct) {
  if (!supabase || !userId) return;
  try {
    const { error } = await supabase.from("sat_math_exercise_attempts").insert({
      user_id: userId,
      question_id: question.id,
      domain: question.domain,
      topic: question.topic || null,
      difficulty: question.difficulty || null,
      correct: !!correct,
      answer: value ?? null,
    });
    if (!error) recordActivity("sat_question", question.id);
  } catch {
    // History is best-effort; the on-screen result is unaffected.
  }
}
