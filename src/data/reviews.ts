import type { ImageMetadata } from 'astro';
import ilias from '../assets/people/ilias-symiakos.jpg';
import jorge from '../assets/people/jorge-casals.jpg';
import shaday from '../assets/people/shaday-el-maghraby.jpg';

export interface Review {
  quote: string;
  name: string;
  role: string;
  photo: ImageMetadata;
  url: string;
  domain: string;
}

export const reviews: Review[] = [
  { quote: 'Top notch. I never thought I would see this type of talent on Upwork. Ihor is super professional, attentive, and gets things done FAST.', name: 'Ilias Symiakos', role: 'Head of Marketing, Solar Wiebe GmbH & Co.', photo: ilias, url: 'https://www.solarwiebe.de/', domain: 'solarwiebe.de' },
  { quote: 'Amazing result, very fast. I am really happy that we started this project. I am sure we will work again in the future on other projects.', name: 'Jorge Casals', role: 'CMO & Product Owner, OVIXIA', photo: jorge, url: 'https://www.ovixia.com/', domain: 'ovixia.com' },
  { quote: 'Brother, I’m speechless. The site is something. I know we always did great projects before, but this one is really special.', name: 'Shaday El-Maghraby', role: 'CEO, MGR Holding', photo: shaday, url: 'https://www.mgrholding.nl/', domain: 'mgrholding.nl' },
];
