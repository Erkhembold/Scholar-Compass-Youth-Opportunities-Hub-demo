// Student levels, derived entirely from `profile.lifetime_xp` (already a
// real, permanent column — see utils/xp.js, awarded for SAT questions,
// IELTS practice, and IELTS mocks). No new database column or migration:
// a level is just a read of XP the app already tracks, so it works the
// moment this ships.
//
// Curve: XP required to REACH level L grows quadratically (50 * L * (L-1)),
// so early levels come quickly and later ones take sustained practice —
// the standard shape for this kind of progress system.
//   Level 1: 0 pts       Level 5: 1,000 pts     Level 9: 3,600 pts
//   Level 2: 100 pts     Level 6: 1,500 pts     Level 10: 4,500 pts
//   Level 3: 300 pts     Level 7: 2,100 pts
//   Level 4: 600 pts     Level 8: 2,800 pts
export function xpForLevel(level) {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp) {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

// Everything a level display needs for the current XP total: the level
// itself, the XP band it sits in, and how far through that band it is.
export function levelProgress(xp) {
  const total = Math.max(0, xp || 0);
  const level = levelFromXp(total);
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  const span = ceiling - floor;
  const into = Math.max(0, total - floor);
  return {
    level,
    floor,
    ceiling,
    into,
    total,
    remaining: Math.max(0, ceiling - total),
    fraction: span > 0 ? Math.min(1, into / span) : 1,
  };
}
