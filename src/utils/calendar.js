// Google Calendar "add event" links for opportunity deadlines.

export function createGoogleCalendarUrl(event) {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(`${event.description}\n\nApplied via ScholarCompass`);
  // Format date to YYYYMMDD
  const formattedDate = event.date.replace(/-/g, "");
  return `${baseUrl}&text=${text}&details=${details}&dates=${formattedDate}/${formattedDate}`;
}

// Plain-text summary for the calendar entry: opportunity descriptions can be
// long, bilingual and full of line breaks, so take a short readable start.
export function summarize(description, max = 320) {
  const raw =
    typeof description === "string"
      ? description
      : description && typeof description === "object"
      ? description.en || description.mn || ""
      : "";
  const flat = raw.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

// The event for an opportunity, or null when it has no calendar date (a
// label-only deadline like "Rolling" cannot be put on a calendar day).
export function opportunityCalendarUrl(opportunity, pageUrl) {
  const date = opportunity?.deadline?.date;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const summary = summarize(opportunity.description);
  const description = [`Deadline: ${opportunity.title}`, summary, pageUrl].filter(Boolean).join("\n\n");
  return createGoogleCalendarUrl({ title: `Deadline: ${opportunity.title}`, description, date });
}
