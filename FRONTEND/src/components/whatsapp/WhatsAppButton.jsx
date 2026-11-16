const WHATSAPP_NUMBER = "919187210414"; // same sales number used site-wide (tel:+919187210414)
const WHATSAPP_MESSAGE = "Hi, I'm interested in Shades of Green villas. Could you share more details?";

// Middle of the right-side stack: chat launcher (bottom-5, closest to the
// corner) → this (bottom-[86px]) → BackToTop (bottom-[152px]), all on the
// same side. Stays visible even while chat is open on desktop/tablet — the
// chat panel is positioned (right-20) specifically to clear this stack's
// footprint; only hides on mobile, where chat goes full-screen.
export default function WhatsAppButton({ hiddenOnMobile = false }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed z-[9993] bottom-[86px] right-5 w-[50px] h-[50px] rounded-full bg-[#25D366] shadow-lg items-center justify-center hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
        hiddenOnMobile ? "hidden sm:flex" : "flex"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.512 3.634 1.404 5.14L2 22l4.995-1.378A9.958 9.958 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.2a8.17 8.17 0 01-4.174-1.142l-.3-.178-3.096.855.86-3.02-.196-.31A8.166 8.166 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.523 0 8.2 3.678 8.2 8.2 0 4.523-3.677 8.2-8.199 8.2z" />
      </svg>
    </a>
  );
}
