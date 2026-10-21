import type { ImageMetadata } from 'astro';
import doummarPoster from '../assets/stories/doummar-poster.jpg';
import optimalPoster from '../assets/stories/optimal-poster.jpg';
import msPoster from '../assets/stories/ms-transverse-poster.jpg';
import doummarLogo from '../assets/stories/doummar-logo.png';
import optimalLogo from '../assets/stories/optimal-logo.png';
import msLogo from '../assets/stories/ms-transverse-logo.png';

export interface Story {
  client: string;
  industry: string;
  description: string;
  url: string;
  video: string;
  poster: ImageMetadata;
  logo: ImageMetadata;
  logoAlt: string;
  quote: string;
  author: string;
  role: string;
  stats: { value: string; unit: string; label: string }[];
  services: string;
}

export const stories: Story[] = [
  {
    client: 'Doummar MEP Engineering',
    industry: 'Construction',
    description: 'A new site for an MEP contractor that shows decades of engineering work and turns visits into tender invitations.',
    url: 'https://www.doummar.com/',
    video: '/media/story-doummar.mp4',
    poster: doummarPoster,
    logo: doummarLogo,
    logoAlt: 'Doummar MEP Contractors',
    quote: 'Huge thanks to Ihor, he did a fantastic job on our website. Clean design, smooth process, awesome result! Highly recommend!',
    author: 'Antoine-Raphael J. Doummar',
    role: 'Director at DOUMMAR MEP Contractors',
    stats: [
      { value: '+180', unit: '%', label: 'Qualified leads' },
      { value: '3', unit: 'x', label: 'Faster page loads' },
      { value: '6', unit: ' wks', label: 'Brief to launch' },
    ],
    services: 'Web design, Webflow, Figma',
  },
  {
    client: 'Optimal AI',
    industry: 'SaaS',
    description: 'A redesign and migration for an AI code review startup, rebuilt around a clearer product story for engineering leaders.',
    url: 'https://getoptimal.ai/',
    video: '/media/story-optimal.mp4',
    poster: optimalPoster,
    logo: optimalLogo,
    logoAlt: 'Optimal AI',
    quote: 'I’ve worked with a lot of web-developers in the past and Ihor is the best one! I will be keeping him close for the future.',
    author: 'Emanuel Tsiris',
    role: 'Founding Head of Growth & GTM at Optimal AI',
    stats: [
      { value: '+140', unit: '%', label: 'Demo requests' },
      { value: '3', unit: 'x', label: 'Faster page loads' },
      { value: '4', unit: ' wks', label: 'Migration time' },
    ],
    services: 'Redesign, Migration, Webflow',
  },
  {
    client: 'MS Transverse',
    industry: 'B2B services',
    description: 'A full rebuild of a B2B services site, with the structure rewritten around how buyers compare providers and ask for a quote.',
    url: 'https://ms-transverse.webflow.io/',
    video: '/media/story-ms-transverse.mp4',
    poster: msPoster,
    logo: msLogo,
    logoAlt: 'MS Transverse',
    quote: 'He didn’t just follow instructions, he thought about how users will feel it. Ihor is very easy to work with and a good communicator.',
    author: 'Brendan Kelly',
    role: 'Marketing Vice President at MS Transverse',
    stats: [
      { value: '+65', unit: '%', label: 'Time on site' },
      { value: '2', unit: 'x', label: 'Form leads' },
      { value: '0', unit: '', label: 'Broken links' },
    ],
    services: 'UX/UI design, Rebuild, Webflow',
  },
];
