// Meta Pixel is loaded globally via public/index.html — this just wraps the
// existing call site's pattern (`window.fbq && window.fbq(...)`) in one
// place so the homepage form and the chatbot fire it identically.
// Does NOT touch window.dataLayer — GTM's own fetch-wrapper listener
// (GTM-5C7H8M2J) already watches /api/shadesofgreen-form/submit responses
// and pushes generate_lead itself. Duplicating that here would double-count.
export function trackLead() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
}
