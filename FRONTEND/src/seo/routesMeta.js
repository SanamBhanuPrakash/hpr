// Single source of truth for per-route metadata. See ARCHITECTURE.md §4.1.

const BASE_URL = "https://shadesofgreens.in";

export const routesMeta = {
  "/": {
    title: "Shades of Green | 4BHK Villas in North Bengaluru, Hennur",
    description:
      "83 exclusive 4BHK villas by HPR Infra off Hennur, near New Airport Road, North Bengaluru. RERA registered. Courtyard-led layouts, 15,000 sq.ft. clubhouse.",
    robots: "index,follow",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Shades of Green",
    description:
      "Privacy Policy for shadesofgreens.in — how HPR Infra collects, uses, and protects your information.",
    robots: "index,follow",
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | Shades of Green",
    description:
      "Terms and Conditions for using shadesofgreens.in, the official website for Shades of Green by HPR Infra.",
    robots: "index,follow",
  },
  "/thank-you": {
    title: "Thank You | Shades of Green",
    description: "Thank you for your enquiry about Shades of Green. Our team will contact you within 24 hours.",
    robots: "noindex,nofollow,noarchive",
  },
};

const NOT_FOUND_META = {
  title: "Page Not Found | Shades of Green",
  description: "The page you're looking for doesn't exist. Return to the Shades of Green homepage.",
  robots: "noindex,nofollow",
};

// True only for a build made with `PUBLIC_URL=/staging` (see the staging
// deploy steps in PLAN.md) — never true for the real production build.
// Needed because Helmet is the sole owner of the `robots` tag (see
// index.html's comment on why there's no static duplicate) — a crawler
// that executes JS, like Googlebot, would otherwise see this route's real
// `index,follow` value once Helmet mounts, regardless of any noindex meta
// baked into the static HTML shell.
const IS_STAGING_BUILD = process.env.PUBLIC_URL === "/staging";

export function getRouteMeta(pathname) {
  // Any unmatched path (App.jsx's `*` route) must never inherit the
  // homepage's index,follow meta — that would tell Google two different
  // URLs are the same indexable page.
  const meta = routesMeta[pathname] || NOT_FOUND_META;
  const robots = IS_STAGING_BUILD ? "noindex,nofollow,noarchive" : meta.robots;
  return { ...meta, robots, canonical: `${BASE_URL}${pathname === "/" ? "" : pathname}` };
}
