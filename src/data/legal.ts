/**
 * Copy for the legal pages (/privacy and /terms).
 * Text strings may contain inline HTML (links, emphasis); they are rendered with set:html.
 */
export type LegalBlock =
  | { p: string }
  | { h3: string }
  | { list: { term?: string; text: string }[] }
  | { note: { term: string; text: string } }
  | { contact: true };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  slug: 'privacy' | 'terms';
  /** Page <title> and the plain-text name of the document. */
  name: string;
  /** Heading split into a plain part and the red serif accent. */
  heading: [string, string];
  description: string;
  updated: string;
  updatedIso: string;
  sections: LegalSection[];
}

const contactBlocks: LegalBlock[] = [{ contact: true }];

export const privacy: LegalDoc = {
  slug: 'privacy',
  name: 'Privacy Policy',
  heading: ['Privacy', 'policy.'],
  description: 'How ihor.me handles your personal data: no forms, no analytics, no tracking cookies. What is processed when you get in touch, and your rights.',
  updated: 'October 21, 2026',
  updatedIso: '2026-10-21',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      blocks: [
        { p: 'Welcome to ihor.me (the "Website"). This Website is owned and operated by PE Ihor Ivanchenko ("I," "me," or "my").' },
        { p: 'I respect your privacy and am committed to protecting the personal information you share with me. This Privacy Policy explains what information is processed when you visit the Website or contact me, how I use it, and your rights regarding your data.' },
        { p: 'In short: the Website has no forms, no user accounts, no analytics and no advertising trackers. I only receive personal information when you choose to contact me.' },
      ],
    },
    {
      id: 'information-i-collect',
      title: 'Information I Collect',
      blocks: [
        { h3: 'Information you send me' },
        { p: 'When you contact me by email, Telegram or WhatsApp, or book a call through Cal.com, I receive the information you choose to share. This usually includes:' },
        {
          list: [
            { term: 'Name', text: 'To address you properly.' },
            { term: 'Contact details', text: 'Your email address, messenger account or phone number, so I can reply.' },
            { term: 'Project details', text: 'Anything you tell me about your company, your project, its timeline or budget.' },
          ],
        },
        { h3: 'Technical information' },
        { p: 'The Website is hosted on Cloudflare. To deliver pages and protect the Website from attacks and abuse, Cloudflare processes standard technical data such as your IP address, browser type, the pages requested and the time of the request.' },
        { p: 'I do not use analytics tools (like Google Analytics), advertising trackers, social media pixels or embedded third-party content. Fonts, images and videos are all served from the Website itself, so visiting it does not send your data to other services.' },
      ],
    },
    {
      id: 'how-i-use-your-information',
      title: 'How I Use Your Information',
      blocks: [
        { p: 'I use the information you send me solely for the following purposes:' },
        {
          list: [
            { text: 'To respond to your inquiries and discuss potential collaboration.' },
            { text: 'To schedule and hold calls you book with me.' },
            { text: 'To prepare proposals and provide the services you requested.' },
            { text: 'To keep the business and accounting records I am required to keep by law.' },
          ],
        },
        { p: 'I do not sell, rent, or trade your personal information to third parties, and I do not use it for advertising.' },
      ],
    },
    {
      id: 'third-party-services',
      title: 'Third-Party Services',
      blocks: [
        { p: 'To operate this Website and communicate with you, I rely on the following service providers. Each processes data under its own privacy policy:' },
        {
          list: [
            { term: 'Cloudflare', text: 'Hosts and delivers the Website and protects it from abuse. Read <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare\'s Privacy Policy</a>.' },
            { term: 'Cal.com', text: 'Used when you book a call. Information you enter there is governed by <a href="https://cal.com/privacy" target="_blank" rel="noopener">Cal.com\'s Privacy Policy</a>.' },
            { term: 'Email and messengers', text: 'If you write to me by email, Telegram or WhatsApp, your messages are also handled by those providers under their own policies.' },
          ],
        },
        { p: 'The Website also links to other websites, such as client projects and AI assistants (the "Ask AI about me" links, which open the assistant with a pre-filled question). Nothing is sent to those services until you click a link, and once you do, their own privacy policies apply.' },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      blocks: [
        { p: 'The Website does not set any cookies of its own and does not store anything in your browser. There are no tracking or advertising cookies, which is why you do not see a cookie banner.' },
        { p: 'If Cloudflare detects suspicious or automated traffic, it may set a strictly necessary security cookie to tell people and bots apart. This cookie is used only to protect the Website and does not track you across other websites.' },
      ],
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      blocks: [
        { p: 'I keep our correspondence for as long as it is needed to answer your inquiry or to carry out and support our project. Contracts, invoices and related records are kept for as long as the law requires. Technical data processed by Cloudflare is retained according to Cloudflare\'s own policies.' },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your Data Protection Rights',
      blocks: [
        { p: 'Depending on your location, you may have the following rights regarding your personal data:' },
        {
          list: [
            { term: 'The right to access', text: 'You have the right to request copies of your personal data.' },
            { term: 'The right to rectification', text: 'You have the right to request that I correct any information you believe is inaccurate.' },
            { term: 'The right to erasure', text: 'You have the right to request that I erase your personal data ("Right to be Forgotten").' },
            { term: 'The right to object', text: 'You have the right to object to, or ask me to restrict, the processing of your personal data.' },
          ],
        },
        { p: 'To exercise any of these rights, please contact me at the email address below. You also have the right to lodge a complaint with the data protection authority in your country.' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to This Privacy Policy',
      blocks: [
        { p: 'I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Me',
      blocks: [{ p: 'If you have any questions about this Privacy Policy or how I handle your data, please contact me:' }, ...contactBlocks],
    },
  ],
};

export const terms: LegalDoc = {
  slug: 'terms',
  name: 'Terms and Conditions',
  heading: ['Terms &', 'conditions.'],
  description: 'The terms for using ihor.me, the website of design engineer Ihor Ivanchenko: intellectual property, acceptable use, liability and governing law.',
  updated: 'October 21, 2026',
  updatedIso: '2026-10-21',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      blocks: [
        { p: 'Welcome to ihor.me (the "Website"). These Terms and Conditions ("Terms") govern your use of the Website operated by PE Ihor Ivanchenko ("I," "me," or "my").' },
        { p: 'By accessing or using the Website, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Website.' },
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      blocks: [
        { p: 'The Website and its original content, features, and functionality are and will remain the exclusive property of PE Ihor Ivanchenko.' },
        {
          list: [
            { term: 'Copyright', text: 'All content, including text, graphics, logos, images, videos, and software (including the source code and design of the Website), is the property of PE Ihor Ivanchenko or used with permission and is protected by international copyright laws.' },
            { term: 'Restrictions', text: 'You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on the Website, except as incidental to normal web browsing.' },
          ],
        },
        { note: { term: 'Note for Developers', text: 'The source code, design system and visual identity of this Website are proprietary. Copying its code, layout, animations or design for commercial use is prohibited without my prior written consent.' } },
      ],
    },
    {
      id: 'client-work',
      title: 'Client Work and Trademarks',
      blocks: [
        { p: 'The Website shows projects I have designed and built for clients, together with client names, logos, screenshots and testimonials. They are shown to illustrate my work. Client names, logos and trademarks remain the property of their respective owners, and showing them does not imply that those owners endorse anything beyond the testimonial they gave.' },
      ],
    },
    {
      id: 'use-of-the-website',
      title: 'Use of the Website',
      blocks: [
        { p: 'You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use and enjoyment of the Website.' },
        { p: 'You agree not to:' },
        {
          list: [
            { text: 'Use the contact details on the Website to send unsolicited commercial communications (spam).' },
            { text: 'Attempt to gain unauthorized access to the Website or its hosting infrastructure, or interfere with its operation, for example by overloading it.' },
            { text: 'Use automated tools to copy the Website\'s content or design in bulk for reuse.' },
          ],
        },
        { p: 'Search engines and AI assistants that index the Website in line with its robots.txt file are welcome.' },
      ],
    },
    {
      id: 'third-party-links',
      title: 'Third-Party Links and Tools',
      blocks: [
        { p: 'My Website contains links to third-party websites and services that are not owned or controlled by me, including:' },
        {
          list: [
            { term: 'Cal.com', text: 'Used for scheduling calls.' },
            { term: 'Telegram and WhatsApp', text: 'Used for messaging.' },
            { term: 'Client websites', text: 'Linked from the projects I show.' },
            { term: 'AI assistants', text: 'ChatGPT, Claude, Perplexity and Gemini, linked from the "Ask AI about me" section.' },
          ],
        },
        { p: 'I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that PE Ihor Ivanchenko shall not be responsible or liable, directly or indirectly, for any damage or loss caused by or in connection with the use of any such content, goods, or services available on or through any such websites.' },
      ],
    },
    {
      id: 'no-binding-contract',
      title: 'No Professional Advice or Binding Contract',
      blocks: [
        { p: 'The information provided on this Website regarding web design and development services is for general informational purposes only.' },
        {
          list: [
            { term: 'Booking a Call', text: 'Scheduling a call via Cal.com or sending me a message does not create a binding service contract or a client-vendor relationship.' },
            { term: 'Prices and Timelines', text: 'Prices and timelines mentioned on the Website, such as starting prices or typical project durations, are indicative. The binding price and schedule are set in the proposal or agreement for each project.' },
            { term: 'Service Agreement', text: 'A formal working relationship is only established upon the signing of a separate Service Agreement or Proposal.' },
          ],
        },
      ],
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of Liability',
      blocks: [
        { p: 'The Website is provided on an "as is" and "as available" basis. I do my best to keep it accurate and available, but I do not guarantee that it will always be error-free or uninterrupted.' },
        { p: 'In no event shall PE Ihor Ivanchenko, nor my partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Website.' },
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      blocks: [
        { p: 'These Terms shall be governed and construed in accordance with the laws of Ukraine, without regard to its conflict of law provisions.' },
        { p: 'Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Ukraine.' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to These Terms',
      blocks: [
        { p: 'I reserve the right, at my sole discretion, to modify or replace these Terms at any time. The "Last Updated" date at the top shows when they last changed. By continuing to access or use the Website after those revisions become effective, you agree to be bound by the revised terms.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Me',
      blocks: [{ p: 'If you have any questions about these Terms, please contact me:' }, ...contactBlocks],
    },
  ],
};

export const legalDocs = [privacy, terms];
