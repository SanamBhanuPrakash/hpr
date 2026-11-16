import { memo } from "react";
import { Bot } from "lucide-react";

// Matches exactly how these appear in the bot's own FAQ text (e.g.
// COMPANY_INFO in chatFlow.js: "+91 9187210414", "Sales@hprinfra.com") —
// the phone pattern specifically requires the "+91" prefix rather than a
// bare 10-digit run, so it can never accidentally match a stray 10-digit
// sequence elsewhere (a Khatha/survey number, part of the RERA string,
// etc.). Only ever applied to the bot's own messages, never a visitor's
// typed text — see the isUser check below.
const LINK_PATTERN = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+91[\s-]?\d{10})/g;

function linkifyBotText(text) {
  const parts = text.split(LINK_PATTERN);
  return parts.map((part, i) => {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="underline font-semibold">
          {part}
        </a>
      );
    }
    if (/^\+91[\s-]?\d{10}$/.test(part)) {
      return (
        <a key={i} href={`tel:${part.replace(/[\s-]/g, "")}`} className="underline font-semibold">
          {part}
        </a>
      );
    }
    return part;
  });
}

// Initials, not the full name — a small round avatar badge can't fit
// "Rohan Sharma," and truncating a long name mid-word looks broken. The
// same pattern every chat/email UI uses for this exact space constraint.
// Falls back to "You" only for the brief moment before a name exists yet
// (the visitor's very first message IS their name, typed before ctx.name
// is ever set).
function getInitials(name) {
  if (!name || !name.trim()) return "You";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ChatMessage({ role, text, userName }) {
  const isUser = role === "user";
  const initials = getInitials(userName);
  return (
    <div className={`flex gap-2 sog-chat-msg-in ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser ? "bg-gray-200 text-gray-600" : "bg-[#1A4744] text-emerald-300"
        }`}
        aria-hidden="true"
        title={isUser && userName ? userName : undefined}
      >
        {isUser ? (
          <span className="text-xs font-bold">{initials}</span>
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl whitespace-pre-line ${
          isUser
            ? "bg-[#1A4744] text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {isUser ? text : linkifyBotText(text)}
      </div>
    </div>
  );
}

export default memo(ChatMessage);
