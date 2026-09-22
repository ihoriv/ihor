// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Plain HTML + CSS — no Tailwind, no UI framework. Styling lives in
// src/styles/main.css as class-based rules. https://astro.build/config
export default defineConfig({
  site: 'https://ihor.me',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/style-guide'),
    }),
  ],
});
