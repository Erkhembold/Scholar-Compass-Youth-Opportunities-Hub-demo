// Verifies every league tier is readable in BOTH themes. Run: node scripts/check-league-contrast.mjs
import { LEAGUES } from "../src/data/leagues.js";
import { LEAGUE_TOKENS, contrast } from "../src/utils/leagueTheme.js";

const rules = [
  ["fg on bg", "fg", "bg", 7],
  ["muted on bg", "muted", "bg", 4.5],
  ["chip text on chip", "chipFg", "chipBg", 4.5],
];
let bad = 0;
console.log("tier       theme  fg/bg  muted/bg  chip   accent(min page,card)");
for (const l of LEAGUES) {
  for (const theme of ["light", "dark"]) {
    const t = LEAGUE_TOKENS[l.id][theme];
    const page = theme === "light" ? "#ffffff" : "#101828";
    const vals = rules.map(([, a, b]) => contrast(t[a], t[b]));
    const acc = Math.min(contrast(t.accent, page), contrast(t.accent, t.bg));
    rules.forEach(([name, , , min], i) => {
      if (vals[i] < min) { bad++; console.error(`  FAIL ${l.name} ${theme}: ${name} = ${vals[i].toFixed(2)} (< ${min})`); }
    });
    if (acc < 3) { bad++; console.error(`  FAIL ${l.name} ${theme}: accent vs page/card = ${acc.toFixed(2)} (< 3)`); }
    console.log(`${l.name.padEnd(10)} ${theme.padEnd(5)}  ${vals.map((v) => v.toFixed(1).padStart(5)).join("   ")}  ${acc.toFixed(1).padStart(6)}`);
  }
}
console.log(bad ? `\n${bad} FAILURES` : "\nAll 10 tiers pass in light and dark.");
process.exit(bad ? 1 : 0);
