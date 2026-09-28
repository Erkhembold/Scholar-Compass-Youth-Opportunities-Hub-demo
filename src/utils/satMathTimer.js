// Pure helpers for the SAT Math 1v1 clock. Everything is derived from the
// server's started_at timestamp, so refreshing/reconnecting can never restart
// or shift the timer. `nowMs` must be SERVER time (see useSatMathMatch).

// phase: "lobby" | "countdown" | "question" | "finishing" | "ended"
export function computeClock(match, nowMs) {
  if (!match) return { phase: "lobby" };
  if (match.status === "completed") return { phase: "ended" };
  if (match.status !== "in_progress" || !match.started_at) return { phase: "lobby" };

  const startedMs = Date.parse(match.started_at);
  const per = match.time_per_question_seconds;
  const total = match.question_count;
  const elapsed = (nowMs - startedMs) / 1000;

  if (elapsed < 0) return { phase: "countdown", countdownLeft: Math.ceil(-elapsed) };

  const index = Math.floor(elapsed / per);
  if (index >= total) return { phase: "finishing" };

  const intoQuestion = elapsed - index * per;
  return {
    phase: "question",
    index,
    secondsLeft: Math.max(0, Math.ceil(per - intoQuestion)),
    fractionLeft: Math.max(0, Math.min(1, 1 - intoQuestion / per)),
  };
}

// The other player counts as "connected" if their heartbeat is recent.
export function isPlayerConnected(lastSeenIso, nowMs, thresholdMs = 15000) {
  if (!lastSeenIso) return false;
  return nowMs - Date.parse(lastSeenIso) <= thresholdMs;
}
