// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // site is what makes the canonical link, the og:url and the sitemap
  // absolute. Without it the sitemap integration emits nothing at all.
  site: 'https://mastmq.github.io',

  integrations: [sitemap()],

  build: {
    // Plain .html files rather than directories, so a URL works the same
    // whether or not Pages adds the trailing slash.
    format: 'file',
  },
});
