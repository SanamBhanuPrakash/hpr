// JSON-LD structured data. Organization schema only, injected on the
// homepage — see ARCHITECTURE.md §4.4 for why RealEstateListing (less
// universally supported) was deliberately not used here.
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "HPR Infra",
    url: "https://shadesofgreens.in/",
    logo: "https://shadesofgreens.in/images/HPR_LOGO.png",
    image: "https://shadesofgreens.in/images/HPR_LOGO.png",
    telephone: "+91-9187210414",
    email: "sales@hprinfra.com",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "101, Silicon Towers, Near Image Gardens, Image Garden Road",
        addressLocality: "Madhapur",
        postalCode: "500081",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Sy.No.:59/1, 59/2 & 59/3, Kadusoppanahalli Village, Bidarahalli Hobli",
        addressLocality: "Bengaluru East Taluk, Bengaluru District",
        addressCountry: "IN",
      },
    ],
    sameAs: [
      "https://www.facebook.com/people/HPR-Infra/61586207792555/",
      "https://www.instagram.com/hpr_infra/",
      "https://www.youtube.com/@HPRInfra",
    ],
  };
}

// FAQPage schema — real answers to what buyers actually ask, matching the
// same content the chatbot gives (not duplicated by hand, so it can't drift
// — see components/chat/chatFlow.js's FAQ_TOPICS for the source of truth
// this was authored alongside). Eligible for a Google FAQ rich result.
export function getFaqSchema() {
  const qa = [
    {
      q: "Where is Shades of Green located?",
      a: "Shades of Green is off Hennur, near New Airport Road in North Bengaluru — easy access from Hennur-Bagalur Main Road, about 250m from the main road, ~16km from the airport, and ~6km from the nearest metro station.",
    },
    {
      q: "Is Shades of Green RERA registered?",
      a: "Yes. Shades of Green is registered under RERA with registration number PRM/KA/RERA/1251/446/PR/040826/008858, verifiable on the official Karnataka RERA (RERAK) website.",
    },
    {
      q: "What configurations are available at Shades of Green?",
      a: "Shades of Green offers 83 exclusive 4BHK villas — brick-cladded, courtyard-led layouts across ground, first, and second floors, on 4.25 acres.",
    },
    {
      q: "What amenities does Shades of Green have?",
      a: "A 15,000 sq.ft. clubhouse, swimming pool, outdoor gym, nature-inspired walkways, pickleball court, cricket pitch, children's park, pet park, reflexology park, indoor games, banquet hall, co-working space, and guest rooms.",
    },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
