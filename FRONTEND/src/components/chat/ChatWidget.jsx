import { lazy, Suspense, useState } from "react";
import ChatLauncher from "./ChatLauncher";
import ChatGreetingBubble from "./ChatGreetingBubble";
import WhatsAppButton from "../whatsapp/WhatsAppButton";
import BackToTop from "../common/BackToTop";

// The chat panel's code (state machine, message list, validators) is only
// downloaded the first time someone actually opens it — most visitors never
// will, so this keeps it out of the initial bundle entirely.
// See ARCHITECTURE.md §3.5.
const ChatWindow = lazy(() => import("./ChatWindow"));

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const toggleChat = () => setIsOpen((v) => !v);

  return (
    <>
      {/* Stay visible even while chat is open on desktop/tablet — the chat
          panel is positioned (right-20) specifically to clear this stack's
          footprint (right-5, 50px wide). Only hide on mobile, where chat
          still goes full-screen. */}
      <BackToTop hiddenOnMobile={isOpen} />
      <WhatsAppButton hiddenOnMobile={isOpen} />
      <ChatGreetingBubble onOpen={openChat} isChatOpen={isOpen} />
      {/* Always mounted, not just when closed — it doubles as the close
          button while chat is open (see ChatLauncher.jsx's isOpen-aware
          icon), so the one button toggles the chat open and shut, exactly
          like every other site's chat widget. */}
      <ChatLauncher isOpen={isOpen} onClick={toggleChat} />
      {isOpen && (
        <Suspense fallback={null}>
          <ChatWindow onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
