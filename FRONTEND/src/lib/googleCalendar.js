// Builds a Google Calendar "quick add" URL — no OAuth, no API key, just
// opens calendar.google.com pre-filled. Works for both the visitor (add
// their own site-visit reminder) and the sales team (the same kind of link
// embedded in their notification email, pre-filled with the visitor's name
// and phone so they can add it to their own calendar in one click).
function toGCalUTC(date) {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

export function buildGoogleCalendarUrl({ title, start, durationMinutes = 60, details, location }) {
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGCalUTC(start)}/${toGCalUTC(end)}`,
    details: details || "",
    location: location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
