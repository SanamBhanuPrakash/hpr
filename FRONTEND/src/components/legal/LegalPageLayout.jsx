import { useState } from "react";
import { List, X } from "lucide-react";
import SEO from "../seo/SEO";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";

/**
 * Shared premium layout for Privacy Policy / Terms & Conditions — hero
 * banner with real brand imagery, sticky in-page table of contents on
 * desktop (collapsible on mobile), numbered sections. One layout, so both
 * legal pages stay visually consistent and neither drifts from the other.
 *
 * `sections`: [{ id, title, body: ReactNode }]
 */
export default function LegalPageLayout({ eyebrow, title, subtitle, sections }) {
  const [tocOpen, setTocOpen] = useState(false);

  const scrollToSection = (id) => {
    setTocOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src="/images/Copy of V4.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2e2c]/95 via-[#0f2e2c]/90 to-[#0f2e2c]/70" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
          <span className="inline-block text-[11px] font-bold tracking-[0.15em] text-emerald-300 uppercase mb-4">
            {eyebrow}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight max-w-xl">{title}</h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-md">{subtitle}</p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        {/* Mobile TOC toggle */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setTocOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-white shadow-sm rounded-xl px-4 py-3 text-sm font-semibold text-[#1A4744]"
          >
            <span className="flex items-center gap-2">
              <List className="w-4 h-4" /> Jump to a section
            </span>
            {tocOpen ? <X className="w-4 h-4" /> : null}
          </button>
          {tocOpen && (
            <nav className="bg-white shadow-sm rounded-b-xl -mt-1 px-4 py-3">
              <ul className="space-y-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className="text-sm text-gray-600 hover:text-emerald-700 text-left"
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
          {/* Desktop sticky TOC — plain list, no card treatment */}
          <nav className="hidden lg:block">
            <div className="sticky top-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-4">On this page</p>
              <ul className="space-y-1 border-l-2 border-gray-100">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className="block w-full text-left text-sm text-gray-500 hover:text-emerald-700 hover:border-emerald-500 transition-colors leading-snug pl-4 py-1.5 -ml-0.5 border-l-2 border-transparent"
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <article className="bg-white rounded-2xl shadow-sm px-6 py-8 sm:px-10 sm:py-10">
            {sections.map((s, i) => (
              <div key={s.id} id={s.id} className={i > 0 ? "mt-8 pt-8 border-t border-gray-100" : ""}>
                <h2 className="text-lg font-bold text-[#1A4744] mb-2.5 flex items-baseline gap-2">
                  <span className="text-emerald-600 text-sm font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed space-y-3 [&_a]:text-emerald-700 [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                  {s.body}
                </div>
              </div>
            ))}
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
