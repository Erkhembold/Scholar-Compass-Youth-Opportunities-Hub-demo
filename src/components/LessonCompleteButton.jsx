import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { recordActivity } from "../utils/streak.js";

// Lessons have no built-in "finished" signal, so students confirm it
// explicitly. Completion is stored as a 'lesson' row in activity_log (via
// record_activity) and counts toward the daily streak. Clicking twice, or
// reloading, can't double count: the button reads its state back from the
// database and the log ignores duplicates.
export default function LessonCompleteButton({ lessonId }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDone(false);
    if (!user || !supabase) return undefined;
    supabase
      .from("activity_log")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_type", "lesson")
      .eq("ref_id", lessonId)
      .limit(1)
      .then(({ data }) => {
        if (!cancelled && data && data.length > 0) setDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, lessonId]);

  async function handleClick() {
    if (done || busy) return;
    setBusy(true);
    setError(false);
    const result = await recordActivity("lesson", lessonId);
    setBusy(false);
    if (result) setDone(true);
    else setError(true);
  }

  if (!user) {
    return (
      <div className="lesson-complete">
        <p className="lesson-complete__hint">
          <a href="#/signin">{t("Sign in")}</a> {t("to mark lessons complete and build a daily streak.")}
        </p>
      </div>
    );
  }

  return (
    <div className="lesson-complete">
      <button
        type="button"
        className={`btn ${done ? "btn--ghost" : "btn--accent"}`}
        onClick={handleClick}
        disabled={done || busy}
      >
        {done ? `✓ ${t("Lesson completed")}` : busy ? "…" : t("Mark lesson complete")}
      </button>
      {error && (
        <p className="lesson-complete__hint" role="alert">
          {t("Couldn't save that — please try again.")}
        </p>
      )}
    </div>
  );
}
