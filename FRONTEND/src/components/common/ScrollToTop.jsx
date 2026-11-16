import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation the way a full
// page load does — without this, clicking a footer/nav link mid-scroll
// lands on the new page still scrolled to wherever you were. Skips the
// reset when a hash is present (handled by the section-scroll effects
// instead, e.g. LandingPage.jsx's location.hash effect).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
