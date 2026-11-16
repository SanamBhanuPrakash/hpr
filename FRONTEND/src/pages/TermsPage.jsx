import LegalPageLayout from "../components/legal/LegalPageLayout";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    body: (
      <p>
        These Terms &amp; Conditions ("Terms") govern your use of{" "}
        <a href="https://shadesofgreens.in/">shadesofgreens.in</a> (the "Website"), operated by
        HPR Infra for the "Shades of Green" residential villa project ("Project"). By accessing or
        using the Website, you agree to be bound by these Terms. If you do not agree, please do
        not use the Website.
      </p>
    ),
  },
  {
    id: "informational-purpose",
    title: "Informational Purpose Only",
    body: (
      <>
        <p>
          The content on this Website — including descriptions, renders, 3D visualisations, floor
          plans, amenities, pricing indications, and imagery — is provided for general
          informational purposes only and does not constitute an offer, invitation, or contract of
          sale.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5 text-[#1A4744] not-italic">
          All images are artistic impressions unless stated otherwise. Areas, specifications,
          layouts, amenities, and approvals are indicative and subject to change and to authority
          revisions.
        </div>
      </>
    ),
  },
  {
    id: "no-booking-implied",
    title: "No Booking or Reservation Implied",
    body: (
      <p>
        Submitting an enquiry, contact form, brochure download request, or chat conversation on
        this Website does <strong>not</strong> constitute a booking, reservation, allotment,
        confirmation of availability, or purchase of any unit in the Project. Units, pricing, and
        availability are subject to confirmation by HPR Infra&apos;s sales team and to the
        execution of formal booking and sale documentation as per applicable law.
      </p>
    ),
  },
  {
    id: "rera",
    title: "RERA Disclosure",
    body: (
      <p>
        The Project is registered under RERA with registration number{" "}
        <strong>PRM/KA/RERA/1251/446/PR/040826/008858</strong>. Prospective buyers are advised to
        verify project details on the official Karnataka RERA website before making any decision.
      </p>
    ),
  },
  {
    id: "use-of-website",
    title: "Use of the Website",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Website for any unlawful purpose or in violation of these Terms</li>
          <li>Attempt to gain unauthorised access to any part of the Website or its underlying systems</li>
          <li>Submit false, misleading, or fraudulent information through our forms or chat assistant</li>
          <li>
            Copy, reproduce, or use Website content (including images and floor plans) for
            commercial purposes without written permission
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body: (
      <p>
        All logos, trademarks, text, graphics, and images on this Website are the property of HPR
        Infra or its licensors and are protected by applicable intellectual property laws. Nothing
        on this Website grants you a licence to use them without prior written consent.
      </p>
    ),
  },
  {
    id: "third-party-tools",
    title: "Third-Party Tools & Links",
    body: (
      <p>
        This Website uses third-party services (such as Google Analytics, Google Tag Manager,
        Google Ads, and the Meta Pixel) for analytics and advertising measurement, and may link to
        third-party websites. HPR Infra is not responsible for the content, accuracy, or practices
        of third-party websites or services.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: (
      <p>
        To the maximum extent permitted by law, HPR Infra shall not be liable for any indirect,
        incidental, or consequential loss or damage arising from your use of, or inability to use,
        the Website, or from reliance on any information presented on it. Final specifications,
        pricing, and terms of sale will be governed solely by the formal agreement executed
        between HPR Infra and the buyer.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    body: (
      <p>
        We may revise these Terms at any time. Continued use of the Website after changes are
        posted constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    body: (
      <p>
        These Terms are governed by the laws of India, and any disputes shall be subject to the
        exclusive jurisdiction of the courts at Bengaluru, Karnataka.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    body: (
      <p>
        HPR Infra
        <br />
        Sy. No. 59/1, 59/2 &amp; 59/3, Kadusoppanahalli Village, Bidarahalli Hobli, Bengaluru East
        Taluk, Bengaluru District
        <br />
        Phone: <a href="tel:+919187210414">+91 9187210414</a>
        <br />
        Email: <a href="mailto:sales@hprinfra.com">sales@hprinfra.com</a>
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="Please read these terms before using this Website"
      sections={sections}
    />
  );
}
