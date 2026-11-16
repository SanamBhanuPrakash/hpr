const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// A verified, engaged visitor (real name, real verified email) who closes
// the tab before ever completing a topic + phone number would otherwise be
// lost entirely — /submit is only ever reached at the very end of a full
// flow. This fires a best-effort save on the way out via `navigator.
// sendBeacon`, the one browser API actually designed to reliably deliver a
// small request during page unload (a regular `fetch` can be cancelled
// mid-flight the instant the tab closes). The caller doesn't get a response
// and shouldn't wait for one — this is fire-and-forget by design.
export function sendPartialLeadBeacon(payload) {
  try {
    if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return false;
    // `text/plain`, not `application/json` — found the hard way locally:
    // frontend and backend run on different ports (different origins) in
    // dev, and "application/json" isn't a CORS-safelisted content type, so
    // it triggers a preflight OPTIONS request. `sendBeacon` has no way to
    // wait for or complete a preflight (it's fire-and-forget by spec), so
    // the browser just silently drops the whole request — no error, no
    // network entry, nothing. `text/plain` IS safelisted, so it always
    // sends with no preflight, same-origin or cross-origin. The body is
    // still valid JSON text; the backend route parses it as such.
    const blob = new Blob([JSON.stringify(payload)], { type: "text/plain" });
    return navigator.sendBeacon(`${API_BASE_URL}/api/shadesofgreen-form/partial-lead`, blob);
  } catch {
    // Never let a best-effort background save throw and disrupt the actual
    // page-unload the visitor is in the middle of.
    return false;
  }
}
