// Formats the various shapes a deadline can take: a plain override label
// ("Rolling until event day"), an ISO date with optional time, or nothing
// at all ("Not specified"). Centralized so cards and the detail page never
// disagree on formatting.
export function formatDeadline(deadline, { withPrefix = false } = {}) {
  if (!deadline) return "Not specified";

  if (deadline.label) return deadline.label;

  if (!deadline.date) return "Not specified";

  const parsed = new Date(`${deadline.date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return deadline.date;

  const datePart = parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const full = deadline.time ? `${datePart}, ${deadline.time}` : datePart;
  return withPrefix ? `Due ${full}` : full;
}
