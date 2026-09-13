// The 10 ScholarCompass leagues, lowest to highest. Colors are used as
// accents (badges, borders, highlights) layered on top of the existing
// navy site identity — never as full-page backgrounds — so the league
// system reads as a feature of ScholarCompass, not a different product.
//
// `text` says whether a solid chip filled with `primary` needs light or
// dark text on top of it to stay readable.

export const LEAGUES = [
  { id: "bronze", name: "Bronze", order: 0, primary: "#B0713A", soft: "#F3E4D3", text: "light" },
  { id: "silver", name: "Silver", order: 1, primary: "#8D97A3", soft: "#EDEFF2", text: "dark" },
  { id: "gold", name: "Gold", order: 2, primary: "#D6A419", soft: "#FBEFC9", text: "dark" },
  { id: "sapphire", name: "Sapphire", order: 3, primary: "#2E5FD9", soft: "#DEE7FB", text: "light" },
  { id: "ruby", name: "Ruby", order: 4, primary: "#C42846", soft: "#F8DBE1", text: "light" },
  { id: "emerald", name: "Emerald", order: 5, primary: "#1E9E63", soft: "#D9F2E5", text: "light" },
  { id: "amethyst", name: "Amethyst", order: 6, primary: "#8A4FD1", soft: "#EBE0FA", text: "light" },
  { id: "pearl", name: "Pearl", order: 7, primary: "#C9C2B8", soft: "#F7F5F1", text: "dark" },
  { id: "obsidian", name: "Obsidian", order: 8, primary: "#232323", soft: "#E3E3E3", text: "light" },
  { id: "diamond", name: "Diamond", order: 9, primary: "#5FD4E0", soft: "#E1FAFC", text: "dark" },
];

export const LEAGUE_BY_ID = Object.fromEntries(LEAGUES.map((l) => [l.id, l]));

export function nextLeague(id) {
  const l = LEAGUE_BY_ID[id];
  if (!l) return null;
  return LEAGUES.find((x) => x.order === l.order + 1) || null;
}

export function previousLeague(id) {
  const l = LEAGUE_BY_ID[id];
  if (!l) return null;
  return LEAGUES.find((x) => x.order === l.order - 1) || null;
}
