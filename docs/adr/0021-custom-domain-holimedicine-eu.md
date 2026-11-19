# 0021. Custom domain `holimedicine.eu` at the site root

- Status: Accepted
- Date: 2026-11-19

## Context

The site started as a GitHub Pages **project page** served from
`https://holimedicine.github.io/website/`, which forced a `/website/` base path
(ADR 0007). A dedicated domain, `holimedicine.eu`, is now registered and its zone
is hosted on Cloudflare (Free plan, nameservers delegated, DNS Setup "Full").

GitHub Pages supports custom domains for project pages. Serving the site from
the domain root removes the subpath, so `base` becomes `/` in every environment
and the base-path gotchas largely disappear.

## Decision

Serve the site from `https://holimedicine.eu/`:

- `astro.config.mjs`: `site: 'https://holimedicine.eu'`, `base: '/'` — no
  build-only conditional anymore; dev and production share the root.
- Commit `public/CNAME` containing `holimedicine.eu` so the Pages artifact keeps
  the custom domain even if the repo setting is reset.
- GitHub repo: **Settings → Pages → Custom domain = `holimedicine.eu`**, then
  **Enforce HTTPS** once the certificate is issued.
- Cloudflare DNS for the apex (canonical host):
  - `A @` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
    `185.199.111.153`
  - `CNAME www` → `holimedicine.github.io` (GitHub redirects `www` to the apex)
  - Records stay **DNS only** (grey cloud) while GitHub validates the domain and
    provisions its certificate.
- Keep `withBase()` in place even though the base is now `/`: it is a no-op at
  the root and keeps a future base change a one-line config edit.
- `scripts/check-dist.mjs` defaults to `BASE_PATH=/` and the Playwright suite
  runs against `http://127.0.0.1:4323/`.

## Consequences

- Public URLs are `https://holimedicine.eu/<page>/`, with no `/website/` prefix;
  old `holimedicine.github.io/website/...` links are not redirected.
- Keystatic stays dev-only; nothing about the CMS changes.
- Proxying the records through Cloudflare is optional and can be enabled later,
  but then SSL/TLS mode must be **Full (strict)** — Flexible causes a redirect
  loop with GitHub Pages.
- Supersedes ADR 0007; `withBase()` remains the rule for root-relative
  links/assets.
