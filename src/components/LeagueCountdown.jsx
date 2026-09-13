import { useEffect, useState } from "react";
import { getWeekInfo, formatCountdown } from "../utils/leaderboard.js";

function pad(n) {
  return String(n).padStart(2, "0");
}

// Ticks every second, but always derives its value from a real timestamp
// (getWeekInfo), not from counting down an initial number client-side —
// so it self-corrects if the tab was backgrounded and stays accurate
// across reloads.
export default function LeagueCountdown() {
  const [remaining, setRemaining] = useState(() => getWeekInfo().msRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(getWeekInfo().msRemaining), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = formatCountdown(remaining);

  return (
    <div className="league-countdown">
      <span className="league-countdown__label">Week ends in</span>
      <div className="league-countdown__clock" role="timer" aria-live="off">
        <span>{pad(days)}</span>
        <span className="league-countdown__sep">:</span>
        <span>{pad(hours)}</span>
        <span className="league-countdown__sep">:</span>
        <span>{pad(minutes)}</span>
        <span className="league-countdown__sep">:</span>
        <span>{pad(seconds)}</span>
      </div>
      <div className="league-countdown__units">
        <span>Days</span>
        <span>Hours</span>
        <span>Min</span>
        <span>Sec</span>
      </div>
    </div>
  );
}
