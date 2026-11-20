# mastmq.github.io

The website for [mast](https://github.com/mastmq/mast), served at [mastmq.github.io](https://mastmq.github.io).

Built with [Astro](https://astro.build).

## Working on it

```console
$ npm install
$ npm run dev      # http://localhost:4321
$ npm run build    # writes dist/
$ npm run check
```

Page content lives in `src/data/site.ts` rather than inside the markup — the comparison table, the four pillars and the repository list are data, and keeping them there means the page and the metadata cannot drift apart. `src/pages/index.astro` composes them.

## How it deploys

Every push to `main` runs `.github/workflows/deploy.yaml`: `withastro/action` type-checks and builds the site, and `actions/deploy-pages` publishes it. The build output is not committed; `dist/` is ignored.

`public/.nojekyll` stays anyway. It costs nothing, and if Pages is ever switched back to deploying from a branch, Jekyll would otherwise drop every directory beginning with an underscore — which is where Astro puts bundled assets.

## Assets

`public/assets/` is copied from [mastmq/.github](https://github.com/mastmq/.github/tree/main/assets), which is where the brand lives. Change them there first, then copy across.

Colours are in `:root` at the top of `src/styles/global.css`, sampled from the logo rather than chosen separately.
