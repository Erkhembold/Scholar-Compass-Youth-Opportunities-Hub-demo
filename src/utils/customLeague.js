// Pure helpers for custom (friend) leagues. The rules themselves are enforced
// in supabase/custom_leagues.sql; these only turn its answers into text.
export const MAX_MEMBERS = 20;
export const NAME_MIN = 3;
export const NAME_MAX = 40;
export const DESC_MAX = 200;

const ERRORS = {
  not_found: "That league or invite is no longer available.",
  forbidden: "Only the league owner can do that.",
  invalid_name: `League names need ${NAME_MIN}–${NAME_MAX} characters.`,
  invalid_description: `Descriptions can be at most ${DESC_MAX} characters.`,
  invalid_mode: "Pick how the league scores XP.",
  owned_limit: "You can own up to 5 leagues. Delete one to make another.",
  joined_limit: "You can be in up to 10 leagues. Leave one first.",
  league_full: `This league is full (${MAX_MEMBERS} people, counting pending invites).`,
  self_invite: "You're already in your own league.",
  not_friends: "You can only invite friends.",
  already_member: "They're already in this league.",
  already_invited: "They already have a pending invite.",
  invite_cooldown: "They declined recently. Try again in a few days.",
  not_pending: "That invite was already answered or cancelled.",
  owner_cannot_leave: "Owners can't leave. Delete the league instead.",
  cannot_remove_owner: "The owner can't be removed.",
  too_many_invitees: `A league holds up to ${MAX_MEMBERS} people.`,
};

export function leagueErrorMessage(err) {
  const raw = String(err?.message || err || "");
  const code = Object.keys(ERRORS).find((k) => raw.includes(k));
  return code ? ERRORS[code] : "Something went wrong. Please try again.";
}

export function validateLeagueForm({ name, description }) {
  const n = (name || "").trim();
  if (n.length < NAME_MIN || n.length > NAME_MAX) return ERRORS.invalid_name;
  if ((description || "").trim().length > DESC_MAX) return ERRORS.invalid_description;
  return "";
}

export const MODE_LABEL = {
  weekly: "Weekly XP",
  ongoing: "Since joining",
};

export const MODE_HELP = {
  weekly: "Counts this week's XP, the same week as the global leaderboard. Everyone starts fresh each Monday.",
  ongoing: "Counts XP earned after you joined, with no reset. Good for a long race.",
};

export function leagueHref(id) {
  return `#/leagues/${encodeURIComponent(id)}`;
}
