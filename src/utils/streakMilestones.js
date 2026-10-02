import { addDays, todayInUB } from "./streak.js";

// Common streak milestones (days). Chosen to feel achievable early (3, 7)
// and meaningful later (a month, a season, a year), matching the cadence
// most streak-based apps use.
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 180, 365];

// One row per milestone: whether it's ever been reached (by the longest
// streak on record — reaching it once counts, even if the streak later
// broke), and, for ones not yet reached, how many more days an ALIVE
// streak needs and the calendar date that lands on.
export function buildMilestones({ current, longest, isAlive }, today = todayInUB()) {
  return STREAK_MILESTONES.map((days) => {
    const achieved = longest >= days;
    if (achieved) {
      return { days, achieved: true, daysToGo: null, targetDate: null };
    }
    const daysToGo = isAlive ? Math.max(0, days - current) : null;
    const targetDate = isAlive ? addDays(today, daysToGo) : null;
    return { days, achieved: false, daysToGo, targetDate };
  });
}

// A short, human label for a milestone's length ("7 days", "2 weeks",
// "1 month", "1 year") rather than always spelling out the raw day count.
export function milestoneLabel(days) {
  if (days === 7) return "1 week";
  if (days === 14) return "2 weeks";
  if (days === 30) return "1 month";
  if (days === 60) return "2 months";
  if (days === 100) return "100 days";
  if (days === 180) return "6 months";
  if (days === 365) return "1 year";
  return `${days} days`;
}
