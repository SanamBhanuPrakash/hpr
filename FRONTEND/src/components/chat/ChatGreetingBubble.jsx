import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ASSISTANT_NAME } from "./chatFlow";

const DISMISS_KEY = "sog_chat_greeting_dismissed";
const FIRST_SHOW_MS = 3500;
const VISIBLE_MS = 8000; // how long it stays up before fading out
const HIDDEN_MS = 18000; // how long it waits before showing again

// A proactive nudge next to the launcher. Cycles — visible, fades out,
// reappears — for as long as the visitor hasn't opened the chat, instead
// of showing once and disappearing for good. Stops permanently once the
// visitor opens the chat (isChatOpen) or explicitly dismisses it (X).
export default function ChatGreetingBubble({ onOpen, isChatOpen }) {
  const [visible, setVisible] = useState(false);
  const stoppedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // ignore
    }
    if (dismissed) {
      stoppedRef.current = true;
      return;
    }

    const cycle = (show) => {
      if (stoppedRef.current) return;
      setVisible(show);
      timerRef.current = setTimeout(() => cycle(!show), show ? VISIBLE_MS : HIDDEN_MS);
    };

    timerRef.current = setTimeout(() => cycle(true), FIRST_SHOW_MS);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Opening the chat stops the cycle for good, not just this one showing.
  useEffect(() => {
    if (isChatOpen) {
      stoppedRef.current = true;
      clearTimeout(timerRef.current);
    }
  }, [isChatOpen]);

  const dismiss = () => {
    stoppedRef.current = true;
    clearTimeout(timerRef.current);
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (!visible || isChatOpen) return null;

  return (
    <div
      className="fixed z-[9992] bottom-5 right-[76px] max-w-[230px] bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 px-4 py-3 sog-chat-msg-in hidden sm:block transition-opacity duration-500"
      role="status"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
      >
        <X className="w-3 h-3 text-gray-600" />
      </button>
      <button type="button" onClick={onOpen} className="text-left w-full">
        <p className="text-sm font-semibold text-[#1A4744] mb-0.5">Need help? I'm {ASSISTANT_NAME} 👋</p>
        <p className="text-xs text-gray-500">Ask me about pricing, RERA, or book a site visit.</p>
      </button>
    </div>
  );
}
