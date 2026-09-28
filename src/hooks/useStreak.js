import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { streakStatus, todayInUB, weekDates } from "../utils/streak.js";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Everything a streak display needs: the headline numbers (from the
// profile row, corrected for missed days) and which days of the current
// Monday–Sunday week (Ulaanbaatar time) had a qualifying activity.
export function useStreak() {
  const { user, profile } = useAuth();
  const [today, setToday] = useState(() => todayInUB());
  const [activeDates, setActiveDates] = useState(() => new Set());
  const [loading, setLoading] = useState(true);

  // Roll "today" over at Ulaanbaatar midnight without needing a reload.
  useEffect(() => {
    const id = setInterval(() => setToday(todayInUB()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => weekDates(today), [today]);

  const load = useCallback(async () => {
    if (!user || !supabase) {
      setActiveDates(new Set());
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("activity_log")
      .select("activity_date")
      .eq("user_id", user.id)
      .gte("activity_date", days[0])
      .lte("activity_date", days[6]);
    setActiveDates(new Set((data || []).map((r) => r.activity_date)));
    setLoading(false);
  }, [user, days]);

  useEffect(() => {
    load();
    window.addEventListener("sc:activity", load);
    return () => window.removeEventListener("sc:activity", load);
  }, [load]);

  const status = useMemo(() => streakStatus(profile, today), [profile, today]);

  const week = days.map((date, i) => ({
    date,
    label: DAY_LABELS[i],
    active: activeDates.has(date),
    isToday: date === today,
    isFuture: date > today,
  }));

  // False until supabase/streaks_and_exercise_history.sql has been run.
  const isSetUp = !!profile && "current_streak" in profile;

  return { ...status, week, loading, isSetUp };
}
