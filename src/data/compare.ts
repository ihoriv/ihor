/** Comparison table: working with Ihor vs a typical freelancer vs a typical agency.
 *  A cell is text, or a mark (yes / no / part) with a short note shown next to it. */
export type Mark = { m: 'yes' | 'no' | 'part'; t: string };
export type Cell = string | Mark;

export const compareCols = ['Ihor', 'Freelancer', 'Agency'] as const;

export const compareRows: { k: string; c: [Cell, Cell, Cell] }[] = [
  { k: 'Who does the work', c: ['One senior person, first call to launch', 'One person, usually design or code', 'A rotating team behind an account manager'] },
  { k: 'Pricing', c: ['Fixed quote, agreed before the start', 'Hourly or per page', 'Higher, with management overhead'] },
  { k: 'Timeline', c: ['3 to 8 weeks, fixed in the agreement', 'Varies with their availability', 'Often several months'] },
  { k: 'Strategy and page architecture', c: [{ m: 'yes', t: 'Before any design' }, { m: 'no', t: 'Usually skipped' }, { m: 'yes', t: 'By a separate team' }] },
  { k: 'Design and development in one place', c: [{ m: 'yes', t: 'Same person designs and builds' }, { m: 'part', t: 'Rarely both' }, { m: 'yes', t: 'Across separate teams' }] },
  { k: 'SEO, GEO and schema markup', c: [{ m: 'yes', t: 'Included' }, { m: 'no', t: 'Not included' }, { m: 'part', t: 'Often extra' }] },
  { k: 'WCAG 2.2 AA accessibility', c: [{ m: 'yes', t: 'Included' }, { m: 'no', t: 'Rarely considered' }, { m: 'part', t: 'Often extra' }] },
  { k: 'A CMS your team can edit', c: [{ m: 'yes', t: 'Set up and handed over' }, { m: 'part', t: 'Depends on the build' }, { m: 'yes', t: 'Usually included' }] },
  { k: 'You own the files, code and CMS', c: [{ m: 'yes', t: 'Everything, on final payment' }, { m: 'part', t: 'Not always the source files' }, { m: 'part', t: 'Sometimes licensed' }] },
  { k: 'Direct line to the person doing the work', c: [{ m: 'yes', t: 'Always' }, { m: 'yes', t: 'Yes' }, { m: 'no', t: 'Through an account manager' }] },
  { k: 'Support after launch', c: ['14 days included', 'Ad hoc', 'Paid retainer'] },
];
