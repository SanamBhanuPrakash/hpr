import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";

const NAV_ITEMS = ["Home", "Gallery", "Lifestyle", "Amenities", "Connectivity", "Contact"];

// Full navbar matching the homepage's — used on Thank You / Privacy / Terms
// so the site feels continuous rather than dropping into a stripped-down
// page. Not extracted FROM the homepage header (that one is wired to
// scroll-spy state that only makes sense on the one-page homepage itself —
// see ARCHITECTURE.md §2.2) — this is a parallel component using the same
// section ids via `/#id`, which LandingPage.jsx scrolls to on load
// (see its useEffect reading location.hash). Sizing/spacing deliberately
// mirrors the homepage header's exact classes so the two never look
// visually inconsistent with each other.
export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#1A4744] backdrop-blur-xl py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" aria-label="Shades of Green home" className="flex items-center gap-3">
            <img src="/images/Logo3.png" alt="Shades of Green Logo" className="h-12 sm:h-13 md:h-14 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                className="group relative text-[16px] font-semibold text-white hover:text-emerald-300 transition-colors"
              >
                {item}
                <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 xl:gap-4">
            <div className="hidden lg:flex flex-col items-end gap-1">
              <a
                href="tel:+919187210414"
                className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-1.5 bg-white text-black rounded-xl hover:bg-emerald-700 hover:text-white transition-colors font-semibold text-xs xl:text-sm shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 9187210414
              </a>
              <div className="text-[10px] font-mono font-semibold tracking-tight text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 shadow-sm whitespace-nowrap">
                RERA: PRM/KA/RERA/1251/446/PR/040826/008858
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 pt-4">
            <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-4">
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item}
                    to={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-gray-800 hover:text-emerald-700 hover:bg-emerald-50 transition-colors rounded-xl px-4 py-3"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="tel:+919187210414"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1A4744] text-white rounded-xl font-semibold text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +91 9187210414
                </a>
                <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 block text-center">
                  RERA: PRM/KA/RERA/1251/446/PR/040826/008858
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
