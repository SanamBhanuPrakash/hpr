import { useState } from "react";
import { postJSON } from "../lib/api";
import { trackLead } from "../lib/tracking";

/**
 * The one place that submits to POST /api/shadesofgreen-form/submit.
 * Used by both the homepage form and the chatbot, so there's exactly one
 * code path to trust for tracking and error handling.
 *
 * `source` distinguishes where a lead came from WITHOUT any database schema
 * change — Shadesofgreen_enquiries only has (name, email, phone, interest,
 * message), so the distinction is encoded redundantly in two fields the
 * client's existing email template already renders:
 *   - interest: "<real category> (via Chatbot)" — stays filterable/readable
 *   - message:  prefixed with "Submitted via: AI Chatbot" on its own line
 * A form submission (source: "form") leaves both fields exactly as before.
 */
export function useLeadSubmit() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async ({ name, email, phone, interest, message, source = "form", calendarLink }) => {
    setStatus("sending");

    const finalInterest = source === "chatbot" ? `${interest} (via Chatbot)` : interest;
    const finalMessage =
      source === "chatbot"
        ? `Submitted via: AI Chatbot\n\n${message || ""}`.trim()
        : message;

    // `calendarLink` is optional and only ever set for a chatbot site-visit
    // booking — the backend embeds it in the sales notification email as a
    // one-click "add to your calendar" link, pre-filled with the visitor's
    // name/phone/slot, when present. Silently ignored by the backend
    // otherwise (see BACKEND/routes/shadesofgreenFormRoutes.js).
    const { ok, data } = await postJSON("/api/shadesofgreen-form/submit", {
      name,
      email,
      phone,
      interest: finalInterest,
      message: finalMessage,
      calendarLink,
    });

    if (ok && data.success) {
      trackLead();
      setStatus("success");
      return true;
    }

    setErrorMessage(data.message || "Failed to submit inquiry");
    setStatus("error");
    return false;
  };

  return { submit, status, errorMessage };
}
