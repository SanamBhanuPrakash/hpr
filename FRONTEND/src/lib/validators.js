// Same rules as LandingPage.jsx's validateForm — kept in one place so the
// chatbot and the homepage form can never silently drift apart.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Well-known disposable/throwaway inbox providers — someone using one of
// these on the plain contact form defeats the point of leaving an email at
// all (the whole inbox exists to receive one message and be discarded).
// Not exhaustive, but catches the common, well-known ones people reach for.
// This form has no verification step, so a genuine corporate/company email
// is still accepted here — see validateChatEmail below for why the chatbot
// specifically needs a stricter rule.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "10minutemail.com",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "getnada.com",
  "dispostable.com",
  "sharklasers.com",
  "maildrop.cc",
  "mintemail.com",
  "mohmal.com",
]);

export function validateEmail(value) {
  if (!value) return "Email address is required.";
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
  const domain = value.split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return "Please use a real, permanent email address (not a temporary/disposable one).";
  }
  return null;
}

// Allowlist, not a blocklist — deliberate, and deliberately stricter than
// validateEmail above, used ONLY for the chatbot's OTP-verified email step.
// A blocklist can only ever catch the disposable domains someone already
// thought to list; an allowlist of major personal webmail providers also
// excludes company/corporate domains on purpose — the business reasoning
// given was that a chatbot lead behind a company email is hard to treat as
// a real, individually-verified prospective buyer. Deliberately NOT applied
// to the plain contact form above: that form has no identity verification
// step at all, so there's no reason to reject a genuine corporate buyer
// filling it in directly. A few same-provider aliases are included
// alongside the exact list given (googlemail.com/gmail.com, live.com/
// hotmail.com/outlook.com, me.com/icloud.com are the same account systems
// under different domain names) plus yahoo.co.in, since Yahoo's country
// domains are common in this market and would otherwise reject a real
// Yahoo user for a reason unrelated to the actual policy intent.
const ALLOWED_CHAT_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.in",
  "live.com",
  "yahoo.com",
  "yahoo.co.in",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "gmx.com",
  "aol.com",
  "yandex.com",
]);

export function validateChatEmail(value) {
  if (!value) return "Email address is required.";
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
  const domain = value.split("@")[1]?.toLowerCase();
  if (!domain || !ALLOWED_CHAT_EMAIL_DOMAINS.has(domain)) {
    return "Please use a personal email address (Gmail, Yahoo, Outlook, iCloud, etc.) — company or temporary emails aren't accepted here.";
  }
  return null;
}

// Indian mobile numbers specifically: exactly 10 digits, starting with
// 6-9 per India's numbering plan — not just "any 10 digits" (which would
// accept obviously fake input like 0000000000).
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validatePhone(value) {
  const digits = (value || "").replace(/\D/g, "");
  if (!value) return "Phone number is required.";
  if (!INDIAN_MOBILE_REGEX.test(digits)) return "Please enter a valid 10-digit Indian mobile number.";
  return null;
}

// Not an attempt at "detecting real names" — genuinely hard, real names
// vary enormously and any strict pattern would reject legitimate ones. This
// is deliberately narrow: it only catches the obvious junk someone types
// while testing or being casual instead of giving an actual name ("hello
// bro what," "yo," "test") — shared with the homepage form's own name
// field (see the file header), and equally reasonable there: nobody's real
// name is a greeting or a filler word on either form.
const NAME_FILLER_WORDS = new Set([
  "hi",
  "hello",
  "hey",
  "yo",
  "sup",
  "bro",
  "dude",
  "test",
  "testing",
  "asdf",
  "abc",
  "xyz",
  "lol",
  "ok",
  "okay",
  "what",
  "why",
  "how",
  "who",
  "when",
  "where",
  "none",
  "na",
  "nil",
  "idk",
  "whatever",
]);

export function validateName(value) {
  if (!value || !value.trim()) return "Full Name is required.";
  const trimmed = value.trim();
  if (trimmed.length > 60) return "That doesn't look like a name — please enter your full name.";
  if (/\d/.test(trimmed)) return "Please enter your name without numbers.";
  if (/[?!]/.test(trimmed)) return "That doesn't look like a name — please enter your full name.";
  const words = trimmed.split(/\s+/);
  if (words.length > 5) return "That doesn't look like a name — please enter your full name.";
  if (words.some((w) => NAME_FILLER_WORDS.has(w.toLowerCase().replace(/[^a-z]/g, "")))) {
    return "That doesn't look like a name — please enter your full name.";
  }
  return null;
}

export function validateOtp(value) {
  const digits = (value || "").trim();
  if (!digits) return "Please enter the code we sent you.";
  if (!/^\d{6}$/.test(digits)) return "That code should be exactly 6 digits.";
  return null;
}
