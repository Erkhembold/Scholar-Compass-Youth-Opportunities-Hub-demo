// Score colours used everywhere a writing band is shown:
// red = 5.0 or below, yellow = 5.5 to 6.5, green = 7.0 and above.
export function bandTier(band) {
  const b = Number(band);
  if (!Number.isFinite(b)) return "none";
  if (b <= 5) return "red";
  if (b <= 6.5) return "yellow";
  return "green";
}
