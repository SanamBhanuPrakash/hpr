import { Link } from "react-router-dom";

// Same real content/assets as LandingPage.jsx's footer (logo, address,
// phone, email, RERA disclaimer, real social links), but with working
// multi-page navigation instead of the homepage's in-page scroll anchors
// (#gallery etc.), which don't resolve to anything off the homepage.
export default function SiteFooter() {
  return (
    <footer className="bg-[#1A4744] pt-12 pb-8 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          <div className="space-y-4">
            <img src="/images/HPR_LOGO.png" alt="HPR Infra Logo" className="h-20 w-auto object-contain" />
            <p className="text-sm text-white leading-relaxed max-w-xs">
              HPR Infra - Your Trusted Partner for Apartments, Villas &amp; Plotted Developments.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {["Home", "Gallery", "Lifestyle", "Amenities", "Connectivity", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                    className="text-white hover:text-emerald-400 transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white hover:text-emerald-400 transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-white hover:text-emerald-400 transition-colors font-medium"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-white">
              <p>
                101, Silicon towers Near image gardens, Image garden road, Madhapur &ndash; 500081
              </p>
              <div className="flex items-center gap-3">
                <a href="tel:+919187210414" className="hover:text-emerald-400 transition-colors">
                  +91 9187210414
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:sales@hprinfra.com"
                  className="hover:text-emerald-400 transition-colors break-all"
                >
                  sales@hprinfra.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/people/HPR-Infra/61586207792555/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/hpr_infra/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-100 hover:bg-red-400 text-red-600 hover:text-white rounded-lg flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@HPRInfra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-lg flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-5 pb-5">
          <p className="text-xs text-white leading-relaxed">
            <strong>Disclaimer:</strong> All images are artistic impressions unless stated. Areas,
            specifications, and approvals are subject to authority revisions.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-5">
          <p className="text-sm text-white">&copy; 2025 Shades of Green by HPR Infra. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
