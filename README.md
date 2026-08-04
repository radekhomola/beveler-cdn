# Beveler.eu CDN assets

Public static assets for [beveler.eu](https://www.beveler.eu) (Webflow custom CSS/JS).

Hosted via **jsDelivr** from this repo so ISP security filters (e.g. T-Mobile CZ) do not block them — unlike `filedn.eu`.

## Production URLs (jsDelivr)

```text
https://cdn.jsdelivr.net/gh/radekhomola/beveler-cdn@v1.0.0/cdn/site.min.css
https://cdn.jsdelivr.net/gh/radekhomola/beveler-cdn@v1.0.0/cdn/site.min.js
```

Using `@main` also works, but prefer a **version tag** so browsers/CDN cache stay predictable.

## Webflow setup

**Site settings → Custom code → Head code**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/radekhomola/beveler-cdn@v1.0.0/cdn/site.min.css">
```

**Site settings → Custom code → Footer code (before `</body>`)**

```html
<script defer src="https://cdn.jsdelivr.net/gh/radekhomola/beveler-cdn@v1.0.0/cdn/site.min.js"></script>
```

Remove any old `https://filedn.eu/.../site.min.*` links, then publish.

## Update workflow

1. Replace files in `cdn/`
2. Commit & push to `main`
3. Create a new tag, e.g. `v1.0.1`
4. Update the version in Webflow custom code
5. Optional purge: https://www.jsdelivr.com/tools/purge

```bash
git add cdn/
git commit -m "Update site assets"
git push
git tag v1.0.1
git push origin v1.0.1
```

## Source files

| File | Use |
|------|-----|
| `cdn/site.min.css` | production stylesheet |
| `cdn/site.min.js` | production script |
| `cdn/site.css` / `cdn/site.js` | readable sources (optional) |
