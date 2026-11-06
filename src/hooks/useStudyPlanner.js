import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { useProgressData } from "./useProgressData.js";
import {
  addDays, buildSavePayload, formFromState, generatePlan, inviteHidden, mondayOf, performanceWeakKeys,
  planAffectingChange, plannerState, summarizePlan, toISODate,
} from "../utils/studyPlan.js";

// The signed-in student's planner: saved preferences, this week's plan and
// tasks, and the actions on them. Everything is read from and written to
// Supabase (study_preferences / study_plans / study_tasks, see
// supabase/study_planner.sql), never browser storage, so it follows the
// student across devices. Nothing here invents tasks: the tasks shown are the
// rows saved for this account.
export function useStudyPlanner() {
  const { user, profile, refreshProfile } = useAuth();
  const { weakAreas } = useProgressData();
  const [prefs, setPrefs] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false); // migration not installed yet
  const [error, setError] = useState("");
  const autoTried = useRef("");

  const today = toISODate(new Date());
  const weekStart = mondayOf(today);
  const userId = user?.id || null;

  const load = useCallback(async () => {
    if (!supabase || !userId) {
      setLoading(false);
      return;
    }
    const [p, pl, tk] = await Promise.all([
      supabase.from("study_preferences").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("study_plans").select("id, week_start, generated_at").eq("user_id", userId).eq("week_start", weekStart).maybeSingle(),
      supabase.from("study_tasks").select("*").eq("user_id", userId).gte("task_date", weekStart).lte("task_date", addDays(weekStart, 6)).order("task_date").order("position"),
    ]);
    const missing = [p, pl, tk].find((r) => r.error && /does not exist|schema cache|42P01|PGRST205/i.test(`${r.error.code} ${r.error.message}`));
    if (missing) {
      setUnavailable(true);
      setLoading(false);
      return;
    }
    setUnavailable(false);
    setPrefs(p.data || null);
    setPlan(pl.data || null);
    setTasks(tk.data || []);
    setLoading(false);
  }, [userId, weekStart]);

  useEffect(() => {
    load();
    window.addEventListener("sc:planner", load);
    return () => window.removeEventListener("sc:planner", load);
  }, [load]);

  const state = plannerState(profile, prefs);
  const form = useMemo(() => formFromState(profile, prefs), [profile, prefs]);
  const suggestedWeak = useMemo(() => performanceWeakKeys(weakAreas), [weakAreas]);
  const summary = useMemo(() => summarizePlan(tasks, today), [tasks, today]);

  const notify = () => window.dispatchEvent(new Event("sc:planner"));

  // Writes this week's tasks. replace=false is a no-op when a plan already
  // exists for the week (the database enforces one plan per week); replace=true
  // swaps only the unfinished tasks from today on.
  const savePlan = useCallback(
    async (f, replace) => {
      const tasksToSave = generatePlan({ form: f, weekStart, fromDate: today, today, performanceWeak: performanceWeakKeys(weakAreas) });
      const { error: e } = await supabase.rpc("save_study_plan", { p_week_start: weekStart, p_tasks: tasksToSave, p_replace: replace, p_from: today });
      return e ? e.message : null;
    },
    [weekStart, today, weakAreas]
  );

  // Saves the setup form. `complete` marks the updated setup as done and, if
  // there is no plan for this week yet, generates it. Returns { error, offerAdjust }.
  const savePreferences = useCallback(
    async (f, { complete = true } = {}) => {
      setError("");
      const before = form;
      const { error: e } = await supabase.rpc("save_study_preferences", { p: buildSavePayload(f), p_complete: complete });
      if (e) return { error: e.message };
      await refreshProfile();
      let planError = null;
      if (complete && !plan) planError = await savePlan(f, false);
      notify();
      return { error: planError, offerAdjust: complete && !!plan && planAffectingChange(before, f) };
    },
    [form, plan, refreshProfile, savePlan]
  );

  const regenerate = useCallback(async () => {
    const e = await savePlan(form, true);
    notify();
    return e;
  }, [form, savePlan]);

  const toggleTask = useCallback(async (id, done) => {
    const stamp = done ? new Date().toISOString() : null;
    setTasks((rows) => rows.map((t) => (t.id === id ? { ...t, completed_at: stamp } : t)));
    const { error: e } = await supabase.rpc("set_study_task_done", { p_task: id, p_done: done });
    if (e) {
      setTasks((rows) => rows.map((t) => (t.id === id ? { ...t, completed_at: done ? null : stamp } : t)));
      setError(e.message);
    } else {
      notify();
    }
  }, []);

  const dismissInvite = useCallback(async () => {
    await supabase.rpc("dismiss_study_invite", { p_days: 3 });
    notify();
  }, []);

  // A completed setup with no plan for the current week (a new week started):
  // create it once. The database refuses a second plan for the same week, so
  // reloads and several tabs can never duplicate it.
  useEffect(() => {
    if (loading || unavailable || !userId || state !== "complete" || plan) return;
    if (autoTried.current === weekStart) return;
    autoTried.current = weekStart;
    savePlan(form, false).then((e) => {
      if (e) setError(e);
      notify();
    });
  }, [loading, unavailable, userId, state, plan, weekStart, form, savePlan]);

  return {
    loading, unavailable, error, state, prefs, plan, tasks, summary, form, today, weekStart,
    suggestedWeak, inviteHidden: inviteHidden(prefs),
    savePreferences, regenerate, toggleTask, dismissInvite, reload: load,
  };
}
