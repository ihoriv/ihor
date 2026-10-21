import type { ImageMetadata } from 'astro';
import doummar from '../assets/work/doummar.jpg';
import noticezero from '../assets/work/noticezero.jpg';
import bluelight from '../assets/work/bluelight.jpg';
import breskul from '../assets/work/breskul.jpg';
import marsanz from '../assets/work/marsanz.jpg';
import shaday from '../assets/work/shaday.jpg';
import brightlabs from '../assets/work/brightlabs.jpg';
import sps from '../assets/work/sps.jpg';

export interface Project {
  name: string;
  url: string;
  image: ImageMetadata;
  alt: string;
  industry?: string;
  services?: string;
  featured: boolean;
}

export const projects: Project[] = [
  { name: 'Doummar MEP Engineering', url: 'https://www.doummar.com/', image: doummar, alt: 'Doummar MEP Engineering website on a tablet', industry: 'Construction', services: 'Strategy · Design · Build · CMS setting', featured: true },
  { name: 'NoticeZero', url: 'https://noticezero.webflow.io/', image: noticezero, alt: 'NoticeZero website', industry: 'B2B SaaS', services: 'Strategy · UX · Webflow build · CMS settings · SEO', featured: true },
  { name: 'BlueLight', url: 'https://www.bluelightairlines.org/', image: bluelight, alt: 'BlueLight website', industry: 'Humanitarian', services: 'Webflow build · Design system', featured: true },
  { name: 'BreskulPeak', url: 'https://breskulpeak.webflow.io/', image: breskul, alt: 'BreskulPeak website', industry: 'B2B, Crypto', services: 'UX · Design · Webflow build · GSAP · CMS', featured: true },
  { name: 'Marsanz Built', url: 'https://marsanzbuilt.com/', image: marsanz, alt: 'Marsanz Built website', featured: false },
  { name: 'Shaday El-Maghraby', url: 'https://www.mgrholding.nl/', image: shaday, alt: 'Shaday El-Maghraby website', featured: false },
  { name: 'BrightLabs', url: 'https://www.brightlabs.nl/', image: brightlabs, alt: 'BrightLabs website', featured: false },
  { name: 'SPS Kitchen', url: 'https://www.spskitchen.com/', image: sps, alt: 'SPS Kitchen website', featured: false },
];

/** Order of the works on the curved hero band. */
export const heroWorks = ['Doummar MEP Engineering', 'Marsanz Built', 'NoticeZero', 'Shaday El-Maghraby', 'BrightLabs', 'BreskulPeak', 'BlueLight', 'SPS Kitchen'].map(
  (n) => projects.find((p) => p.name === n)!,
);
