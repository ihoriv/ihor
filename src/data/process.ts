export const steps = [
  { when: 'Week 1', title: 'I learn how you sell.', text: 'Discovery call, business analysis and a competitor review.', result: 'A sitemap and a fixed quote.' },
  { when: 'Weeks 2–6', title: 'I design and build around it.', text: 'Copy direction, design and development, stage by stage.', result: 'Weekly previews you can click through.' },
  { when: 'Weeks 7–8', title: 'I launch and hand it over.', text: 'QA, launch and a walkthrough for your team.', result: 'A site your team owns and edits.' },
];

/** Timeline phases, in weeks out of 8. */
export const phases = [
  { label: 'Discovery', from: 0, weeks: 1, fill: 'var(--white)' },
  { label: 'Design + build', from: 1, weeks: 5, fill: 'var(--sage)' },
  { label: 'Launch', from: 6, weeks: 2, fill: 'var(--white)' },
];
