# mastmq.github.io

The website for [mast](https://github.com/mastmq/mast), served at [mastmq.github.io](https://mastmq.github.io).

Built with [Astro](https://astro.build).

## Working on it

```console
$ npm install
$ npm run dev      # http://localhost:4321
$ npm run build    # writes docs/
```

Page content lives in `src/data/site.ts` rather than inside the markup — the comparison table, the four pillars and the repository list are data, and keeping them there means the page and the metadata cannot drift apart. `src/pages/index.astro` composes them.

## How it deploys

GitHub Pages serves `docs/` directly from `main`, which is why the build output is committed and why `astro.config.mjs` sets `outDir: './docs'`.

That is a deliberate stopgap, not a preference. Publishing build output to git is something to undo: it makes diffs noisy and lets the committed output drift from the source. It is done this way because a Pages deploy through Actions needs a workflow file, and the token available when this was set up could not write `.github/workflows/`.

To switch once that is possible: drop `outDir` so Astro writes to `dist/`, add `dist/` to `.gitignore`, delete `docs/`, and add a workflow using `withastro/action` or `actions/upload-pages-artifact`. Nothing else here changes.

`public/.nojekyll` stays either way. Pages runs Jekyll on a branch deploy, and Jekyll ignores directories beginning with an underscore — which is where Astro puts bundled assets.

## Assets

`public/assets/` is copied from [mastmq/.github](https://github.com/mastmq/.github/tree/main/assets), which is where the brand lives. Change them there first, then copy across.

Colours are in `:root` at the top of `src/styles/global.css`, sampled from the logo rather than chosen separately.
