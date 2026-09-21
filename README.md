# mastmq.github.io

The website for [mast](https://github.com/mastmq/mast), served at [mastmq.github.io](https://mastmq.github.io).

Plain HTML and one stylesheet, served straight from `main` by GitHub Pages. There is no build step, no framework and no deploy workflow on purpose: a landing page that needs a toolchain is a landing page that breaks silently when the toolchain moves, and this one changes a few times a year.

## Editing

Edit `index.html` and `style.css`, push to `main`, and Pages redeploys. To see it locally:

```console
$ python3 -m http.server 8000
```

## Assets

`assets/` is copied from [mastmq/.github](https://github.com/mastmq/.github/tree/main/assets), which is where the brand lives. Change them there first, then copy across, so the two cannot drift.

Colours are in `:root` at the top of `style.css`, taken from the logo rather than chosen separately.
