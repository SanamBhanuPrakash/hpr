import { MessageCircle, X } from "lucide-react";
import "./chat.css";

// Bottom of the right-side stack (closest to the corner, most prominent):
// this → WhatsApp (bottom-[86px]) → BackToTop (bottom-[152px]) when closed.
// See WhatsAppButton.jsx.
//
// Stays at this same resting spot whether the chat is open or closed —
// the chat window itself is now a large panel anchored near the top-right
// (see ChatWindow.jsx), not docked against this corner, so this button no
// longer needs to reposition itself to "attach" to it. It still doubles as
// the close control while open (icon swaps to an X), it just does so from
// its normal place rather than moving.
export default function ChatLauncher({ isOpen, onClick, hasUnread }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      aria-expanded={isOpen}
      className="sog-chat-launcher-pop fixed z-[9993] bottom-5 right-5 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      style={{ background: "linear-gradient(145deg, #1A4744, #0f2e2c)" }}
    >
      {isOpen ? (
        <X className="w-5 h-5 text-white" aria-hidden="true" />
      ) : (
        <MessageCircle className="w-5.5 h-5.5 text-white" aria-hidden="true" />
      )}
      {!isOpen && hasUnread && (
        <span
          className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
