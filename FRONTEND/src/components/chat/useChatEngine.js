import { useCallback, useEffect, useRef, useState } from "react";
import {
  chatFlow,
  START_STEP,
  FAQ_TOPICS,
  matchFaqTopics,
  DOWNLOAD_TRIGGERS,
  NEED_VERIFICATION_MESSAGE,
  PURCHASE_INTENT_PATTERN,
  buildConversationSummary,
} from "./chatFlow";
import { validateName, validatePhone, validateChatEmail, validateOtp } from "../../lib/validators";
import { useLeadSubmit } from "../../hooks/useLeadSubmit";
import { sendOtp, verifyOtp } from "../../lib/otp";
import { buildGoogleCalendarUrl } from "../../lib/googleCalendar";
import { sendPartialLeadBeacon } from "../../lib/partialLead";

const VISIT_LOCATION =
  "Shades of Green, Sy.No.:59/1, 59/2 & 59/3, Kadusoppanahalli Village, Bidarahalli Hobli, Bengaluru East Taluk";

// Same download-trigger pattern as LandingPage.jsx's brochure modal —
// a throwaway anchor click, no new mechanism invented.
function triggerFileDownload(key) {
  const file = DOWNLOAD_TRIGGERS[key];
  if (!file) return;
  const link = document.createElement("a");
  link.href = file.fileUrl;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const STORAGE_KEY = "sog_chat_session_v1";
// No "email" entry — ask_email is intercepted early in submitFreeText
// (calls handleEmailSubmit, which uses validateChatEmail directly) and no
// other step validates as "email", so it was unreachable dead code.
const validators = { name: validateName, phone: validatePhone };

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing etc.) — degrade silently,
    // chat still works, it just won't survive a refresh.
  }
}

function resolveNext(step, value, ctx) {
  return typeof step.next === "function" ? step.next(value, ctx) : step.next;
}

// Distinguishes "this is an attempt to answer the question" from "this is
// actually a different message the visitor wants to send" — e.g. typing
// "I want to know more about your new phase" while Ria is waiting for a
// phone number should NOT be treated as a malformed phone number.
function looksLikeAttemptedAnswer(validateKind, value) {
  if (validateKind === "phone") return (value.match(/\d/g) || []).length >= 5;
  if (validateKind === "email") return value.includes("@");
  return true; // name step — anything typed counts as an attempt
}

function appendNote(existingNote, text) {
  return existingNote ? `${existingNote}\n${text}` : text;
}

/**
 * Walks chatFlow.js. Submits exactly once, at the terminal "confirm" step,
 * through the same useLeadSubmit hook the homepage form uses (source:
 * "chatbot") — see ARCHITECTURE.md §3.3 for why that's the design.
 *
 * Handles two kinds of "off-script" input, at any step:
 *  1. FAQ questions (RERA, amenities, pricing, etc.) — answered immediately,
 *     current step re-asked afterward, using each step's `resumeMessage`
 *     (not `message`) so it doesn't read as the bot repeating itself.
 *  2. Anything else the visitor wants to say that isn't a FAQ match and
 *     isn't a valid answer to the current question — captured into
 *     ctx.customNote so it rides along into the final lead submission's
 *     `message` field, instead of being silently dropped.
 */
export function useChatEngine() {
  const { submit } = useLeadSubmit();
  const [messages, setMessages] = useState([]);
  const [stepId, setStepId] = useState(START_STEP);
  const [ctx, setCtx] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [calendarLink, setCalendarLink] = useState(null);
  const hasGreeted = useRef(false);

  useEffect(() => {
    const saved = loadSession();
    if (saved && saved.messages?.length) {
      setMessages(saved.messages);
      setStepId(saved.stepId);
      setCtx(saved.ctx || {});
      setIsComplete(saved.isComplete || false);
      hasGreeted.current = true;
    }
  }, []);

  useEffect(() => {
    saveSession({ messages, stepId, ctx, isComplete });
  }, [messages, stepId, ctx, isComplete]);

  // Best-effort lead-loss protection: a visitor who verifies their email
  // (a real, confirmed identity) but closes the tab before ever finishing a
  // topic + phone number would otherwise vanish completely — /submit is
  // only ever reached at the end of a full flow. Registered once (reading
  // current ctx/messages from refs at fire-time, not from a closure that
  // would need re-binding on every keystroke) and fires on the two events
  // that actually catch a real departure: `pagehide` (reliable on tab
  // close/navigation) and the page going `hidden` (covers mobile
  // backgrounding, which doesn't always fire pagehide). A snapshot guard
  // avoids sending a duplicate beacon if the visitor just glances at
  // another tab and comes straight back with nothing new having happened.
  const ctxRef = useRef(ctx);
  const messagesRef = useRef(messages);
  const lastBeaconSnapshotRef = useRef(null);
  useEffect(() => {
    ctxRef.current = ctx;
  }, [ctx]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    const tryBeacon = () => {
      const currentCtx = ctxRef.current;
      if (!currentCtx.emailVerified || currentCtx.leadSubmitted) return;
      const snapshot = `${currentCtx.name}|${currentCtx.email}|${currentCtx.phone}|${messagesRef.current.length}`;
      if (snapshot === lastBeaconSnapshotRef.current) return;
      lastBeaconSnapshotRef.current = snapshot;
      sendPartialLeadBeacon({
        name: currentCtx.name,
        email: currentCtx.email,
        phone: currentCtx.phone || null,
        message: buildConversationSummary(messagesRef.current),
      });
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") tryBeacon();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", tryBeacon);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", tryBeacon);
    };
  }, []);

  const pushBotMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { role: "bot", text, ts: Date.now() }]);
  }, []);

  const pushUserMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { role: "user", text, ts: Date.now() }]);
  }, []);

  const askStep = useCallback(
    (id, contextForMessage, resume = false) => {
      const step = chatFlow[id];
      if (!step) return;
      const text = (resume && step.resumeMessage ? step.resumeMessage : step.message)(contextForMessage) || "";
      setIsTyping(true);
      const delay = Math.min(400 + text.length * 8, 1400);
      setTimeout(() => {
        setIsTyping(false);
        pushBotMessage(text);
      }, delay);
    },
    [pushBotMessage]
  );

  useEffect(() => {
    if (!hasGreeted.current) {
      hasGreeted.current = true;
      askStep(START_STEP, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sayThenAsk = useCallback(
    (text, id, contextForMessage, resume = true) => {
      setIsTyping(true);
      const delay = Math.min(500 + text.length * 4, 2000);
      setTimeout(() => {
        setIsTyping(false);
        pushBotMessage(text);
        askStep(id, contextForMessage, resume);
      }, delay);
    },
    [pushBotMessage, askStep]
  );

  // Answers one or more FAQ topics at once (RERA, amenities, floor plans,
  // pricing, location, site visit, brochure, contact, builder, leadership)
  // without consuming the current step — but only once email verification
  // is done. Every answer is gated behind it now, not just pricing/
  // brochure, so a typed question asked before verifying gets a nudge back
  // toward finishing that instead of a real answer. Takes an array so a
  // real compound question ("price and floors") gets both answers, not
  // just whichever topic matched first.
  // The actual "show the answer, then maybe ask for a phone number" logic —
  // pulled out of respondWithFaq so handleOtpSubmit below can reuse it to
  // answer a question that was asked *before* verification finished (see
  // that function's comment for why this needed splitting out).
  // `currentStepId` defaults to the hook's own `stepId` (correct for the
  // normal respondWithFaq call site below, called synchronously with no
  // step transition in flight) but can be passed explicitly — required by
  // handleOtpSubmit's call, which calls this in the same tick as its own
  // `setStepId("ask_intent")`, before that state update has actually
  // landed. Without an explicit override there, this would still see the
  // *previous* render's stepId ("verify_otp") and re-show that step's
  // resumeMessage instead of ask_intent's — a real staleness bug caught
  // before ever shipping it, not discovered after.
  const deliverFaqAnswer = useCallback(
    (topics, currentCtx, rawText = "", prefixText = "", currentStepId = stepId) => {
      topics.forEach((topic) => {
        if (DOWNLOAD_TRIGGERS[topic.id]) triggerFileDownload(topic.id);
      });
      // rawText lets a topic's response() adapt its opening line to how the
      // question was actually phrased (e.g. verify's yes/no-vs-direct-request
      // framing) — undefined/"" for a button click, which reads fine as the
      // neutral default since a click isn't phrased as a question at all.
      const combinedText =
        (prefixText ? `${prefixText}\n\n` : "") + topics.map((topic) => topic.response(rawText)).join("\n\n");

      // A real property question is a real interest signal — ask for a
      // phone number right after answering it, the same way picking an
      // intent button already does, instead of only ever capturing contact
      // info through a button click. Skipped when every matched topic is a
      // trust/meta one (see each topic's `skipPhonePrompt` in chatFlow.js)
      // and once phone is already known, when there's nothing left to ask.
      const shouldAskPhone = !currentCtx.phone && topics.some((topic) => !topic.skipPhonePrompt);
      if (shouldAskPhone) {
        const nextCtx = {
          ...currentCtx,
          interest: currentCtx.interest || "General Enquiry",
          customNote: rawText ? appendNote(currentCtx.customNote, rawText) : currentCtx.customNote,
        };
        setCtx(nextCtx);
        setStepId("contact_phone");
        sayThenAsk(combinedText, "contact_phone", nextCtx, currentStepId === "contact_phone");
        return;
      }

      sayThenAsk(combinedText, currentStepId, currentCtx);
    },
    [sayThenAsk, stepId]
  );

  const respondWithFaq = useCallback(
    (topics, currentCtx, rawText = "") => {
      if (!currentCtx.emailVerified) {
        // Remembered, not dropped — a real transcript showed a visitor's
        // very first message being a genuine question ("what is this
        // project about"), answered with nothing but "let's get you
        // verified first" and never actually addressed once they were.
        // handleOtpSubmit answers this for real the moment verification
        // succeeds, instead of silently moving straight to "what brings
        // you here today?" as if the question was never asked.
        const nextCtx = {
          ...currentCtx,
          pendingQuestions: rawText ? [...(currentCtx.pendingQuestions || []), rawText] : currentCtx.pendingQuestions,
        };
        setCtx(nextCtx);
        sayThenAsk(NEED_VERIFICATION_MESSAGE, stepId, nextCtx);
        return;
      }
      deliverFaqAnswer(topics, currentCtx, rawText);
    },
    [sayThenAsk, stepId, deliverFaqAnswer]
  );

  const finishConversation = useCallback(
    async (finalCtx) => {
      const notes = [];
      if (finalCtx.visitSlot) notes.push(`Preferred site visit slot: ${finalCtx.visitSlot}`);
      if (finalCtx.customNote) notes.push(`Visitor's message: ${finalCtx.customNote}`);
      // Full readable transcript, not just a category label — gives the
      // sales team real context on what was actually asked and answered,
      // not just "Pricing Information."
      const transcript = buildConversationSummary(messages);
      if (transcript) notes.push(`Full conversation:\n${transcript}`);

      // Built here (not at slot-selection time) because only now do we have
      // the visitor's name/phone — the calendar event should carry both,
      // for the visitor's own reminder AND for the sales team's copy of
      // the same link embedded in their notification email (see
      // BACKEND/routes/shadesofgreenFormRoutes.js).
      let link = null;
      if (finalCtx.visitDateTimeISO) {
        link = buildGoogleCalendarUrl({
          title: `Shades of Green — Site Visit (${finalCtx.name})`,
          start: new Date(finalCtx.visitDateTimeISO),
          durationMinutes: 60,
          details: `Site visit for ${finalCtx.name}\nPhone: ${finalCtx.phone}\nEmail: ${finalCtx.email}`,
          location: VISIT_LOCATION,
        });
        setCalendarLink(link);
      }

      // Confirms this specific submission, then folds straight back into
      // "anything else?" — reads as one continuous conversation instead of
      // a hard "conversation complete, pick an action" stop after every
      // single topic, which is exactly what felt broken/repetitive about
      // needing an extra "Ask Something Else" click before. The visitor's
      // name/email/phone all carry forward in ctx, so nothing already
      // known gets asked for again on the next topic.
      // `leadSubmitted: true` is what chatFlow.js's ask_intent.next() checks
      // to route every *subsequent* topic back to itself instead of through
      // here again — without it, a second topic would re-submit a duplicate
      // lead row and repeat "your enquiry has been submitted" a second time
      // (a real bug, found via a live transcript showing exactly that).
      const submittedCtx = { ...finalCtx, leadSubmitted: true };
      setCtx(submittedCtx);
      const confirmText = chatFlow.confirm.message(finalCtx) || "";
      setStepId("ask_intent");
      sayThenAsk(confirmText, "ask_intent", submittedCtx, true);

      await submit({
        name: finalCtx.name,
        email: finalCtx.email,
        phone: finalCtx.phone,
        interest: finalCtx.interest,
        message: notes.length ? notes.join("\n") : "Enquiry submitted through the website chat assistant.",
        source: "chatbot",
        calendarLink: link || undefined,
      });
    },
    [submit, sayThenAsk, messages]
  );

  const advance = useCallback(
    (value, extraCtx, infoText) => {
      const step = chatFlow[stepId];
      if (!step || step.terminal) return;

      const nextCtx = { ...ctx, ...extraCtx, [step.field]: value };
      setCtx(nextCtx);
      const nextId = resolveNext(step, value, nextCtx);
      setStepId(nextId);

      const isTerminal = chatFlow[nextId].terminal;

      if (isTerminal && infoText) {
        // Phone was already known (see ask_intent's next()), so this jumps
        // straight to terminal — but the visitor still picked something
        // and deserves the actual answer, not just a submission receipt.
        setIsTyping(true);
        const delay = Math.min(500 + infoText.length * 4, 2000);
        setTimeout(() => {
          setIsTyping(false);
          pushBotMessage(infoText);
          finishConversation(nextCtx);
        }, delay);
      } else if (isTerminal) {
        finishConversation(nextCtx);
      } else if (infoText) {
        // Deliver the real answer for what they picked immediately — email
        // verification (already done by the time ask_intent is reachable)
        // is the gate now, so there's no reason to withhold this any
        // longer than that. `resume` is true when nextId loops back to the
        // very step we're already on (e.g. a second topic after the lead's
        // already submitted — see ask_intent.next()'s leadSubmitted branch)
        // so it shows the resumeMessage ("Anything else...") instead of
        // repeating the first-time greeting verbatim.
        sayThenAsk(infoText, nextId, nextCtx, nextId === stepId);
      } else {
        askStep(nextId, nextCtx, nextId === stepId);
      }
    },
    [stepId, ctx, askStep, finishConversation, sayThenAsk, pushBotMessage]
  );

  // ask_email and verify_otp both need a real backend round-trip before
  // deciding whether to advance at all — neither fits the generic
  // synchronous validate-then-advance path the other steps use below, so
  // they're handled here instead and intercepted early in submitFreeText.
  const handleEmailSubmit = useCallback(
    async (value) => {
      const error = validateChatEmail(value);
      if (error) {
        setInputError(error);
        return;
      }
      setInputError(null);
      pushUserMessage(value);
      setIsTyping(true);
      const { data } = await sendOtp(value);
      setIsTyping(false);
      if (data.success) {
        const nextCtx = { ...ctx, email: value };
        setCtx(nextCtx);
        setStepId("verify_otp");
        askStep("verify_otp", nextCtx);
      } else {
        pushBotMessage(data.message || "I couldn't send a code — please check your email and try again.");
      }
    },
    [ctx, pushUserMessage, pushBotMessage, askStep]
  );

  const handleOtpSubmit = useCallback(
    async (value) => {
      const error = validateOtp(value);
      if (error) {
        setInputError(error);
        return;
      }
      setInputError(null);
      pushUserMessage(value);
      setIsTyping(true);
      const { data } = await verifyOtp(ctx.email, value);
      setIsTyping(false);
      if (data.success) {
        const nextCtx = { ...ctx, emailVerified: true, pendingQuestions: [] };
        setStepId("ask_intent");

        // Answer whatever they actually asked before verifying, instead of
        // jumping straight to the generic "what brings you here today?" as
        // if that question never happened. Re-matches each pending question
        // fresh (topics aren't stored directly — only the raw text is, so
        // this always reflects the current FAQ content) and dedupes by
        // topic id in case two different pending questions hit the same
        // topic, capped at 3 like every other compound answer in this app.
        const pending = ctx.pendingQuestions || [];
        if (pending.length) {
          const topicsById = new Map();
          pending.forEach((q) => matchFaqTopics(q).forEach((t) => topicsById.set(t.id, t)));
          const topics = [...topicsById.values()].slice(0, 3);
          if (topics.length) {
            setCtx(nextCtx);
            // "ask_intent" passed explicitly, not left to default to the
            // hook's own stepId — see deliverFaqAnswer's comment on why.
            deliverFaqAnswer(topics, nextCtx, pending[pending.length - 1], "You're verified! ✅", "ask_intent");
            return;
          }
        }

        setCtx(nextCtx);
        askStep("ask_intent", nextCtx);
      } else {
        pushBotMessage(data.message || "That code doesn't match — please try again.");
      }
    },
    [ctx, pushUserMessage, pushBotMessage, askStep, deliverFaqAnswer]
  );

  const handleResendOtp = useCallback(async () => {
    if (isComplete || stepId !== "verify_otp" || !ctx.email) return;
    pushUserMessage("Resend Code");
    setIsTyping(true);
    const { data } = await sendOtp(ctx.email);
    setIsTyping(false);
    pushBotMessage(data.success ? `I've sent a new code to ${ctx.email}.` : data.message || "Couldn't resend a code right now.");
  }, [isComplete, stepId, ctx.email, pushUserMessage, pushBotMessage]);

  const submitFreeText = useCallback(
    (rawValue) => {
      const value = (rawValue || "").trim();
      if (!value || isComplete) return;

      const step = chatFlow[stepId];
      if (!step) return;

      if (stepId === "ask_email") {
        handleEmailSubmit(value);
        return;
      }
      if (stepId === "verify_otp") {
        handleOtpSubmit(value);
        return;
      }

      // Checked BEFORE the general FAQ match, and only at the "what brings
      // you here" step — "I want to buy a villa" or "please call me" needs
      // to register as purchase/escalation intent, not get swallowed by an
      // FAQ topic that happens to share a word ("villa", in that example).
      // A real bug this exact ordering caused: matchFaqTopic ran first,
      // matched "villa" via the fuzzy keyword list, and purchase intent
      // never got a chance to fire at all.
      if (step.options && stepId === "ask_intent" && PURCHASE_INTENT_PATTERN.test(value)) {
        pushUserMessage(value);
        setInputError(null);
        const interest = "Ready to Purchase / Talk to Sales";
        const nextCtx = { ...ctx, customNote: appendNote(ctx.customNote, value), interest };
        setCtx(nextCtx);
        const nextId = resolveNext(step, interest, nextCtx);
        setStepId(nextId);
        sayThenAsk("Wonderful! I'll get our sales team connected with you right away.", nextId, nextCtx);
        return;
      }

      const matchedTopics = matchFaqTopics(value);
      if (matchedTopics.length) {
        pushUserMessage(value);
        setInputError(null);
        respondWithFaq(matchedTopics, ctx, value);
        return;
      }

      if (step.options) {
        // Open-ended message at the "what brings you here" step — e.g.
        // "I want to know more about your new project." Capture it as a
        // General Enquiry with their words preserved, and move the
        // conversation forward instead of dead-ending on a nudge.
        pushUserMessage(value);
        setInputError(null);
        const nextCtx = { ...ctx, customNote: appendNote(ctx.customNote, value), interest: "General Enquiry" };
        setCtx(nextCtx);
        const nextId = resolveNext(step, "General Enquiry", nextCtx);
        setStepId(nextId);
        // Doesn't claim the bot itself answered — it didn't, nothing matched
        // — but is explicit that a person will look at the actual question,
        // not just a generic "noted" that reads as the bot tuning it out.
        sayThenAsk(
          "That's a specific one — I've passed your exact question to our team so they can address it directly.",
          nextId,
          nextCtx,
          nextId === stepId
        );
        return;
      }

      if (step.validate && !looksLikeAttemptedAnswer(step.validate, value)) {
        // Doesn't look like an attempt to answer this question at all —
        // treat it as something else they want to say, keep it, and ask
        // the same question again (with its resumeMessage) rather than
        // showing a validation error that implies we ignored them.
        pushUserMessage(value);
        setInputError(null);
        const nextCtx = { ...ctx, customNote: appendNote(ctx.customNote, value) };
        setCtx(nextCtx);
        sayThenAsk("Noted, I've passed that along to our team.", stepId, nextCtx);
        return;
      }

      if (step.validate) {
        const error = validators[step.validate](value);
        if (error) {
          setInputError(error);
          return;
        }
      }
      setInputError(null);
      pushUserMessage(value);
      advance(value);
    },
    [stepId, isComplete, ctx, pushUserMessage, advance, respondWithFaq, sayThenAsk, handleEmailSubmit, handleOtpSubmit]
  );

  const selectOption = useCallback(
    (option) => {
      if (isComplete) return;

      if (option.isResend) {
        handleResendOtp();
        return;
      }

      pushUserMessage(option.label);
      if (option.isInfo) {
        const topic = FAQ_TOPICS.find((t) => t.id === option.faqId);
        if (topic) respondWithFaq([topic], ctx);
        return;
      }

      // Email verification already happened before ask_intent is ever
      // reachable, so the brochure (like every other intent's info) is
      // given right away — no more gating on phone/email being collected.
      if (option.triggersDownload) triggerFileDownload(option.triggersDownload);

      // A calendar link from an earlier Site Visit round shouldn't still
      // be showing once the conversation has moved on to a different topic.
      if (stepId === "ask_intent") setCalendarLink(null);

      const infoTopic = option.infoTopic && FAQ_TOPICS.find((t) => t.id === option.infoTopic);
      advance(option.value, undefined, infoTopic ? infoTopic.response() : undefined);
    },
    [isComplete, ctx, stepId, pushUserMessage, advance, respondWithFaq, handleResendOtp]
  );

  const selectDateTime = useCallback(
    (date) => {
      if (isComplete) return;
      const label = date.toLocaleString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      });
      pushUserMessage(label);
      advance(label, { visitDateTimeISO: date.toISOString() });
    },
    [isComplete, pushUserMessage, advance]
  );

  const restart = useCallback(() => {
    hasGreeted.current = false;
    setMessages([]);
    setStepId(START_STEP);
    setCtx({});
    setIsComplete(false);
    setInputError(null);
    setCalendarLink(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    hasGreeted.current = true;
    askStep(START_STEP, {});
  }, [askStep]);

  const currentStep = chatFlow[stepId];
  const currentOptions = !isComplete && currentStep && currentStep.options ? currentStep.options : [];
  const currentStepType = !isComplete && currentStep ? currentStep.type : null;
  // Input stays available at every step (not just free-text ones) so a
  // visitor can always ask a question or say something, even mid-quick-reply.
  const awaitingFreeText = !isComplete;

  return {
    messages,
    isTyping,
    isComplete,
    inputError,
    currentOptions,
    currentStepType,
    awaitingFreeText,
    calendarLink,
    userName: ctx.name,
    submitFreeText,
    selectOption,
    selectDateTime,
    restart,
  };
}
