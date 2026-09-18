// Single source of truth for how much XP each activity is worth. Change
// the numbers here and every part of the app that awards XP updates
// automatically — nothing else should hard-code a point value.
export const XP_REWARDS = {
  ieltsPractice: 60,
  satQuestion: 5,
  quiz: 25,
  learningModule: 35,
  opportunityTask: 15,
};

// Increments both weekly and lifetime XP for a user in one round trip.
// Weekly XP resets at the end of each competition (see processWeeklyReset
// in leagueProfile.js); lifetime XP never resets.
export async function awardXp(supabase, userId, activityType) {
  const amount = XP_REWARDS[activityType] ?? 0;
  if (!supabase || !userId || amount <= 0) return;

  const { data } = await supabase
    .from("profiles")
    .select("weekly_xp, lifetime_xp")
    .eq("id", userId)
    .single();

  const weekly = (data?.weekly_xp || 0) + amount;
  const lifetime = (data?.lifetime_xp || 0) + amount;

  await supabase.from("profiles").update({ weekly_xp: weekly, lifetime_xp: lifetime }).eq("id", userId);
}
