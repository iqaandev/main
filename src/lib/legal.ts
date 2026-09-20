/*
 * Legal page content for iqaan.com — Privacy Policy, Terms of Service,
 * Cookie Policy. English-only by design: legal Arabic should be
 * lawyer-reviewed before publication, not machine-translated.
 *
 * Template drafted to match what the site actually does (GA4, Web3Forms,
 * localStorage locale). Have counsel review before relying on it.
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalDocument {
  slug: 'privacy' | 'terms' | 'cookies';
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  contactEmail: string;
}

const CONTACT_EMAIL = 'hello@iqaan.com';

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description:
      'How IQAAN collects, uses, and protects information on iqaan.com — contact forms, newsletter, and analytics.',
    updated: '19 September 2026',
    intro:
      'This policy explains what information IQAAN (“we”, “us”) collects through iqaan.com, how we use it, and the choices you have. We keep it short because we collect very little.',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'The site is static — it has no user accounts and no database of its own. Information reaches us only when you deliberately send it:',
        ],
        list: [
          'Contact form: your name, email address, company, and message, delivered to our inbox via the Web3Forms service.',
          'Newsletter: your email address, delivered the same way.',
          'Analytics: Google Analytics 4 measures aggregate visits using cookies — see our Cookie Policy for details and controls.',
          'Locale preference: the language you last used (English or Arabic) is stored in your browser’s localStorage so the site remembers it. It never leaves your device.',
        ],
      },
      {
        heading: 'What we do with it',
        paragraphs: [
          'Form and newsletter submissions are used only to reply to you or to send the newsletter you asked for. Analytics data is used only to understand which pages and tools are useful. We do not sell, rent, or share your information with anyone for their marketing, and we do not use it for automated profiling.',
        ],
      },
      {
        heading: 'Third parties involved',
        paragraphs: [
          'Two services process data on our behalf: Web3Forms (form delivery) and Google (Google Analytics 4). Their own policies govern how they handle data — see web3forms.com/privacy and policies.google.com/privacy. The interactive tools on this site run entirely in your browser; nothing you type into them is transmitted anywhere.',
        ],
      },
      {
        heading: 'Retention and your rights',
        paragraphs: [
          'Form submissions live in our email inbox until deleted. You may ask us at any time to confirm what we hold about you, correct it, or delete it — email us and we will do it promptly. Unsubscribing stops the newsletter immediately.',
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          'iqaan.com is a business site and is not directed to children under 16. We do not knowingly collect their personal information.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'If we change what the site collects, we will update this page and the date above. Material changes will be called out on the homepage.',
        ],
      },
    ],
    contactEmail: CONTACT_EMAIL,
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description:
      'The terms governing use of iqaan.com, its content, and its free calculators and tools.',
    updated: '19 September 2026',
    intro:
      'These terms govern your use of iqaan.com. By using the site you accept them. They are intentionally plain.',
    sections: [
      {
        heading: 'The tools are estimates, not advice',
        paragraphs: [
          'The calculators on this site (cost, ROI, cloud, maintenance, and unit-economics estimates, prioritization scores, and stack suggestions) are illustrative models built on industry-typical assumptions. They are provided for orientation only. They are not quotes, not financial advice, and not a substitute for scoping a real project. Only a written proposal from IQAAN constitutes a quote.',
        ],
      },
      {
        heading: 'Acceptable use',
        paragraphs: [
          'You may use the site and its tools freely, including for commercial evaluation. You may not attempt to disrupt the site, scrape it abusively, or misrepresent its content as your own.',
        ],
      },
      {
        heading: 'Intellectual property',
        paragraphs: [
          'The site’s design, text, and brand — including the IQAAN name and mark — belong to IQAAN. Inputs you type into the tools remain yours and, unless you submit them through a form, never leave your browser.',
        ],
      },
      {
        heading: 'No warranty; limitation of liability',
        paragraphs: [
          'The site and its tools are provided “as is”, without warranty of any kind. To the fullest extent permitted by law, IQAAN is not liable for decisions made in reliance on the tools’ outputs or for any damages arising from use of the site.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'We may update these terms as the site evolves. The date above reflects the current version; continued use after a change constitutes acceptance.',
        ],
      },
    ],
    contactEmail: CONTACT_EMAIL,
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description:
      'Which cookies and browser storage iqaan.com uses — Google Analytics measurement and your language preference.',
    updated: '19 September 2026',
    intro:
      'This policy lists every cookie and piece of browser storage iqaan.com uses. The list is short because the site is deliberately lean.',
    sections: [
      {
        heading: 'Analytics cookies (Google Analytics 4)',
        paragraphs: [
          'We use GA4 to understand, in aggregate, which pages and tools people use. GA4 sets the following cookies under the googletagmanager.com and iqaan.com domains:',
        ],
        list: [
          '_ga and _ga_<container-id> — distinguish visitors; persist 1–2 years.',
          'Possible short-lived session identifiers set during loading.',
        ],
      },
      {
        heading: 'Preference storage (not a cookie)',
        paragraphs: [
          'Your language choice (English/Arabic) is saved in localStorage under the key “iqaan-locale”. It is never transmitted and you can clear it via your browser’s site-data controls.',
        ],
      },
      {
        heading: 'Controlling cookies',
        paragraphs: [
          'You can block or delete cookies in your browser settings; every major browser explains how. Blocking analytics cookies does not affect any feature of the site — the tools keep working. We do not respond to Do-Not-Track signals individually because no feature depends on tracking.',
        ],
      },
      {
        heading: 'No consent wall (for now)',
        paragraphs: [
          'We load only the strictly-necessary measurement cookies described above. If our usage grows to require additional tracking, we will add a proper consent notice and update this policy first.',
        ],
      },
    ],
    contactEmail: CONTACT_EMAIL,
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}
