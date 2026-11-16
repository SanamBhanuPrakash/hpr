import { Link } from "react-router-dom";
import { Phone, ArrowRight, Home } from "lucide-react";
import SEO from "../components/seo/SEO";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg text-center">
          <p className="text-7xl font-extrabold text-[#1A4744]/15 leading-none mb-4">404</p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A4744] leading-tight tracking-tight mb-4">
            This page doesn't exist.
          </h1>

          <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-md mx-auto">
            The link you followed may be broken, or the page may have moved. Here's how to get
            back to Shades of Green.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A4744] text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to homepage
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+919187210414"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[#1A4744] font-semibold rounded-lg border border-gray-200 hover:border-[#1A4744]/40 hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call us now
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
