import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

const LENGTH = 6;

// A dedicated 6-box code entry widget for the verify_otp step — same
// pattern as SiteVisitScheduler for the datetime step: a real purpose-built
// input instead of making someone type a 6-digit code into the generic
// free-text message box. Auto-advances per digit, supports pasting the
// whole code at once, and auto-submits the moment all 6 boxes are filled.
// ChatWindow.jsx remounts this (via a changing `key`) whenever a new bot
// message arrives, so a wrong-code response clears the boxes for a retry
// without this component needing to know why.
export default function OtpInput({ onComplete }) {
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const inputRefs = useRef([]);
  const submittedRef = useRef(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const trySubmit = (nextDigits) => {
    const code = nextDigits.join("");
    if (code.length === LENGTH && !submittedRef.current) {
      submittedRef.current = true;
      onComplete(code);
    }
  };

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, "");
    if (!value) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    // Handles a fast typist or a single-field paste landing multiple
    // digits in one box — spreads them forward from this position.
    const next = [...digits];
    const chars = value.split("");
    let i = index;
    for (const ch of chars) {
      if (i >= LENGTH) break;
      next[i] = ch;
      i++;
    }
    setDigits(next);
    const focusIndex = Math.min(i, LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    trySubmit(next);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    trySubmit(next);
  };

  return (
    // Brand-themed (matches ChatWindow.jsx's header exactly: #1A4744 + a
    // light emerald tint) rather than a generic gray card — this is the
    // one moment in the flow that most needs to visibly feel like it
    // belongs to Shades of Green, not a stock form widget.
    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
      <div className="flex items-center justify-center gap-1.5 mb-3 text-[#1A4744]">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-wide">Secure Email Verification</span>
      </div>
      <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={LENGTH}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            // Also attached directly on each box, not just the wrapping div
            // above — paste events do bubble in every mainstream browser, so
            // this is redundant in the common case, but it's a cheap,
            // zero-risk safety net against any browser/extension that
            // intercepts or stops the event before it bubbles up.
            onPaste={handlePaste}
            aria-label={`Verification code digit ${i + 1}`}
            className={`w-10 h-12 text-center text-lg font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A4744] ${
              digit
                ? "border-2 border-[#1A4744] bg-white text-[#1A4744]"
                : "border border-gray-300 bg-white text-gray-800"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-emerald-800/60 mt-2.5 text-center">
        You can paste the whole code, or type it digit by digit.
      </p>
    </div>
  );
}
