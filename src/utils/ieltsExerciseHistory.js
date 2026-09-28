import { recordActivity } from "./streak.js";

// Maps each exercise type to the READING_SKILL_TAGS tag used when the item
// has no `skill` of its own (only multiple-choice items carry one).
const TYPE_TO_SKILL = {
  tfng: "true_false_not_given",
  matching: "matching_headings",
  completion: "sentence_completion",
};

// Saves one submitted answer from the IELTS Reading exercises to
// public.ielts_exercise_attempts (supabase/streaks_and_exercise_history.sql)
// and reports it as streak-qualifying activity. Never throws: if the table
// isn't set up yet the exercise page keeps working exactly as before.
export async function saveExerciseAttempt(supabase, userId, exercise, selected, correct) {
  if (!supabase || !userId) return;
  const itemsTotal = exercise.type === "tfng" ? exercise.statements.length : 1;
  const itemsCorrect =
    exercise.type === "tfng"
      ? exercise.statements.filter((st, i) => selected?.[i] === st.answer).length
      : correct
      ? 1
      : 0;
  try {
    const { error } = await supabase.from("ielts_exercise_attempts").insert({
      user_id: userId,
      exercise_id: exercise.id,
      exercise_type: exercise.type,
      skill: exercise.skill || TYPE_TO_SKILL[exercise.type] || null,
      difficulty: exercise.difficulty || null,
      correct: !!correct,
      items_total: itemsTotal,
      items_correct: itemsCorrect,
      answer: selected ?? null,
    });
    if (!error) recordActivity("ielts_exercise", exercise.id);
  } catch {
    // History is best-effort; the on-screen result is unaffected.
  }
}
