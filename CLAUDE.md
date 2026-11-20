# mastmq.github.io

The mast website. Astro 7, no framework runtime, one page. Served at <https://mastmq.github.io>.

## Files that must never be deleted

Three files in `public/` look like debris and are not. Deleting any of them breaks something silently and slowly, which is the worst failure mode to debug.

| File | Why |
| --- | --- |
| `public/google7bdfbc05c791f975.html` | Google Search Console verification. Search Console **re-checks periodically and silently unverifies** the property if it 404s |
| `public/a11c22e86daf4145d41b5d32ed74f235.txt` | the IndexNow key. Public by design — that is how the protocol works. Removing it invalidates every future submission |
| `public/.nojekyll` | Not needed by the Actions deploy, but Pages runs Jekyll on a branch deploy, and Jekyll ignores directories beginning with `_`, which is exactly where Astro puts bundled assets. If Pages is ever switched back to a branch source (the fallback when a workflow deploy breaks), the site loads unstyled without it |

`public/.indexnow-README` explains the key file to a human who finds it. Keep it next to the key.

## How it deploys

Every push to `main` runs `.github/workflows/deploy.yaml`: `withastro/action` runs `npm run check && npm run build` and uploads `dist/`, and `actions/deploy-pages` publishes it. The Pages source is "GitHub Actions" (`build_type: workflow`). Build output is not in git; `dist/` is ignored.

Until 2026-11-20 the site was served by a branch deploy of a `docs/` folder committed on `main`, because the token available when it was set up could not write `.github/workflows/`. Committed output made diffs noisy and could drift from the source, so it went as soon as a workflow could be pushed. A branch source serves only what is in git, so going back to it for an emergency means committing a build again (into `docs/`, with `outDir` set) and then `gh api -X PUT repos/mastmq/mastmq.github.io/pages -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/docs'`. Switching the source alone takes the site down. Fix the workflow instead where possible.

After pushing, the deploy takes about a minute. Watch it with `gh run watch <id> --exit-status`, then verify with a real request to the live URL rather than assuming.

## Content lives in data, not in markup

`src/data/site.ts` holds the tagline, the headline figures, the comparison table, the four pillars, the install paths, the drill results, the section list the nav is built from, the repo list, the keywords and every cross-repo URL. `src/pages/index.astro` composes them; `src/layouts/Base.astro` reads the same objects to build the metadata.

That is the point: the page and the structured data cannot drift apart. **Adding a claim by typing it into the markup defeats it** — put it in `site.ts`.

## SEO surface

All of it is already wired. When changing the page, keep these intact:

- `site:` in `astro.config.mjs` is what makes the canonical link, `og:url` and the sitemap absolute. Without it `@astrojs/sitemap` emits nothing at all.
- `build.format: 'file'` — plain `.html` rather than directories, so a URL works the same with or without a trailing slash.
- JSON-LD `@graph` in `Base.astro`: `Organization` + `WebSite` + `SoftwareSourceCode`, cross-referenced by `@id` rather than repeated. `SoftwareSourceCode` is the type that carries the language, licence and repository, none of which a crawler can guess from prose.
- `robots.txt` points at `sitemap-index.xml`.
- Google deprecated sitemap ping in 2023. Submission is Search Console (manual) plus IndexNow (Bing, Yandex, Seznam, Naver).

## Layout bugs that are fixed and easy to re-introduce

**Sections put `.wrap` inside, not on, the `<section>`.** `Section.astro` once rendered `<section class="wrap">`, and a `padding` shorthand on `.wrap` silently zeroed `section { padding }`, because a class beats an element selector. The section now spans the page (it has to, for the `.band` background on alternate sections) and holds a `.wrap`. Keep `.wrap` on `padding-inline` anyway: the nav uses it too.

**`white-space: nowrap` is scoped to `tr.mast-row td:first-child`.** On both cells it pushed the comparison table past the viewport. `.table-scroll` also scrolls at every width, not only on a phone.

**`.cards` uses `minmax(min(100%, 330px), 1fr)`.** Plain `minmax(330px, 1fr)` gives three columns and one orphan for four pillars, and forces a horizontal scroll on a phone. The `min()` collapses the track instead.

## The masthead, and where the banner went

The masthead is real text: a visible `<h1>` with `site.tagline`, `site.pitch`, the badges and the buttons, with the mascot beside it, then three figures from `stats` in `site.ts`. It used to be the banner PNG with a hidden `<h1>`, and on a phone that put the tagline at about 6px. Do not put the banner back as the hero.

The banner is still the social card (`og:image` in `Base.astro`), where an image of text is the right answer. Its alt text there must stay `mast — Multi-tenant MQTT broker built on core NATS`, properly cased; `.toLowerCase()` was applied to it once by accident. The mascot is decoration, so its `alt` is empty, and it is hidden under 860px.

The figures in `stats` each come from a row of `drills`. Change them together, or the headline claims more than the table shows.

Below 860px the section links move into a `<details>` menu. A line of inline script closes it after a link is followed; it works without that line.

Testing the light theme: headless Chrome reports a dark OS preference and `--force-prefers-color-scheme=light` does not work. Build, copy `dist/index.html` with `data-theme="light"` on `<html>`, serve it with `npx astro preview`, and delete the copy. Testing phone width: headless Chrome will not make a window narrower than about 500px, so load the page in a 390px `<iframe>` instead.

## Assets

`public/assets/` is **copied** from [`mastmq/.github/assets`](https://github.com/mastmq/.github/tree/main/assets), which is where the brand actually lives. Change them there first, regenerate with `banner.py`, then copy across. Editing them here creates a fork of the brand.

Colours in `:root` at the top of `src/styles/global.css` are sampled from the artwork, not chosen. Treat the `.github` assets README as the source of truth.

## Working on it

```console
$ npm install
$ npm run dev      # http://localhost:4321
$ npm run build    # writes dist/, which is not committed
$ npm run check    # astro check; CI runs it before every deploy
```


## Conventions

Conventional commits, body in prose explaining why. Markdown one paragraph per line.
