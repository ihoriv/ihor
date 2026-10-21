/**
 * Structured data (schema.org JSON-LD) for every page, as one connected @graph.
 * The site-wide entities (website, person, business) have stable @ids, so each page's
 * WebPage node can point at them instead of repeating them.
 */
import { site } from './site';
import { socials, messengers } from './social';
import { services } from './services';
import { faq } from './faq';
import { projects } from './projects';

const id = (frag: string) => `${site.url}/#${frag}`;
export const ids = { website: id('website'), person: id('person'), business: id('business') };

/** Public profiles that identify the same person (used by search engines and AI assistants). */
const sameAs = [...socials.map((s) => s.href), messengers.find((m) => m.name === 'Telegram')!.href];

interface PageInput {
  url: string;
  title: string;
  description: string;
  ogImage: string;
  avatar: string;
  /** Set for pages below the homepage: their name in the breadcrumb trail. */
  breadcrumb?: string;
  /** ISO date the page content last changed. */
  modified?: string;
  isHome: boolean;
}

export function buildSchema(p: PageInput) {
  const person = {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    givenName: 'Ihor',
    familyName: 'Ivanchenko',
    url: site.url,
    image: p.avatar,
    email: `mailto:${site.email}`,
    jobTitle: 'Senior design engineer',
    description: 'Senior design engineer and Premium Webflow Partner. Plans, designs and builds websites for B2B, SaaS, construction and industrial companies.',
    worksFor: { '@id': ids.business },
    address: { '@type': 'PostalAddress', addressLocality: 'Kharkiv', addressCountry: 'UA' },
    knowsLanguage: ['en', 'uk'],
    knowsAbout: ['Web design', 'Web development', 'Design engineering', 'Webflow', 'Astro', 'React', 'Sanity CMS', 'UX design', 'UI design', 'Art direction', 'Technical SEO', 'Generative engine optimization', 'B2B websites', 'SaaS websites'],
    sameAs,
  };

  const business = {
    '@type': 'ProfessionalService',
    '@id': ids.business,
    name: site.name,
    alternateName: 'ihor.me',
    url: site.url,
    image: p.ogImage,
    logo: `${site.url}/apple-touch-icon.png`,
    description: site.description,
    email: site.email,
    founder: { '@id': ids.person },
    address: { '@type': 'PostalAddress', addressLocality: 'Kharkiv', addressCountry: 'UA' },
    areaServed: 'Worldwide',
    priceRange: 'From $3,000',
    knowsAbout: services.map((s) => s.title),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.text, serviceType: s.tags.join(', '), provider: { '@id': ids.business } },
      })),
    },
    potentialAction: { '@type': 'ReserveAction', name: 'Book an intro call', target: site.booking },
    sameAs,
  };

  const website = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: `${site.url}/`,
    name: 'ihor.me',
    alternateName: site.name,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': ids.person },
  };

  const pageId = `${p.url}#webpage`;
  const page: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': pageId,
    url: p.url,
    name: p.title,
    description: p.description,
    inLanguage: 'en',
    isPartOf: { '@id': ids.website },
    primaryImageOfPage: { '@type': 'ImageObject', url: p.ogImage, width: 2400, height: 1260 },
    ...(p.isHome ? { about: { '@id': ids.person }, mainEntity: { '@id': ids.business } } : {}),
    ...(p.modified ? { dateModified: p.modified } : {}),
    ...(p.breadcrumb ? { breadcrumb: { '@id': `${p.url}#breadcrumb` } } : {}),
  };

  const graph: Record<string, unknown>[] = [website, person, business, page];

  if (p.breadcrumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${p.url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: p.breadcrumb, item: p.url },
      ],
    });
  }

  if (p.isHome) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${p.url}#faq`,
      isPartOf: { '@id': pageId },
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
    graph.push({
      '@type': 'ItemList',
      '@id': `${p.url}#work`,
      name: 'Selected work',
      itemListElement: projects.map((pr, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'CreativeWork', name: `${pr.name} website`, url: pr.url, creator: { '@id': ids.person }, ...(pr.industry ? { genre: pr.industry } : {}) },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
