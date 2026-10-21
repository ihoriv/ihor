export interface Service {
  title: string;
  tags: string[];
  text: string;
  video: string;
  /** Panel background and theme. */
  bg: string;
  theme: 'light' | 'red' | 'dark';
}

export const services: Service[] = [
  { title: 'Strategy and structure', tags: ['Business analysis', 'Positioning', 'Competitor review', 'Page architecture', 'Content structure', 'Conversion paths'], text: 'Business analysis, positioning and page architecture, decided before any design starts.', video: '/media/service-strategy.mp4', bg: 'var(--white)', theme: 'light' },
  { title: 'Art direction and UX/UI', tags: ['Art direction', 'UX research', 'UI design', 'Design systems', 'Copy direction', 'Prototypes'], text: 'A visual language that makes you look like the leader in your category.', video: '/media/service-design.mp4', bg: 'var(--sage)', theme: 'light' },
  { title: 'Design engineering', tags: ['React & Astro', 'Sanity CMS', 'Webflow', 'Accessibility', 'Performance', 'Webflow Partner'], text: 'Custom builds that are fast, accessible and easy for your team to edit. The stack follows the project.', video: '/media/service-engineering.mp4', bg: 'var(--red)', theme: 'red' },
  { title: 'Search and AI visibility', tags: ['Technical SEO', 'GEO', 'Schema markup', 'Core Web Vitals', 'Analytics', 'AI answers'], text: 'Technical SEO and GEO, so Google ranks you and AI assistants recommend you.', video: '/media/service-visibility.mp4', bg: 'var(--green)', theme: 'dark' },
];

/** Rotating words after "One specialist for". */
export const serviceWords = [
  { text: 'your strategy.' },
  { text: 'your design.' },
  { text: 'your code.', color: 'var(--white)' },
  { text: 'your visibility.', color: 'var(--red-bright)' },
];
