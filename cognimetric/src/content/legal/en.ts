import type { LegalContent } from "./types";

const content: LegalContent = {
  privacy: {
    updated: "Last updated: 12 July 2026",
    sections: [
      {
        heading: "Data controller",
        body: "The data controller for CogniMetric is [legal entity name — update before launch], contactable at privacy@cognimetric.example. This section must be completed with the operator's actual legal identity, registered address and, if applicable, VAT/tax ID before the site goes live.",
      },
      {
        heading: "Data we collect",
        body: "To operate CogniMetric we collect: (a) your answers and response times during the test; (b) technical data such as a hashed IP address and browser user agent, used only for basic security and fraud prevention; (c) your email address, only if you choose to provide it to receive a copy of your report; (d) payment metadata from our payment processors (Stripe and PayPal) — we never see or store your card or PayPal account details; (e) your cookie consent choices.",
      },
      {
        heading: "Purpose and legal basis",
        body: "We process your test responses and payment data to perform our contract with you (Art. 6(1)(b) GDPR): generating your cognitive-ability report and processing your one-time payment.\n\nWe process your email address and any optional analytics cookies only with your consent (Art. 6(1)(a) GDPR), which you may withdraw at any time.\n\nWe process hashed IP addresses and technical logs under our legitimate interest in preventing abuse and securing the service (Art. 6(1)(f) GDPR).",
      },
      {
        heading: "Retention",
        body: "Test responses and scores are retained for 24 months from the test date, after which they are deleted, unless you request earlier deletion. Payment records are retained for the period required by applicable tax and accounting law (up to 10 years) and are held by our payment processors. Hashed IP addresses are retained for 30 days. Cookie consent records are retained for 12 months.",
      },
      {
        heading: "Recipients and international transfers",
        body: "We share data only with processors strictly necessary to run CogniMetric: our hosting and database provider, and our payment processors Stripe and PayPal. Some of these providers may process data outside the European Economic Area; where that happens, we rely on appropriate safeguards such as the European Commission's Standard Contractual Clauses.",
      },
      {
        heading: "Your rights",
        body: "Under the GDPR you have the right to access, rectify, erase, restrict or object to the processing of your data, and to data portability. You can exercise these rights by emailing privacy@cognimetric.example. You also have the right to lodge a complaint with your national data protection authority.",
      },
      {
        heading: "Security",
        body: "We apply data minimization by design: we never store raw IP addresses, card numbers or PayPal credentials, and all traffic is encrypted in transit (HTTPS). Access to the database is restricted and payments are handled entirely by PCI-DSS-compliant processors.",
      },
      {
        heading: "Age requirement",
        body: "CogniMetric is intended for users aged 16 or over. We do not knowingly collect data from children under 16.",
      },
      {
        heading: "Changes to this policy",
        body: "We may update this policy from time to time; the 'last updated' date above reflects the most recent revision. Material changes will be highlighted on this page.",
      },
    ],
  },
  cookies: {
    updated: "Last updated: 12 July 2026",
    sections: [
      {
        heading: "What cookies are",
        body: "Cookies are small text files stored on your device that help websites function and, optionally, understand how they are used.",
      },
      {
        heading: "Cookies we use",
        body: "Strictly necessary: cm_locale (remembers your language), a theme cookie (remembers light/dark mode), cm_consent (remembers your cookie choices), and a session identifier used to associate your answers with your test attempt and payment. These are always active because the site cannot function without them.\n\nAnalytics: used only if you opt in via the cookie banner, to understand aggregate usage and improve the site. None are set until you provide consent.\n\nMarketing: not currently used on this site.",
      },
      {
        heading: "Third-party cookies",
        body: "When you choose to pay, Stripe or PayPal may set their own cookies on their hosted payment pages, governed by their respective privacy and cookie policies.",
      },
      {
        heading: "Managing your preferences",
        body: "You can change your cookie choices at any time by clearing your browser's cookies for this site, which will show the consent banner again, or via your browser settings.",
      },
    ],
  },
  terms: {
    updated: "Last updated: 12 July 2026",
    sections: [
      {
        heading: "The service",
        body: "CogniMetric provides a self-administered, online assessment of cognitive performance across six domains, for informational and recreational purposes. It is not a clinical or diagnostic instrument.",
      },
      {
        heading: "Eligibility",
        body: "You must be at least 16 years old to use CogniMetric independently. By taking the test you confirm that you meet this requirement.",
      },
      {
        heading: "Price and payment",
        body: "The full report costs a one-time fee of €1.00 (or the equivalent shown at checkout), payable by card, Apple Pay, Google Pay or PayPal via our payment processors Stripe and PayPal. As the report is digital content delivered to you immediately upon payment, you acknowledge that you lose your statutory right of withdrawal once the report is unlocked, in accordance with applicable EU consumer-protection law.",
      },
      {
        heading: "Refunds",
        body: "Because the report is delivered immediately, payments are generally non-refundable once the report has been unlocked, except where required by mandatory consumer-protection law or in case of a technical failure attributable to us. Contact us if you believe you were charged in error.",
      },
      {
        heading: "Acceptable use",
        body: "You agree not to attempt to circumvent the payment system, automate or bulk-generate test attempts, or use the service for any unlawful purpose.",
      },
      {
        heading: "Intellectual property",
        body: "All test items, scoring methodology, text and design are the property of CogniMetric or its licensors and may not be copied or redistributed without permission.",
      },
      {
        heading: "Disclaimer and limitation of liability",
        body: "The service is provided 'as is', without warranties of any kind. CogniMetric's score is a statistical estimate and must not be relied upon for clinical, educational, employment or legal decisions. To the maximum extent permitted by law, our liability is limited to the amount you paid for the report.",
      },
      {
        heading: "Governing law",
        body: "These terms are governed by the laws of Italy, without prejudice to any mandatory consumer-protection rights you may have under the law of your country of residence.",
      },
      {
        heading: "Contact",
        body: "Questions about these terms can be sent to privacy@cognimetric.example.",
      },
    ],
  },
};

export default content;
