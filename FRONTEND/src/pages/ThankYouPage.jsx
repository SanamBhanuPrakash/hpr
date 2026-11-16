import { Link } from "react-router-dom";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";
import SEO from "../components/seo/SEO";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <SiteHeader />

      <main className="flex-1 grid lg:grid-cols-[1fr_1.15fr]">
        {/* Image panel — clean, no text overlay */}
        <div className="relative min-h-[280px] lg:min-h-[calc(100vh-64px)]">
          <img
            src="/images/Copy of V4.webp"
            alt="Shades of Green villa community"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
            <p className="text-2xl font-extrabold text-[#1A4744] leading-none">83</p>
            <p className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase mt-0.5">
              Exclusive Villas
            </p>
          </div>
        </div>

        {/* Content panel — left-aligned, no floating card, no exclamation mark */}
        <div className="flex items-center bg-white">
          <div className="w-full max-w-lg mx-auto px-6 py-16 lg:px-14 lg:py-0">
            <p className="text-xs font-bold tracking-[0.15em] text-emerald-600 uppercase mb-5">
              Enquiry Confirmed
            </p>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A4744] leading-[1.05] tracking-tight mb-6">
              Thank you for
              <br />
              showing interest.
            </h1>

            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md">
              We've received your enquiry for Shades of Green. One of our executives will
              reach out to understand your requirements and help you take the next step.
            </p>

            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
              <span className="text-3xl font-extrabold text-[#1A4744] leading-none">24h</span>
              <span className="text-sm text-gray-500 leading-snug">
                is our typical response window — our team will call or email you within this time.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A4744] text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Back to website
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

            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Prefer WhatsApp? Use the icon in the corner, anytime.
            </div>
            <p className="text-xs text-gray-400">RERA: PRM/KA/RERA/1251/446/PR/040826/008858</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
