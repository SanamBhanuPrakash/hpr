import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 150;

// Top of the right-side stack (bottom-[152px]) — see WhatsAppButton.jsx's
// note for the full order. Stays visible even while chat is open on
// desktop/tablet (the chat panel is positioned to clear this stack); only
// hides on mobile, where chat goes full-screen and would otherwise sit
// underneath this floating button with nothing to click through to.
export default function BackToTop({ hiddenOnMobile = false }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed z-[9992] bottom-[152px] right-5 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-xl ring-2 ring-white items-center justify-center hover:bg-emerald-700 hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
        hiddenOnMobile ? "hidden sm:flex" : "flex"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
