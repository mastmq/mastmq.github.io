# mastmq.github.io

The mast website. Astro 7, no framework runtime, one page. Served at <https://mastmq.github.io>.

## Files that must never be deleted

Three files in `public/` look like debris and are not. Deleting any of them breaks something silently and slowly, which is the worst failure mode to debug.

| File | Why |
| --- | --- |
| `public/google7bdfbc05c791f975.html` | Google Search Console verification. Search Console **re-checks periodically and silently unverifies** the property if it 404s |
| `public/a11c22e86daf4145d41b5d32ed74f235.txt` | the IndexNow key. Public by design — that is how the protocol works. Removing it invalidates every future submission |
| `public/.nojekyll` | Pages runs Jekyll on a branch deploy, and Jekyll ignores directories beginning with `_`, which is exactly where Astro puts bundled assets. Without this the site loads unstyled |

`public/.indexnow-README` explains the key file to a human who finds it. Keep it next to the key.

## How it deploys, and why the build output is committed

GitHub Pages serves `docs/` straight from `main`. That is why `astro.config.mjs` sets `outDir: './docs'` and why build output is in git.

**This is a stopgap, not a preference.** Committing build output makes diffs noisy and lets the output drift from the source. It is done this way because a Pages deploy through Actions needs a workflow file, and the token available when this was set up could not write `.github/workflows/`.

To undo it once that is possible: drop `outDir`, add `dist/` to `.gitignore`, delete `docs/`, add a workflow using `withastro/action`. Nothing else changes. `public/.nojekyll` stays either way.

**Practical consequence: `npm run build` is part of every content change.** A commit that edits `src/` without the regenerated `docs/` deploys nothing. Always build, then commit both.

## Content lives in data, not in markup

`src/data/site.ts` holds the tagline, the comparison table, the four pillars, the repo list, the keywords and every cross-repo URL. `src/pages/index.astro` composes them; `src/layouts/Base.astro` reads the same objects to build the metadata.

That is the point: the page and the structured data cannot drift apart. **Adding a claim by typing it into the markup defeats it** — put it in `site.ts`.

## SEO surface

All of it is already wired. When changing the page, keep these intact:

- `site:` in `astro.config.mjs` is what makes the canonical link, `og:url` and the sitemap absolute. Without it `@astrojs/sitemap` emits nothing at all.
- `build.format: 'file'` — plain `.html` rather than directories, so a URL works the same with or without a trailing slash.
- JSON-LD `@graph` in `Base.astro`: `Organization` + `WebSite` + `SoftwareSourceCode`, cross-referenced by `@id` rather than repeated. `SoftwareSourceCode` is the type that carries the language, licence and repository, none of which a crawler can guess from prose.
- `robots.txt` points at `sitemap-index.xml`.
- Google deprecated sitemap ping in 2023. Submission is Search Console (manual) plus IndexNow (Bing, Yandex, Seznam, Naver).

## Three layout bugs that are fixed and easy to re-introduce

**`.wrap` uses `padding-inline`, not the `padding` shorthand.** `Section.astro` renders `<section class="wrap">`. A shorthand on `.wrap` silently zeroes `section { padding: 48px 0 }`, because a class beats an element selector. Sections had never had vertical padding until this was found with an in-browser DOM probe. If you touch `.wrap`, do not reach for `padding`.

**`white-space: nowrap` is scoped to `tr.mast-row td:first-child`.** On both cells it pushed the comparison table past the viewport. `.table-scroll` also scrolls at every width, not only on a phone.

**`.cards` uses `minmax(min(100%, 330px), 1fr)`.** Plain `minmax(330px, 1fr)` gives three columns and one orphan for four pillars, and forces a horizontal scroll on a phone. The `min()` collapses the track instead.

## The banner

The hero is the banner PNG itself, in a `<picture>` with a `prefers-color-scheme: dark` source and 1x/2x `srcset`. The `<h1>` is `.sr-only` — the banner is an image of text, so **its `alt` is the one string a screen reader gets.** Keep it `mast — Multi-tenant MQTT broker built on core NATS`, properly cased; `.toLowerCase()` was applied to it once by accident.

Testing the light variant is awkward: headless Chrome reports a dark OS preference, `--force-prefers-color-scheme=light` does not work, and `data-theme="light"` cannot drive a `<picture>` media query. Exercise the light branch by rewriting the query to `no-preference` in a throwaway copy.

## Assets

`public/assets/` is **copied** from [`mastmq/.github/assets`](https://github.com/mastmq/.github/tree/main/assets), which is where the brand actually lives. Change them there first, regenerate with `banner.py`, then copy across. Editing them here creates a fork of the brand.

Colours in `:root` at the top of `src/styles/global.css` are sampled from the artwork, not chosen. Treat the `.github` assets README as the source of truth.

## Working on it

```console
$ npm install
$ npm run dev      # http://localhost:4321
$ npm run build    # writes docs/ — required before committing
$ npm run check
```

After pushing, Pages takes roughly 45 seconds. Verify with a real request to the live URL rather than assuming.

## Conventions

Conventional commits, body in prose explaining why. Markdown one paragraph per line.
