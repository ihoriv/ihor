/** from/to are the weeks a step covers on the 8-week timeline; label is its short name there; items is what the step includes. */
export const steps = [
  { when: 'Week 1', from: 1, to: 1, label: 'Discovery', title: 'I learn how you sell.', text: 'Discovery call, business analysis and a competitor review.', items: ['Business analysis', 'Competitor review', 'Keyword & GEO research', 'Content plan'], result: 'A sitemap and a fixed quote.' },
  { when: 'Weeks 2–6', from: 2, to: 6, label: 'Design & build', title: 'I design and build around it.', text: 'Copy direction, design and development, stage by stage.', items: ['UX/UI & design system', 'Responsive build', 'CMS you can edit', 'SEO, GEO & schema', 'WCAG 2.2 AA', 'Copy direction'], result: 'Weekly previews you can click through.' },
  { when: 'Weeks 7–8', from: 7, to: 8, label: 'Launch', title: 'I launch and hand it over.', text: 'QA, launch and a walkthrough for your team.', items: ['Cross-browser QA', 'Core Web Vitals', 'Analytics & Search Console', 'Redirects & domain', 'Forms & integrations', 'Team walkthrough'], result: 'A site your team owns and edits.' },
];

export const weeks = 8;
