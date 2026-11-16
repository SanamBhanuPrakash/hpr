import express from "express";
import db from "../db.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Mail config error:", error);
  } else {
    console.log("Mail server is ready to send notifications");
  }
});

// Set only in the isolated staging backend's own .env — never in
// production's. Every sales-facing notification subject gets a clear
// "[STAGING TEST]" prefix, so a CEO/reviewer clicking through the chatbot
// on staging can never be mistaken by the sales team for a real lead. The
// OTP verification email is deliberately NOT prefixed — it goes to
// whoever's actually testing, not to sales, and needs to read like a
// normal verification code either way.
const IS_STAGING = process.env.IS_STAGING === "true";
function stagingSubject(subject) {
  return IS_STAGING ? `[STAGING TEST] ${subject}` : subject;
}

// ==========================================
// Chatbot email verification (OTP)
// ==========================================
// In-memory on purpose — an OTP is only ever meaningful for a few minutes,
// so there's no real loss if a backend restart clears this, and it avoids
// needing a new database table for something this short-lived. Not safe
// across multiple server processes/instances, which this deployment
// doesn't run.
const otpStore = new Map(); // email -> { code, expiresAt, attempts, lastSentAt }

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes to enter the code
const RESEND_COOLDOWN_MS = 45 * 1000; // 45s between sends to the same email
const MAX_SENDS_PER_HOUR_PER_IP = 10; // guards against the endpoint being
// used to email-bomb arbitrary third-party addresses using this mailbox —
// a materially different risk from a spammy lead-form submission, since
// abuse here risks Google flagging/suspending the sending account itself,
// which would also take down real lead notification emails.
const MAX_VERIFY_ATTEMPTS = 5;

const ipSendLog = new Map(); // ip -> array of send timestamps (last hour)

function isIpOverLimit(ip) {
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;
  const recent = (ipSendLog.get(ip) || []).filter((t) => t > cutoff);
  ipSendLog.set(ip, recent);
  return recent.length >= MAX_SENDS_PER_HOUR_PER_IP;
}

function recordIpSend(ip) {
  const recent = ipSendLog.get(ip) || [];
  recent.push(Date.now());
  ipSendLog.set(ip, recent);
}

// Both Maps only ever get cleaned up reactively, when that exact same
// email/IP happens to come back — a visitor who requests a code and never
// verifies, or an IP that never sends again, leaves a permanent entry
// behind otherwise. Harmless for a quick local test run, but this is a
// long-running PM2 process in production serving many visitors over weeks —
// left unswept, both Maps grow forever. A periodic sweep instead of an
// on-every-request check keeps the hot path (send/verify) free of any
// extra work. `.unref()` so this timer alone never keeps the process alive.
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of otpStore) {
    if (now > entry.expiresAt) otpStore.delete(email);
  }
  const cutoff = now - 60 * 60 * 1000;
  for (const [ip, timestamps] of ipSendLog) {
    const recent = timestamps.filter((t) => t > cutoff);
    if (recent.length) ipSendLog.set(ip, recent);
    else ipSendLog.delete(ip);
  }
}, 15 * 60 * 1000).unref();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Every notification email below interpolates visitor-supplied fields
// (name, message, etc.) directly into HTML sent to the sales team's real
// inbox — without escaping, a crafted name or message could inject markup
// or links into that email. Found during a code review, not from a report;
// fixed here rather than left as a latent risk.
function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );
}

// Same list as FRONTEND/src/lib/validators.js — duplicated rather than
// shared across the frontend/backend package boundary, kept in sync by
// hand. Server-side check exists so this can't be bypassed by calling the
// API directly instead of going through the chatbot UI. An allowlist of
// major personal webmail providers, not a disposable-domain blocklist — a
// deliberate business decision: this also excludes legitimate company/
// corporate emails on purpose, since those are harder to verify a real
// person behind for a real-estate lead.
const ALLOWED_EMAIL_DOMAINS = new Set([
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

// POST /api/shadesofgreen-form/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain || !ALLOWED_EMAIL_DOMAINS.has(domain)) {
      return res.status(400).json({
        success: false,
        message: "Please use a personal email address (Gmail, Yahoo, Outlook, iCloud, etc.) — company or temporary emails aren't accepted here.",
      });
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
    if (isIpOverLimit(ip)) {
      return res.status(429).json({
        success: false,
        message: "Too many verification requests right now — please try again later.",
      });
    }

    const existing = otpStore.get(email);
    if (existing && Date.now() - existing.lastSentAt < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec}s before requesting another code.`,
      });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(email, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0, lastSentAt: Date.now() });
    recordIpSend(ip);
    console.log(`[OTP] ${email} -> ${code}`); // server console only — never returned to the client

    await transporter.sendMail({
      from: `"Shades of Green" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Shades of Green verification code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1A4744;">Your verification code</h2>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1A4744;">${code}</p>
          <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ success: false, message: "Couldn't send a code right now. Please try again." });
  }
});

// POST /api/shadesofgreen-form/verify-otp
router.post("/verify-otp", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Email and code are required." });
    }

    const entry = otpStore.get(email);
    if (!entry) {
      return res.status(400).json({ success: false, message: "Please request a new code." });
    }
    if (Date.now() > entry.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: "That code expired — please request a new one." });
    }
    if (entry.attempts >= MAX_VERIFY_ATTEMPTS) {
      otpStore.delete(email);
      return res.status(429).json({ success: false, message: "Too many attempts — please request a new code." });
    }

    if (String(code).trim() !== entry.code) {
      entry.attempts += 1;
      return res.status(400).json({ success: false, message: "That code doesn't match — please try again." });
    }

    otpStore.delete(email);
    return res.status(200).json({ success: true, message: "Verified." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

// ==========================================
// ROUTE 1: Quick Leads (Brochure / Call Us)
// POST /api/shadesofgreen-form/inquiry
// ==========================================
router.post("/inquiry", async (req, res) => {
  try {
    const { email, phone, requestType } = req.body;

    // Validate that both fields are present
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Both email and mobile number are required.",
      });
    }

    // Insert lead into MySQL database
    const sql = `
      INSERT INTO shadesofgreen_leads (email, phone, request_type)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [email, phone, requestType || "general"]);

    // The lead is safely in the database at this point — that's the part
    // that must never be lost. Respond to the visitor immediately instead
    // of making them wait out a full SMTP handshake (Gmail can take several
    // seconds, occasionally 15-20+) before their download/confirmation
    // shows. The email is sent right after, not awaited; a transient mail
    // failure is logged server-side but no longer blocks or fails a
    // submission that already succeeded.
    res.status(200).json({
      success: true,
      message: "Lead saved and notification sent successfully",
    });

    const isBrochure = requestType === "brochure_download";
    const subject = stagingSubject(isBrochure ? "New Brochure Download Lead" : "New Call Request Lead");

    transporter
      .sendMail({
        from: `"Shades of Green Leads" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        replyTo: email,
        subject: subject,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1A4744;">New Lead Captured</h2>
          <p><b>Request Type:</b> ${isBrochure ? "Brochure Download" : "Request a Call"}</p>
          <p><b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><b>Mobile Number:</b> <a href="tel:+91${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
          <p><b>Date:</b> ${new Date().toLocaleString()}</p>
        </div>
      `,
      })
      .catch((error) => console.error("Inquiry notification email failed:", error));
  } catch (error) {
    console.error("Lead Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});

// ==========================================
// ROUTE 2: Full Contact / Popup Form
// POST /api/shadesofgreen-form/submit
// ==========================================
router.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, interest, message, calendarLink } = req.body;

    if (!name || !email || !interest) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Interest are required",
      });
    }

    // Repeat-visitor signal for the sales team: count this email's past
    // submissions, collapsing anything within 30 minutes of the previous one
    // into the same "visit." A visitor who hits the chatbot's Restart button
    // and goes through the flow again moments later is still the same
    // sitting, not renewed interest, so it shouldn't inflate the count — but
    // a submission that comes noticeably later (even later the same day, or
    // a different day) genuinely does signal a returning, more-interested
    // lead. No schema change: computed on the fly from existing timestamps
    // rather than a new counter column. Failure here is non-fatal — the
    // actual submission below must never be blocked by this.
    //
    // The gap is computed with MySQL's own TIMESTAMPDIFF/NOW(), not by
    // re-parsing `created_at` as a JS Date — the app server and DB server
    // can run in different timezones (found the hard way locally: the
    // Docker MySQL container stores UTC, Node's `new Date()` on this
    // Windows box is IST, and re-parsing the raw value as local time turned
    // a same-second resubmit into an apparent 5.5-hour gap). Keeping all the
    // arithmetic inside MySQL, against MySQL's own clock, sidesteps that
    // entirely regardless of what timezone either machine is in.
    const VISIT_GAP_MIN = 30;
    let visitNumber = 1;
    try {
      const [priorRows] = await db.query(
        "SELECT TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS minutes_ago " +
          "FROM Shadesofgreen_enquiries WHERE email = ? ORDER BY created_at ASC",
        [email]
      );
      if (priorRows.length) {
        let visits = 1;
        let lastMinutesAgo = priorRows[0].minutes_ago;
        for (let i = 1; i < priorRows.length; i++) {
          const minutesAgo = priorRows[i].minutes_ago;
          if (lastMinutesAgo - minutesAgo > VISIT_GAP_MIN) visits++;
          lastMinutesAgo = minutesAgo;
        }
        if (lastMinutesAgo > VISIT_GAP_MIN) visits++;
        visitNumber = visits;
      }
    } catch (lookupError) {
      console.error("Visit-count lookup failed (non-fatal):", lookupError);
    }

    const sql = `
      INSERT INTO Shadesofgreen_enquiries
      (name, email, phone, interest, message)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      name,
      email,
      phone || null,
      interest,
      message || null,
    ]);

    // Optional, sent only for a chatbot site-visit booking. Validated
    // against Google's own domain before ever being embedded as a link in
    // an email — this field comes from the client, so a tampered request
    // could otherwise smuggle an arbitrary (e.g. phishing) URL into a mail
    // sent to the sales team.
    const isSafeCalendarLink =
      typeof calendarLink === "string" &&
      calendarLink.startsWith("https://calendar.google.com/calendar/render?");
    const calendarLinkHtml = isSafeCalendarLink
      ? `<p><a href="${calendarLink}" style="color:#1A4744;font-weight:bold;">📅 Add this site visit to your Google Calendar</a></p>`
      : "";

    const returningVisitorHtml =
      visitNumber > 1
        ? `<p style="background:#fff3cd;border-left:4px solid #d4a017;padding:8px 12px;margin:0 0 12px;">` +
          `<b>🔁 Returning visitor — this is enquiry #${visitNumber} from this email.</b></p>`
        : "";

    // Escaped for HTML safety (see escapeHtml's comment above), and the
    // message's newlines converted to real <br> breaks after escaping —
    // plain "\n" is invisible in rendered HTML, so a multi-line summary/
    // transcript (see chatFlow.js's buildConversationSummary, threaded in
    // from the chatbot) would otherwise show as one unreadable run-on line.
    const safeMessageHtml = message
      ? escapeHtml(message).replace(/\n/g, "<br>")
      : "No message";

    // Same reasoning as the /inquiry route above: the lead is already
    // durably saved by this point, so the visitor gets their response (and
    // the GTM fetch-watcher its "success" signal for lead tracking)
    // immediately, without waiting on Gmail's SMTP round-trip.
    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      visitNumber,
    });

    transporter
      .sendMail({
        from: `"Shades of Green Website" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        replyTo: email,
        subject: stagingSubject(
          visitNumber > 1 ? `New Shades of Green Inquiry (Returning Visitor #${visitNumber})` : "New Shades of Green Inquiry"
        ),
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 560px;">
          <h2 style="color: #1A4744; border-bottom: 2px solid #1A4744; padding-bottom: 8px;">New Inquiry Received</h2>
          ${returningVisitorHtml}
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> <a href="mailto:${escapeHtml(email)}" style="color:#1A4744;">${escapeHtml(email)}</a></p>
          <p><b>Phone:</b> ${
            phone
              ? `<a href="tel:+91${escapeHtml(phone)}" style="color:#1A4744;">+91 ${escapeHtml(phone)}</a>`
              : "Not provided"
          }</p>
          <p><b>Interest:</b> ${escapeHtml(interest)}</p>
          <p><b>Date:</b> ${new Date().toLocaleString()}</p>
          <div style="margin-top: 12px; padding: 12px; background: #f5f7f6; border-radius: 6px;">
            <b>Message / Conversation Summary:</b><br>
            <div style="margin-top: 6px; white-space: normal;">${safeMessageHtml}</div>
          </div>
          ${calendarLinkHtml}
        </div>
      `,
      })
      .catch((error) => console.error("Submit notification email failed:", error));
  } catch (error) {
    console.error("Full Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});

// ==========================================
// ROUTE 3: Partial lead (tab-close/beacon safety net)
// POST /api/shadesofgreen-form/partial-lead
// ==========================================
// Fired via navigator.sendBeacon (see FRONTEND/src/lib/partialLead.js) when
// a visitor who already verified their email closes the tab before ever
// completing a topic + phone number and reaching the real /submit above —
// without this, a real, identity-confirmed visitor's interest would be
// lost entirely, since /submit is never reached in that case. A beacon
// request can't wait for a meaningful response, so this responds
// immediately and does the actual work after.
//
// Body arrives as `text/plain`, not `application/json` — sendBeacon can't
// perform a CORS preflight (it's fire-and-forget by spec), and
// "application/json" isn't a CORS-safelisted content type, so a JSON
// Content-Type here gets silently dropped by the browser for a
// cross-origin request with zero visible error (found exactly this way
// locally: frontend/backend on different ports in dev). `express.text()`
// is scoped to just this one route rather than applied globally, so it
// doesn't change how every other route on this router parses its body.
router.post("/partial-lead", express.text({ type: "text/plain" }), async (req, res) => {
  res.status(204).end();
  try {
    let payload;
    try {
      payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      return; // malformed body — nothing usable to save
    }
    const { name, email, phone, message } = payload || {};
    // Same acceptance bar as everywhere else — a bare name with no valid,
    // allowlisted email isn't a usable lead, just noise.
    if (!name || !email || !EMAIL_REGEX.test(email)) return;
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain || !ALLOWED_EMAIL_DOMAINS.has(domain)) return;

    await db.query(
      `INSERT INTO Shadesofgreen_enquiries (name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone || null,
        "Abandoned Chat (Partial Lead)",
        message || "Visitor verified their email but left before completing the chat.",
      ]
    );

    const safeMessageHtml = message ? escapeHtml(message).replace(/\n/g, "<br>") : "No further detail captured.";

    transporter
      .sendMail({
        from: `"Shades of Green Website" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        replyTo: email,
        subject: stagingSubject("Partial Lead — Visitor Left Chat Early"),
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 560px;">
          <h2 style="color: #1A4744; border-bottom: 2px solid #1A4744; padding-bottom: 8px;">Partial Lead — Chat Left Incomplete</h2>
          <p style="background:#fdecea;border-left:4px solid #c0392b;padding:8px 12px;">
            <b>⚠️ This visitor verified their email but closed the chat before finishing.</b>
            They may not have given a phone number — worth an email follow-up.
          </p>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> <a href="mailto:${escapeHtml(email)}" style="color:#1A4744;">${escapeHtml(email)}</a></p>
          <p><b>Phone:</b> ${
            phone
              ? `<a href="tel:+91${escapeHtml(phone)}" style="color:#1A4744;">+91 ${escapeHtml(phone)}</a>`
              : "Not provided"
          }</p>
          <p><b>Date:</b> ${new Date().toLocaleString()}</p>
          <div style="margin-top: 12px; padding: 12px; background: #f5f7f6; border-radius: 6px;">
            <b>Conversation so far:</b><br>
            <div style="margin-top: 6px;">${safeMessageHtml}</div>
          </div>
        </div>
      `,
      })
      .catch((error) => console.error("Partial-lead notification email failed:", error));
  } catch (error) {
    console.error("Partial-lead save failed:", error);
  }
});

export default router;