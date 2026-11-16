import { supabase } from "../lib/supabaseClient.js";
import { taskDataToText } from "../data/writingTasks.js";

export const LIST_COLUMNS =
  "id, task_id, task_type, task_title, word_count, overall_band, status, created_at";

// Sends the essay to the evaluate-essay edge function. The function
// authenticates the student, validates, rate-limits, calls the AI and stores
// the assessment; the browser never talks to an AI provider.
export async function submitEssay({ task, essayText, requestId, durationSeconds }) {
  const { data, error } = await supabase.functions.invoke("evaluate-essay", {
    body: {
      taskId: task.id,
      taskType: task.type,
      taskTitle: task.title,
      taskPrompt: task.prompt,
      taskData: taskDataToText(task),
      minWords: task.minWords,
      essayText,
      requestId,
      durationSeconds,
    },
  });
  if (error) {
    let message = "Алдаа гарлаа. Дахин оролдоно уу.";
    let code = "unknown";
    try {
      const body = await error.context.json();
      if (body?.error) message = body.error;
      if (body?.code) code = body.code;
    } catch (_e) {
      /* function unreachable / not deployed */
      message = "Үнэлгээний үйлчилгээнд холбогдож чадсангүй. Дахин оролдоно уу.";
    }
    const err = new Error(message);
    err.code = code;
    throw err;
  }
  if (data?.error) throw new Error(data.error);
  return data.assessment;
}

export async function fetchMyAssessments(userId, { taskId, limit = 100 } = {}) {
  let q = supabase
    .from("writing_assessments")
    .select(LIST_COLUMNS)
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (taskId) q = q.eq("task_id", taskId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function fetchAssessment(id) {
  const { data, error } = await supabase.from("writing_assessments").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

// Evaluations used in the last 24 hours (what the server limit counts).
export async function countRecentEvaluations(userId) {
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await supabase
    .from("writing_assessments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("status", ["completed", "pending"])
    .gte("created_at", since);
  return count || 0;
}
