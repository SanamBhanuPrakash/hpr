import LegalPageLayout from "../components/legal/LegalPageLayout";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <p>
        This Privacy Policy explains how HPR Infra ("HPR Infra", "we", "us", "our") collects,
        uses, discloses, and safeguards information when you visit{" "}
        <a href="https://shadesofgreens.in/">shadesofgreens.in</a> (the "Website"), including when
        you submit an enquiry, request pricing, download a brochure, request a call back, or
        interact with our chat assistant. By using the Website, you agree to the practices
        described in this policy.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <p>We collect information you voluntarily provide when you interact with our forms or chat assistant, including:</p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone / mobile number</li>
          <li>The property configuration or service you are interested in</li>
          <li>Any message or requirement details you choose to share</li>
        </ul>
        <p>
          We also automatically collect limited technical information through cookies and
          analytics tools, such as your approximate location, device/browser type, pages viewed,
          and how you arrived at the Website (for example, from a Google or Meta advertisement).
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    body: (
      <>
        <ul>
          <li>To respond to your enquiry and contact you about Shades of Green (typically within 24 hours)</li>
          <li>To send you requested information such as pricing, floor plans, or brochures</li>
          <li>To improve the Website and understand which content and campaigns are effective</li>
          <li>To measure the performance of our advertising on Google Ads and Meta (Facebook/Instagram)</li>
          <li>To comply with legal, regulatory, or RERA-related recordkeeping obligations</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    body: (
      <p>
        The Website uses cookies and similar technologies through Google Tag Manager, Google
        Analytics (GA4), Google Ads, and the Meta Pixel to understand Website usage and measure
        the effectiveness of our marketing. These tools may set cookies in your browser and, where
        applicable, share de-identified or hashed data with Google and Meta for advertising
        measurement. You can control or disable cookies through your browser settings; some parts
        of the Website may not function as intended if cookies are disabled.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    body: (
      <>
        <p>We share information only with:</p>
        <ul>
          <li>Our internal sales and marketing team, to follow up on your enquiry</li>
          <li>
            Service providers who help us operate the Website, send email notifications, or host
            our infrastructure, under confidentiality obligations
          </li>
          <li>
            Analytics and advertising platforms (Google, Meta) strictly for measurement and
            remarketing purposes, as described above
          </li>
          <li>Authorities, where required by law or a valid legal process</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    body: (
      <p>
        We retain enquiry and lead information for as long as reasonably necessary to respond to
        your enquiry, maintain sales records, and meet regulatory or accounting obligations, after
        which it is deleted or anonymised.
      </p>
    ),
  },
  {
    id: "security",
    title: "Data Security",
    body: (
      <p>
        We use reasonable administrative and technical safeguards to protect your information.
        However, no method of transmission or storage over the internet is completely secure, and
        we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: (
      <p>
        You may request access to, correction of, or deletion of your personal information, or ask
        us to stop contacting you, at any time by writing to{" "}
        <a href="mailto:sales@hprinfra.com">sales@hprinfra.com</a>.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    body: (
      <p>
        The Website may contain links to third-party sites (for example, social media). We are not
        responsible for the privacy practices of those third-party sites.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    body: (
      <p>The Website is not directed at children under 18, and we do not knowingly collect information from them.</p>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Continued use of the Website after
        changes are posted constitutes acceptance of the revised policy.
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
        101, Silicon Towers, Near Image Gardens, Image Garden Road, Madhapur &ndash; 500081
        <br />
        Phone: <a href="tel:+919187210414">+91 9187210414</a>
        <br />
        Email: <a href="mailto:sales@hprinfra.com">sales@hprinfra.com</a>
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="How HPR Infra collects, uses, and protects your information"
      sections={sections}
    />
  );
}
