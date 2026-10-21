/**
 * /llms.txt: a plain-text summary of the site for AI assistants and answer engines (llmstxt.org).
 * Built from the same data as the pages, so it stays in sync with them.
 */
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { services } from '../data/services';
import { faq } from '../data/faq';
import { projects } from '../data/projects';
import { socials, messengers } from '../data/social';

export const GET: APIRoute = () => {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a senior design engineer based in ${site.location}. He works alone, covering strategy, design and engineering, and builds websites for companies whose website no longer matches the quality of their work. He is a certified Premium Webflow Partner and works with clients in Europe, the USA, Asia, Australia and Canada.`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- **${s.title}**: ${s.text} (${s.tags.join(', ')})`),
    '',
    '## Selected work',
    '',
    ...projects.map((p) => `- [${p.name}](${p.url})${p.industry ? `: ${p.industry}` : ''}${p.services ? `. ${p.services}` : ''}`),
    '',
    '## FAQ',
    '',
    ...faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- Book an intro call: ${site.booking}`,
    ...messengers.map((m) => `- ${m.name}: ${m.href}`),
    ...socials.map((s) => `- ${s.name}: ${s.href}`),
    '',
    '## Pages',
    '',
    `- [Homepage](${site.url}/): services, work, client stories, process, FAQ`,
    `- [Privacy policy](${site.url}/privacy/)`,
    `- [Terms and conditions](${site.url}/terms/)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
