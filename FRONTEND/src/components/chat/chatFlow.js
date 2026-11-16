// The chatbot's conversation graph, as data — not hardcoded branching logic.
// See ARCHITECTURE.md §3.2. Adding a question or intent branch later is a
// data edit here, not a rewrite of useChatEngine.js.
//
// Intent option values deliberately match the EXACT strings used in the
// homepage form's real "I'm interested in..." dropdown (LandingPage.jsx),
// so a chatbot lead's `interest` field stays consistent with the existing
// taxonomy the sales team already reads. "General Enquiry" is the one
// addition, for the catch-all "talk to someone" case the dropdown doesn't
// have.

export const ASSISTANT_NAME = "Ria";

const COMPANY_INFO = {
  rera: "PRM/KA/RERA/1251/446/PR/040826/008858",
  reraApprovalDate: "24 June 2026",
  reraValidity: "31 July 2031",
  headOffice: "101, Silicon Towers, Near Image Gardens, Image Garden Road, Madhapur – 500081",
  marketingOffice:
    "Sy.No.:59/1, 59/2 & 59/3, Kadusoppanahalli Village, Bidarahalli Hobli, Bengaluru East Taluk, Bengaluru District",
  phone: "+91 9187210414",
  email: "Sales@hprinfra.com",
  website: "www.hprinfra.com",
};

// A small FAQ knowledge base, each entry matched by keywords. Checked at
// EVERY step (typed free-text, in any order) without consuming that step's
// answer or restarting the flow — a visitor asking "what amenities do you
// have?" mid-conversation should get a real answer, not be told to pick
// from a list of buttons. Content mirrors what's actually published on the
// homepage (LandingPage.jsx's stats/amenities sections), never invented.
export const FAQ_TOPICS = [
  {
    id: "verify",
    // A trust/due-diligence question, not a buying signal — pushing for a
    // phone number right after "is this legit?" reads as pushy toward
    // someone who hasn't even decided to trust the company yet. See
    // respondWithFaq() in useChatEngine.js for what this flag does.
    skipPhonePrompt: true,
    keywords:
      /\b(rera|address|regd|regist\w*|office|legit|genuine|verify\w*|authentic|real company|trust\w*|reliable|credential|licen[cs]e\w*|scam|fraud|is (it|this) (real|genuine|legit))\b/i,
    // Opener adapts to how the question was phrased — a yes/no question
    // ("is it RERA registered?") gets a direct yes/no answer first; a
    // direct request ("RERA details," "what's the RERA number," or the
    // quick-reply button with no phrasing at all) gets straight to the
    // details without the yes/no framing, which read oddly for a request
    // that was never actually a question. Same rawText plumbing (see
    // useChatEngine.js's respondWithFaq) could extend this pattern to other
    // topics later if worth it.
    response: (rawText = "") => {
      const isYesNo = /^\s*(is|are|do|does|has|have)\b/i.test(rawText);
      const opener = isYesNo ? "Yes, we're fully RERA registered! ✅" : "Here are our verification details:";
      return (
        `${opener}\n\n` +
        `RERA No: ${COMPANY_INFO.rera} (approved ${COMPANY_INFO.reraApprovalDate} by BDA, valid through ${COMPANY_INFO.reraValidity})\n\n` +
        `Registered Office: ${COMPANY_INFO.headOffice}\n\n` +
        `Project Site Office: ${COMPANY_INFO.marketingOffice}\n\n` +
        `Phone: ${COMPANY_INFO.phone}\n\n` +
        `You can independently verify this registration on the official Karnataka RERA (RERAK) website.`
      );
    },
  },
  {
    // A real, common orientation question that had no home before — "what
    // is this even about" / "villas or flats or land" was falling through
    // to the flat "I've noted that for our team" catch-all with no actual
    // answer, found via a real transcript. Deliberately placed early
    // (before the narrower villadetails/floorplans topics) since it's the
    // broadest, most foundational question a first-time visitor asks.
    id: "about",
    // Fourth round of phrasing gaps on this exact topic (rounds 28, 33, 34,
    // now 37) — each fix caught one more exact wording ("...about," no
    // article, no "about" at all) but a real visitor keeps finding the next
    // one ("Give me project details" — "project" *before* "details," not
    // "details about the project," a different word order the phrase-list
    // approach couldn't anticipate). Rather than keep enumerating exact
    // phrases indefinitely, added one order-independent pattern using
    // lookaheads: matches whenever the message contains "project" AND an
    // info-seeking word (details/info/overview/summary) *anywhere*,
    // regardless of which comes first — genuinely open-ended instead of
    // one more entry on a list that will always have a next gap.
    keywords:
      /\b(what is (this |the )?project(\s+about)?\b|what('s| is) (this|it) about|what do (you|hpr ?infra) (sell|build|offer)|what (are|is) (you|this) (selling|building|offering)|what kind of project is this|what type of project is this|is this (a )?(villa|flat|apartment|land|plot|it park)s? project|villas? or (flats?|apartments?|land|plots?|it parks?)|tell me (about|more about) (this|the|it)( project)?|explain (in detail )?(about )?(this |the )?project|(give|share) (me )?(more )?(details|information|info) about (this |the )?project|(more )?detail(ed|s)? (information |info )?about (this |the )?project|what exactly (is|are) (you|this)|(do|will|does) (you|they|hpr ?infra) sell (lands?|flats?|apartments?|villas?))\b|(?=.*\bproject\b)(?=.*\b(details?|info\w*|overview|summary)\b)/i,
    // Explicitly separates the builder (HPR Infra, the company) from the
    // project (Shades of Green, this specific development) — a real,
    // reasonable point of confusion for a first-time visitor who's used to
    // "the builder's name IS the project" naming (which some builders do),
    // rather than the more common pattern this follows: one developer,
    // many separately-named projects (the same relationship as Sobha →
    // "Sobha Dream Acres," Prestige → "Prestige Lakeside Habitat," etc.).
    response: () =>
      `"Shades of Green" is the name of this specific project — a gated community of 83 exclusive ` +
      `4BHK villas, not flats, apartments, plots, or an IT park. It's developed by HPR Infra, a ` +
      `Hyderabad-based real estate and construction company (the builder) — the same relationship ` +
      `as, say, Sobha or Prestige being a builder with several separately-named projects. The ` +
      `villas sit on a 4.25-acre site in North Bengaluru, off Hennur, with a clubhouse and ` +
      `resort-style amenities. Happy to go deeper on villa specs, pricing, or location — just ask.`,
  },
  {
    // Real contact details from the brochure's own header (phone, email,
    // website) — not the RERA/legitimacy answer, which is a different
    // question even though both mention the phone number.
    id: "contact",
    // Asking for OUR number to call us directly isn't a signal they want to
    // be called — pushing for their number right after reads oddly.
    skipPhonePrompt: true,
    keywords:
      /\b(contact number|sales number|phone number|your number|contact details|email address|your email|how (can|do) i (reach|contact) you|how to (reach|contact) you)\b/i,
    response: () =>
      `You can reach our sales team directly:\n\n` +
      `📞 ${COMPANY_INFO.phone}\n` +
      `✉️ ${COMPANY_INFO.email}\n` +
      `🌐 ${COMPANY_INFO.website}`,
  },
  {
    // Real, verified company background from the brochure ("Who we are")
    // — years in business, customer count, sq.ft. delivered — not
    // estimated. Deliberately separate from "verify" (RERA/legitimacy)
    // since "who built this" and "is this legit" are different questions
    // even though the honest answer to both involves HPR Infra.
    id: "builder",
    skipPhonePrompt: true,
    // Added yes/no phrasings ("is HPR Infra the builder/a company/a
    // developer") alongside the existing WH-phrasings — a natural way to
    // ask this once a visitor already knows the builder's name and just
    // wants to confirm the relationship, not be told about it from scratch.
    keywords:
      /\b(who (is|are) the builder|who built this|about hpr ?infra|builder details|developer details|who is behind this|which company|is hpr ?infra (a |the )?(builder|developer|construction company|real estate company|company))\b/i,
    // Same yes/no-vs-direct-request tone pattern as the verify topic above.
    response: (rawText = "") => {
      const isYesNo = /^\s*(is|are|do|does|has|have)\b/i.test(rawText);
      const opener = isYesNo
        ? "Yes — HPR Infra is the developer (the builder company) behind Shades of Green."
        : "Shades of Green is developed by HPR Infra —";
      return (
        `${opener} a Hyderabad-based real estate and construction company with 12+ years in ` +
        `business, 1,200+ happy customers, and 2.4+ million sq.ft. delivered — focused on ` +
        `thoughtfully planned apartments, villas, and plotted developments.`
      );
    },
  },
  {
    // Honest, deliberate answer rather than silently falling through to
    // the generic "I've noted that for our team" catch-all — the brochure
    // (the one source this bot is grounded in) doesn't name a CEO,
    // founder, or promoter anywhere, so this says so plainly instead of
    // guessing or staying silent on the question.
    id: "leadership",
    skipPhonePrompt: true,
    keywords: /\b(who is the ceo|who is the founder|who is the (managing director|promoter|chairman)|company leadership)\b/i,
    response: () =>
      `I don't have a specific leadership name on hand to share — but I can have someone from our ` +
      `team reach out with those details if that's helpful.`,
  },
  {
    // Deliberately placed before "location" and "amenities" below: both of
    // those have broader, more generic keywords ("nearby", "park") that
    // would otherwise steal a "schools nearby" or "hospitals nearby" query
    // before it ever reached this more specific topic. Regex order = match
    // priority throughout this file — see matchFaqTopic().
    id: "schools",
    keywords: /\bschools?\b/i,
    response: () =>
      `A few well-regarded schools nearby:\n\n` +
      `• BM International School, Hennur — ~2 mins\n` +
      `• Vidyashilp School — ~3 mins\n` +
      `• Rayan International Academy — ~12 mins\n` +
      `• Orchids The International School, Jakkur — ~12 mins`,
  },
  {
    id: "hospitals",
    keywords: /\bhospitals?\b/i,
    response: () =>
      `You're well covered for healthcare nearby:\n\n` +
      `• Cytecare Hospital — ~5km, ~8 mins\n` +
      `• Sparsh Hospital — ~7km, ~15 mins\n` +
      `• Manipal Hospital — ~10km, ~20 mins\n` +
      `• Aster Hospital — ~11km, ~22 mins`,
  },
  {
    // Split from one monolithic "location" answer into precise, single-fact
    // topics (this one, plus airport/metro/itpark/mall below) so asking
    // specifically about the airport doesn't also dump metro and tech-park
    // distances nobody asked for — a real complaint from a live transcript
    // ("it should only give what they asked, because they specifically
    // asked airport, IT park"). A genuinely broad question ("what are the
    // surroundings," "distance to the city") still gets the full combined
    // picture — see the "surroundings" topic at the end of this group,
    // which composes these same topics' own response() functions rather
    // than duplicating their text.
    id: "location",
    keywords: /\b(locat\w*|hennur|bagalur|where is|address of the project|directions)\b/i,
    response: () => `Shades of Green is off Hennur, near New Airport Road — about 250m from the main road.`,
  },
  {
    id: "airport_distance",
    keywords: /\bairport\b/i,
    response: () => `The airport is roughly 20 minutes away.`,
  },
  {
    id: "metro_distance",
    keywords: /\bmetro\b/i,
    response: () =>
      `The nearest metro station is Krishnarajapuram (K.R. Puram), and the upcoming Metro Phase ` +
      `2B (Airport Line) is set to improve connectivity further.`,
  },
  {
    // Also placed before "amenities": amenities' "park" keyword (for
    // "children's park," "pet park") would otherwise match inside "Tech
    // Park" first — e.g. "how far is Manyata Tech Park" needs to reach
    // *this* topic via "manyata"/"tech park", not get stolen by the word
    // "park" alone in a topic about playgrounds.
    id: "itpark_distance",
    keywords: /\b(tech park|it park|manyata|bhartiya city|amazon('s)? office)\b/i,
    response: () =>
      `Manyata Tech Park is about 20 minutes away, with Bhartiya City Tech Park (~8 mins) and ` +
      `Amazon's office (~10 mins) also close by.`,
  },
  {
    // New content this round — real brochure data (mall travel times) that
    // was sourced earlier but never actually added as an answerable topic.
    id: "mall_distance",
    keywords: /\bmalls?\b/i,
    response: () =>
      `For shopping: Bhartiya City Mall (~8 mins), Elements Mall (~15 mins), RMZ Galleria Mall ` +
      `(~15 mins), and Mall of Asia (~25 mins).`,
  },
  {
    // The genuinely broad "what's around here" question — deliberately
    // scoped to phrases that only make sense as a broad ask ("what's
    // nearby," not bare "nearby," which is exactly the keyword that used to
    // steal "schools nearby" before the schools topic ever got a chance —
    // see that topic's comment). Composes the narrower topics' own
    // response() functions (via FAQ_TOPICS, safe here since this closure
    // only runs long after the module — and this array — has fully
    // initialized) instead of duplicating their text, so updating one of
    // them can never drift out of sync with this combined answer.
    id: "surroundings",
    keywords:
      /\b(surrounding\w*|vicinity|what.?s (around|nearby|close by)|what is (around|nearby|close by)|connectivity|(distance|how far) (to|from|is it (to|from)) (the )?city|neighbou?rhood|what.?s in (the )?area|what is in (the )?area)\b/i,
    response: () =>
      ["location", "airport_distance", "metro_distance", "itpark_distance", "mall_distance", "schools", "hospitals"]
        .map((id) => FAQ_TOPICS.find((t) => t.id === id).response())
        .join("\n\n"),
  },
  {
    // Content grounded in the official brochure's own amenity list (not
    // just the homepage's shorter version) — see PROJECT_LOG.md for how
    // this was cross-checked against the source PDF rather than guessed.
    id: "amenities",
    // Bare "park" excluded when preceded by "tech "/"it " — otherwise "how
    // far is Manyata Tech Park" matches here too (via "park") on top of the
    // real itpark_distance answer, a redundant compound answer nobody asked
    // for. Same overly-generic-keyword bug class as this file's other
    // "narrow it, don't just reorder" fixes (see location's history above).
    keywords:
      /\b(amenit\w*|clubhouse|pool|swimming|gym|pickleball|basketball|cricket|(?<!tech )(?<!it )park|playground|reflexology|facilit\w*|feature|recreation|sports|jogging|yoga|meditation|library|water pond|kids? area|children.*play|co-?working|banquet|multipurpose|guest rooms?)\b/i,
    response: () =>
      `Shades of Green has a 15,000 sq.ft. clubhouse plus:\n\n` +
      `• Swimming pool, kids' pool, outdoor gym & yoga/meditation room\n` +
      `• Basketball court, pickleball court & cricket pitch\n` +
      `• Children's park, pet park, reflexology park & a water pond\n` +
      `• Indoor games, library, co-working space, multipurpose hall & 3 guest rooms`,
  },
  {
    id: "villadetails",
    keywords:
      /\b(villa details?|about the villas?|brick|courtyard|villa specification\w*|villa specs?\b|architecture|structure|what.*villas?.*like|total area|project (size|area)|how big is the project|(site|layout) (size|area)|acres?|parking)\b/i,
    response: () =>
      `Shades of Green is a limited gated community of 83 exclusive 4BHK villas on a 4.25-acre site ` +
      `— brick-cladded, courtyard-led layouts designed for space, privacy, and premium everyday ` +
      `living. BDA approved, RERA registered, with clear legal titles and bank loans available. ` +
      `Parking: 92 slots in all (83 covered, 9 open).`,
  },
  {
    // East/West sqft, floor count, and ceiling heights are pulled directly
    // from the brochure's own floor-plan pages (EAST/WEST VILLA PLANS,
    // "Structure" spec sheet) — not estimated or copied from the homepage,
    // which doesn't state these specifics at all.
    id: "floorplans",
    keywords:
      /\b(floor ?plans?|layout|configuration|sq ?ft|square feet|bhk|villa size|carpet area|blueprint|dimensions?|measurements?|how (big|many (bedrooms?|floors?))|bedrooms?|bathrooms?|floors?|storeys?|ceiling height)\b/i,
    response: () =>
      `All 83 villas at Shades of Green are spacious 4BHK layouts across ground, first, and second ` +
      `floors, plus a terrace. There are two villa types: East-facing villas (3,055 sq.ft) and ` +
      `West-facing villas (3,150 sq.ft), with 10-11 ft ceiling heights throughout for a spacious ` +
      `feel. Our team can share the exact floor plan PDFs once they're in touch with you.`,
  },
  {
    id: "pricing",
    // "how much" narrowed to "how much is/does/will/for/per" — the bare
    // phrase also matched unrelated questions like "how much parking do you
    // have," stealing them into a pricing answer they didn't ask for (the
    // same overly-generic-keyword bug class as "nearby"/"park"/"connect"
    // above — see those topics' comments).
    keywords: /\b(price|pricing|cost|budget|lakh|crore|how much (is|does|will|would|for|per|are)|rate|afford|expensive|cheap|emi|loan|payment ?plan|installment|quote|quotation)\b/i,
    // Sourced from the live official site (hprshadesofgreen.com, last
    // updated 5 Aug 2026) rather than the brochure, which states no price
    // anywhere — this replaces the earlier deliberate no-price stance from
    // when the only figure available was an expired 2-day promo rate. A
    // first-party, presumably-maintained official site is different footing
    // than an expired ad. Still framed as "starting from" with a
    // confirm-with-sales caveat since a listed online rate can still move.
    response: () =>
      `Prices start from ₹3.80 Cr onwards for East-facing villas and ₹4.08 Cr onwards for West-facing ` +
      `villas (approx. ₹12,956 per sq.ft). Payment plan: 10% at booking, 10% on Agreement of Sale, and ` +
      `the remaining balance in 28 bi-monthly installments. Home loans are available through SBI, HDFC, ` +
      `Axis Bank, and ICICI Bank. These are current listed rates — our sales team can confirm final ` +
      `pricing and any active offers for your preferred villa.`,
  },
  {
    // Timeline/possession facts, also sourced from the live official site
    // (see pricing's comment above) — the brochure doesn't state dates.
    id: "timeline",
    keywords:
      /\b(possession|completion|hand ?over|when (will|can) i (get|move)|ready to move|project timeline|launch date|construction timeline|when (is|will) (it|the project) (complete|ready|done))\b/i,
    response: () =>
      `Construction is slated to begin August 2026, with possession expected by 10 August 2031 — in ` +
      `line with the project's RERA validity (through ${COMPANY_INFO.reraValidity}).`,
  },
  {
    id: "sitevisit",
    keywords:
      /\b(site visit|visit the site|schedule a visit|book a visit|see the property|come (and )?see|visit in person|walkthrough|take a tour|meet.*sales|when can i visit|arrange a visit)\b/i,
    response: () =>
      `I'd love to set that up! Let me grab a few details so our team can confirm a slot that works for you.`,
  },
  {
    id: "brochure",
    keywords:
      /\b(brochure|pdf|catalogue|catalog|e-brochure|specification sheet|download.*(details|info)|send.*(details|info|catalog|pdf))\b/i,
    response: () =>
      `Here's the official Shades of Green brochure — your download should start automatically.`,
  },
  {
    // Just "thanks"/"thank you" mid-conversation used to fall through to
    // the generic "I've noted that for our team" catch-all, which read
    // oddly for something that isn't really a note for sales. Deliberately
    // narrow (not "hi"/"ok"/"great" etc.) — those are far too likely to
    // collide with a real answer (e.g. "hi" as a name at greet_name, "ok"
    // as filler while thinking) rather than genuine chitchat.
    id: "chitchat",
    skipPhonePrompt: true,
    keywords: /^(thanks?( you)?|thank you very much|ty)[.!]?$/i,
    response: () => `You're welcome! 🙂 Let me know if you'd like anything else.`,
  },
];

// Option/topic ids that trigger an actual file download (not just a text
// answer) when selected or matched. Kept as a small lookup rather than a
// hardcoded filename inline at every call site.
export const DOWNLOAD_TRIGGERS = {
  brochure: { fileUrl: "/brochure.pdf", fileName: "Shades_of_Green_Brochure.pdf" },
};

// A visitor typing "I want to purchase" or "talk to an agent" instead of
// picking an option isn't asking an FAQ — they're signalling readiness to
// buy or a wish to escalate to a human. Checked separately from
// FAQ_TOPICS (see useChatEngine.js's ask_intent free-text handling) so it
// can tag `interest` distinctly for the sales team instead of collapsing
// into the generic "General Enquiry" bucket, and get a warmer, more
// appropriate acknowledgment than a flat "I've noted it."
// "wanna"/"gonna" alongside "want to"/"going to": real typed chat skews
// informal, and a literal-phrase regex misses a contraction entirely
// rather than approximately — "I wanna buy a villa" shares zero characters
// in the right place with "want to buy" for even 1-typo fuzzy matching to
// help, so it has to be listed explicitly.
export const PURCHASE_INTENT_PATTERN =
  /\b((want|wanna) to (buy|purchase)|wanna (buy|purchase)|ready to (buy|purchase)|interested in (buying|purchasing)|book(ing)? (a|the) villa|reserve (a|the) villa|talk to (an? )?(agent|sales\w*|owner|representative|rep\b)|speak (to|with) (an? )?(agent|sales\w*|owner|someone)|connect me (with|to)|call me\b|contact (me|sales))\b/i;

// Classic edit-distance algorithm (Levenshtein) — the same technique
// spell-checkers and pre-LLM chatbots have used for decades to tolerate
// typos, with no ML/AI model involved. Counts the minimum number of
// single-character insertions/deletions/substitutions to turn `a` into `b`.
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// A handful of canonical, single-word keywords per topic that a visitor is
// likely to mistype — checked only when the precise regex above finds
// nothing, so this never overrides an exact match, only catches near-misses
// regex alone would silently ignore (e.g. "pricng", "ameneties", "locaton").
const FUZZY_KEYWORDS = {
  amenities: ["amenities", "amenity", "clubhouse", "facilities", "pickleball"],
  villadetails: ["villa", "villas", "courtyard"],
  floorplans: ["floorplan", "layout", "bedrooms", "bathrooms"],
  pricing: ["price", "pricing", "cost", "budget"],
  timeline: ["possession", "completion", "timeline"],
  location: ["location", "hennur"],
  airport_distance: ["airport"],
  metro_distance: ["metro"],
  itpark_distance: ["manyata"],
  sitevisit: ["visit", "walkthrough"],
  brochure: ["brochure", "catalogue", "catalog"],
  verify: ["rera", "registered", "genuine", "legit"],
};

// Allows more typos on longer words (a 10-letter word with 1 wrong letter
// is obviously the same word; that same tolerance on a short word risks
// matching an unrelated real word or name instead — e.g. "Willa" as an
// actual visitor's name is only one edit away from "villa"). Requiring an
// exact match up to 6 letters keeps that collision vanishingly rare while
// still catching the case regex alone misses entirely: a bare "villa" with
// no typo at all, which none of villadetails' phrase-based patterns match
// on its own.
function maxAllowedTypos(wordLength) {
  if (wordLength <= 6) return 0;
  if (wordLength <= 9) return 1;
  return 2;
}

function fuzzyMatchFaqTopic(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  if (!words.length) return null;
  for (const word of words) {
    for (const topic of FAQ_TOPICS) {
      const candidates = FUZZY_KEYWORDS[topic.id];
      if (!candidates) continue;
      for (const candidate of candidates) {
        if (Math.abs(word.length - candidate.length) > 2) continue; // quick reject
        if (levenshtein(word, candidate) <= maxAllowedTypos(candidate.length)) {
          return topic;
        }
      }
    }
  }
  return null;
}

// Returns every matching topic, not just the first — a real compound
// question ("what's the price and how many floors") deserves both
// answers, not whichever topic happens to sit first in the array. Capped
// at 3 so a message that accidentally brushes against several keywords at
// once doesn't turn into a wall of unrelated text. Falls back to the
// fuzzy/typo-tolerant single match only when nothing matched precisely at
// all — the fuzzy path stays a narrow safety net, not a second precise
// pass, so it doesn't compound its own risk of a wrong match.
export function matchFaqTopics(text) {
  const precise = FAQ_TOPICS.filter((topic) => topic.keywords.test(text));
  if (precise.length) return precise.slice(0, 3);
  const fuzzy = fuzzyMatchFaqTopic(text);
  return fuzzy ? [fuzzy] : [];
}

// A readable transcript for the sales team — what the visitor actually
// asked and was told, not just a category label. Used both for a completed
// submission's message field and for the tab-close/beacon partial-lead
// capture (see useChatEngine.js), so either way sales sees real context
// instead of a bare "General Enquiry." Capped at the last 40 messages so an
// unusually long session can't produce a runaway email.
export function buildConversationSummary(messages) {
  return messages
    .filter((m) => m.text && m.text.trim())
    .slice(-40)
    .map((m) => `${m.role === "user" ? "Visitor" : "Ria"}: ${m.text.replace(/\s+/g, " ").trim()}`)
    .join("\n");
}

// Shown when a visitor tries to ask anything — including typing a question
// directly — before finishing email verification (see useChatEngine.js's
// ctx.emailVerified gate on respondWithFaq). Every answer, not just
// pricing/brochure, is gated behind verification now.
export const NEED_VERIFICATION_MESSAGE = "Let's get you verified first!";

// `infoTopic` — when set, selecting this option shows that FAQ_TOPICS
// entry's real answer immediately (email is already verified by the time
// ask_intent is reachable at all, so there's no reason to withhold it).
// `triggersDownload` (brochure) fires the same way, immediately — the old
// "wait until phone AND email are both known" gate this used to have is
// gone now that verification, not contact-detail collection, is the real
// gate.
export const INTENT_OPTIONS = [
  { label: "Villa Details", value: "Villa Details", infoTopic: "villadetails" },
  { label: "Pricing Information", value: "Pricing Information", infoTopic: "pricing" },
  { label: "Book a Site Visit", value: "Site Visit" }, // routes to the scheduler, informative on its own
  { label: "📄 Download Brochure", value: "Brochure Download", triggersDownload: "brochure" },
  { label: "🛡️ RERA / Verify Us", value: "__info__", isInfo: true, faqId: "verify" },
];

export const chatFlow = {
  greet_name: {
    id: "greet_name",
    message: () =>
      `Hi! I'm ${ASSISTANT_NAME} 👋 your Shades of Green assistant. What's your name?`,
    // A visitor can ask an FAQ (e.g. a question containing "pricing")
    // before ever answering this very first question — without this, the
    // exact same greeting would repeat verbatim afterward, reading as a
    // glitch rather than a real assistant picking the conversation back up.
    resumeMessage: () => "Whenever you're ready, what's your name?",
    field: "name",
    validate: "name",
    next: "ask_email",
  },
  // Email verification happens right after the name, before anything else
  // — every answer (even the RERA/legitimacy check) is gated behind it.
  // See useChatEngine.js: submitFreeText() special-cases this step to
  // actually call the send-otp API before advancing to verify_otp.
  ask_email: {
    id: "ask_email",
    message: (ctx) =>
      `Thanks, ${ctx.name}! Before we go further, what's your email address? I'll send a quick code to verify it.`,
    resumeMessage: () => "Whenever you're ready — what's your email address?",
    field: "email",
    validate: "email",
    next: "verify_otp",
  },
  // useChatEngine.js's submitFreeText() special-cases this step to call the
  // verify-otp API and only advances (setting ctx.emailVerified = true) on
  // a real match — a wrong code re-asks this same step rather than
  // silently accepting anything.
  verify_otp: {
    id: "verify_otp",
    // `type: "otp"` — same pattern as pick_visit_slot's `type: "datetime"`
    // — renders a dedicated OtpInput widget (see ChatWindow.jsx) instead of
    // making someone type a 6-digit code into the generic message box.
    type: "otp",
    message: (ctx) => `I've sent a 6-digit code to ${ctx.email} — go ahead and enter it below.`,
    resumeMessage: () => "Whenever you're ready, enter the code we sent you below.",
    field: "otpCode",
    validate: "otp",
    options: [{ label: "Resend Code", value: "__resend_otp__", isResend: true }],
    next: "ask_intent",
  },
  ask_intent: {
    id: "ask_intent",
    message: () => "You're verified! What brings you here today?",
    // Shown instead of `message` when this step is re-asked after answering
    // a mid-conversation question — avoids repeating the exact same line
    // verbatim, which read as a glitch/loop rather than a real assistant.
    resumeMessage: () => "Anything else, or would you like to go ahead with one of these?",
    field: "interest",
    options: INTENT_OPTIONS,
    // Phone is only asked the FIRST time — once ctx.phone is already known
    // from an earlier topic in this same conversation, asking again is
    // exactly the kind of thing that makes a chatbot feel dumb rather than
    // smart. Site Visit still needs pick_visit_slot regardless (a fresh
    // date/time every time), it just skips straight there instead of via
    // contact_phone when the number's already on file.
    next: (value, ctx) => {
      const known = Boolean(ctx.phone);
      if (value === "Site Visit") return known ? "pick_visit_slot" : "contact_phone";
      // Once a lead has already been submitted once this session, routing a
      // second topic through "confirm" again would re-submit a duplicate
      // lead row and re-show "your enquiry has been submitted" a second
      // time — a real bug found via a live transcript, not hypothetical.
      // Looping back to this same step instead just shows the picked
      // topic's info and stays in the conversation. Site Visit above is the
      // one deliberate exception: a fresh slot is genuinely new information
      // sales needs to know about, so it's allowed to submit again.
      if (ctx.leadSubmitted) return "ask_intent";
      return known ? "confirm" : "contact_phone";
    },
  },
  pick_visit_slot: {
    id: "pick_visit_slot",
    type: "datetime",
    message: () => "Great choice! Pick a day and time that works for you.",
    resumeMessage: () => "Whenever you're ready, pick a day and time below.",
    field: "visitSlot",
    next: "confirm",
  },
  contact_phone: {
    id: "contact_phone",
    // Bridges to what the visitor actually just asked about, instead of
    // the same flat "Got it! What's the best phone number..." regardless
    // of context — that read as robotic and repetitive once a real
    // conversation touched more than one topic (confirmed by watching an
    // actual multi-topic transcript, not just guessing it might).
    type: "phone",
    message: (ctx) => {
      const bridge = {
        "Pricing Information": "I'll make sure our sales team shares exact pricing with you directly",
        "Villa Details": "Our team can walk you through more villa details from here",
        "Brochure Download": "While that downloads",
        "General Enquiry": "I'll pass that along to our team",
        "Ready to Purchase / Talk to Sales": "Let's get you connected",
        "Site Visit": "Let's lock in your visit",
      }[ctx.interest];
      return bridge
        ? `${bridge} — what's the best phone number to reach you on?`
        : "What's the best phone number to reach you on?";
    },
    resumeMessage: () => "Whenever you're ready — what's the best phone number to reach you on?",
    field: "phone",
    validate: "phone",
    // "Book a Site Visit" shows the calendar right after the phone number;
    // every other intent is done at this point (email was already
    // collected and verified up front, so there's no separate email step
    // left to go through here).
    next: (_value, ctx) => (ctx.interest === "Site Visit" ? "pick_visit_slot" : "confirm"),
  },
  confirm: {
    id: "confirm",
    terminal: true,
    // Brochure downloads fire immediately at selection now (see
    // INTENT_OPTIONS' comment), so by the time this shows, it's already
    // started — hence "has begun," not "will begin."
    //
    // "General Enquiry" gets its own, softer line — found from a real
    // transcript: a visitor who just asked "what is the project about,"
    // got an answer, and gave a phone number only because the bot asked
    // for one, isn't the same as someone who deliberately submitted a real
    // enquiry. "Your enquiry has been submitted" overstates that — it
    // implies they requested something that now needs resolving, when
    // really they already got what they asked for. This is exactly the
    // interest label a free-text FAQ answer's phone-prompt uses when no
    // more specific intent was ever chosen (see useChatEngine.js's
    // deliverFaqAnswer) — a deliberate button click (Villa Details,
    // Pricing Information, Site Visit) still reads as real enquiry intent,
    // so only this specific bucket gets the softer framing.
    message: (ctx) => {
      if (ctx?.interest === "Brochure Download") {
        return "Thank you! Your brochure download has begun, and our team will also follow up within 24 hours.";
      }
      if (ctx?.interest === "General Enquiry") {
        return "Thanks for chatting! I've shared your contact details with our team — they may reach out with more information if that's helpful.";
      }
      return "Thank you! Your enquiry has been submitted. Our team will contact you within 24 hours.";
    },
  },
};

export const START_STEP = "greet_name";
