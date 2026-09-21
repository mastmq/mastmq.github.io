// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mastmq.github.io',

  // Built output is committed and served by Pages straight from the branch,
  // which is why it lands in docs/ rather than dist/. Pages will only serve
  // the repository root or /docs when deploying from a branch, and a branch
  // deploy needs no workflow.
  //
  // Once this repository can carry a workflow, switch to Actions: set
  // outDir back to the default, gitignore it, and let actions/deploy-pages
  // publish the artifact. Nothing else here has to change.
  outDir: './docs',

  build: {
    // Plain .html files rather than directories, so a URL works the same
    // whether or not Pages adds the trailing slash.
    format: 'file',
  },
});
