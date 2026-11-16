import { useEffect, useRef, useState } from "react";
import { X, Send, Bot, RotateCcw, CalendarPlus } from "lucide-react";
import { useChatEngine } from "./useChatEngine";
import { ASSISTANT_NAME } from "./chatFlow";
import ChatMessage from "./ChatMessage";
import ChatQuickReplies from "./ChatQuickReplies";
import SiteVisitScheduler from "./SiteVisitScheduler";
import OtpInput from "./OtpInput";
import PhoneInput from "./PhoneInput";
import "./chat.css";

export default function ChatWindow({ onClose }) {
  const {
    messages,
    isTyping,
    inputError,
    currentOptions,
    currentStepType,
    awaitingFreeText,
    calendarLink,
    userName,
    submitFreeText,
    selectOption,
    selectDateTime,
    restart,
  } = useChatEngine();

  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, currentOptions]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    submitFreeText(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // A large, tall panel anchored near the top-right of the viewport (fixed,
  // present on every route — not tied to any one page section), not a small
  // bottom-right bubble. `top`+`bottom` (rather than a fixed height) so it
  // fills most of the viewport's height responsively at any screen size,
  // leaving room below for the launcher's normal resting spot
  // (bottom-5 right-5 — see ChatLauncher.jsx) to stay clear of it.
  // `right-20` (not right-6) so it doesn't cover the WhatsApp/BackToTop
  // stack, which stays visible while chat is open (unlike round 15/16,
  // where this corner card fully occupied their footprint) — those sit at
  // right-5 with a 50px width, occupying 20-70px from the edge, so the
  // window's own right edge needs to clear 70px.
  return (
    <div
      role="dialog"
      aria-label="Shades of Green chat assistant"
      aria-modal="true"
      className="fixed z-[9999] bg-white flex flex-col overflow-hidden
        bottom-0 right-0 w-screen h-[100dvh] rounded-none
        sm:top-24 sm:bottom-20 sm:right-20 sm:h-auto sm:w-[380px] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#1A4744] px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4.5 h-4.5 text-emerald-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">{ASSISTANT_NAME} &middot; Shades of Green</p>
          <p className="text-emerald-200 text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" aria-hidden="true" />
            Online &middot; replies instantly
          </p>
        </div>
        <button
          type="button"
          onClick={restart}
          aria-label="Restart conversation"
          title="Restart conversation"
          className="flex-shrink-0 flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold hidden sm:inline">Restart</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Messages + quick-replies + scheduler all share ONE scrollable
          region — this is deliberate, not incidental. Anything rendered as
          a sibling OUTSIDE this scroll area, inside the fixed-height
          window, risks being silently clipped by the window's
          overflow-hidden the moment its content grows even slightly taller
          than expected (this happened twice already: the site-visit
          scheduler's Confirm button, then a 7th quick-reply option). Inside
          one shared scroll container, nothing is ever unreachable —
          scrolling always gets you to it. */}
      <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} userName={userName} />
        ))}
        {isTyping && (
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-7 h-7 rounded-full bg-[#1A4744] flex-shrink-0" />
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 sog-chat-typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 sog-chat-typing-dot" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 sog-chat-typing-dot" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        {!isTyping && currentOptions.length > 0 && (
          <ChatQuickReplies options={currentOptions} onSelect={selectOption} />
        )}
        {!isTyping && currentStepType === "datetime" && <SiteVisitScheduler onConfirm={selectDateTime} />}
        {/* Keyed on message count so a wrong-code response (a new bot
            message) remounts this with cleared boxes, ready for a retry —
            simpler than threading a dedicated error prop through. */}
        {!isTyping && currentStepType === "otp" && (
          <OtpInput key={messages.length} onComplete={submitFreeText} />
        )}
        {!isTyping && currentStepType === "phone" && <PhoneInput onSubmit={submitFreeText} />}
        {/* Lives in the normal message flow, not a separate "conversation
            complete" screen — the conversation keeps going right after a
            site-visit booking, this is just part of that same thread.
            Cleared automatically once a new topic is picked (see
            useChatEngine.js's selectOption). */}
        {calendarLink && (
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A4744] text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            Add visit to Google Calendar
          </a>
        )}
      </div>

      {/* The conversation never hard-stops into a separate "complete"
          screen — it folds straight back into "anything else?" after every
          topic (see useChatEngine.js's finishConversation), so the input
          stays available continuously rather than being swapped out. */}
      {awaitingFreeText && (
        <div className="border-t border-gray-100 px-3 py-3 flex-shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentStepType === "otp" || currentStepType === "phone"
                  ? "Or type a question instead..."
                  : "Type your message..."
              }
              aria-label="Your message"
              className="flex-1 resize-none border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 max-h-24"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-[#1A4744] text-white flex items-center justify-center flex-shrink-0 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {inputError && <p className="text-xs text-red-600 mt-1.5 px-1">{inputError}</p>}
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400 pb-2 flex-shrink-0">
        Shades of Green &middot; HPR Infra
      </p>
    </div>
  );
}
