# Glossary

Key domain terms and technical concepts for `holimedicine-website`.

## Domain terms

| Term | Definition |
| :--- | :--- |
| **edukacja** | Collection of educational articles (`src/content/edukacja/`), rendered as cards on `/edukacja/` (reachable from the **Baza wiedzy** hub and its nav dropdown); clicking a card opens the education modal. Order comes from the `order` frontmatter field; the author comes from the `author` field (default `Donat Cupiał`). |
| **education modal** | Native `<dialog>` on `/edukacja/` showing an article's title, author, teaser, and full MDX body (or a placeholder when the body is empty). See `src/pages/edukacja.astro`. |
| **education deep link** | Hash URL `#edukacja-<slug>` that opens the matching education modal; the slug is derived from the content entry ID. |
| **przepisy** | Collection of recipes (`src/content/przepisy/`), rendered as cards on `/przepisy/`; clicking a card opens the recipe modal. Membership and order come from the `recipes` lists in `Kategorie przepisów`; a recipe may appear in multiple categories or none. |
| **recipe modal** | Native `<dialog>` on `/przepisy/` showing a recipe's cover image, tag, title, summary, and full MDX body (or a placeholder when the body is empty). See `src/pages/przepisy.astro`. |
| **recipe deep link** | Hash URL `#przepis-<slug>` that opens the matching recipe modal and activates its category tab. |
| **recipe category deep link** | Hash URL `/przepisy/#<category-slug>` that activates the matching category tab; used by the **nav dropdown** under "Przepisy". See ADR 0014. |
| **Kategorie przepisów** | Keystatic collection (`src/content/kategorie-przepisow/*.json`) that defines the recipe tabs; each entry has a name, tab order, and an ordered list of recipe slugs. See ADR 0014. |
| **Suplementy i probiotyki** | Page at `/produkty/` (`src/pages/produkty.astro`; the nav label stays **Polecane produkty**), titled „Suplementy i probiotyki – co mówią badania”. It is backed by the `produktyPage`, `produkty`, and `sekcjeProduktow` collections; card sections open the product modal. Reachable from the **Baza wiedzy** hub and its nav dropdown. |
| **produktyPage** | Singleton (`src/content/produkty-page/index.json`) with the optional header `lead` and the `intro` shown in the box above the product sections; the sentence linking to **Współpraca** is appended by `src/pages/produkty.astro`. |
| **produkty** | Collection of product recommendation entries (`src/content/produkty/*.mdx`), rendered as cards on `/produkty/`; each entry has examples, a summary, optional image/link/details, an optional MDX body, and an `author` field (default `Donat Cupiał`). |
| **sekcjeProduktow** | Keystatic collection (`src/content/sekcje-produktow/*.json`) that defines the `/produkty/` sections: heading, order, display (`cards` or `table`), an ordered product list for cards, or columns/rows for tables. See ADR 0017. |
| **product modal** | Native `<dialog>` on `/produkty/` showing a product's image, title, author, examples, summary, extra details, full MDX body, and optional store link. See `src/pages/produkty.astro`. |
| **product deep link** | Hash URL `#produkt-<slug>` that opens the matching product modal; the slug is derived from the content entry ID. |
| **collaboration modal** | Native `<dialog>` on `/wspolpraca/` showing a cooperation area's full description (`body`); the card shows its short `summary`. The dialog ID is derived from the area's position (`#wspolpraca-obszar-<n>`). See `src/pages/wspolpraca.astro`. |
| **Współpraca** | Collaboration page (`/wspolpraca/`, `src/pages/wspolpraca.astro`) backed by the `wspolpraca` singleton: cooperation areas as clickable tiles with modals, principles, steps, an editable contact box, and a header CTA to the collaborator directory. |
| **professions** | Collection of collaborator groups (`src/content/professions/*.json`), one file per profession (Dietetycy, Fizjoterapeuci, Położne, Lekarze); each entry has a title, order, summary, and an ordered `members` list. Member photos live in `public/images/collaborators/<profession-slug>/` (Keystatic's per-entry asset folder). See ADR 0020. |
| **collaborator directory** | Page at `/wspolpraca/partnerzy/` (`src/pages/wspolpraca/partnerzy.astro`) listing the people the practice works with, grouped into profession accordions. It is reachable from the **nav dropdown** under "Współpraca" and from the **partners CTA** on `/wspolpraca/`. |
| **partners CTA** | Green card-link in the `/wspolpraca/` page header (`partnersCtaLabel` in the `wspolpraca` singleton) that opens the collaborator directory. |
| **collaborator card** | Card inside a profession accordion showing a person's photo or initials avatar, name, role, workplace, bio, and optional profile link. |
| **Start** | Nav link with a house icon (`/`) that leads back to the homepage. It is the first link in both the desktop nav and the mobile menu and is marked current on the homepage. See `src/components/Nav.astro`. |
| **O nas** | Homepage section (`#o-nas`) backed by the `about` singleton. Each doctor is a **profile card** that opens a **profile popup**. |
| **profile card** | Doctor tile in the homepage **O nas** section: role, name, bio clamped to four lines, and a "Czytaj więcej →" label. The whole tile is a button overlay that opens the profile popup. See `src/pages/index.astro`. |
| **profile popup** | Native `<dialog>` opened from a profile card; shows the role, name, optional portrait, full bio, and gallery. Deep link: `#profil-<name-slug>` (e.g. `#profil-donat-cupial`). See ADR 0022. |
| **profile portrait** | Optional `photo`/`photoAlt` pair on a profile in the `about` singleton, rendered between the name and the bio in the profile popup. Separate from the **profile gallery** so personal photos never mix with certificates and documents. Files live in `public/images/o-nas/`. |
| **profile gallery** | Per-doctor `gallery` array in the `about` singleton (`image`, `alt`, `caption`, optional `document`), rendered as a horizontally scrollable strip at the bottom of the profile popup. Images live in `public/images/o-nas/`, documents in `public/dokumenty/`. |
| **Medycyna holistyczna** | Homepage section (`#podejscie`) backed by the `podejscie` singleton; the nav label for it (formerly **Podejście**). The route keeps the `#podejscie` anchor. |
| **Baza wiedzy** | Hub page at `/baza-wiedzy/` (`src/pages/baza-wiedzy.astro`) with two large CTA tiles: **Materiały, które poszerzają świadomość** → `/edukacja/` and **Suplementy i probiotyki – co mówią badania** → `/produkty/`. It is the nav label for the whole knowledge area; both content pages stay at their original routes. See ADR 0023. |
| **Szukaj** | Search page at `/szukaj/` (`src/pages/szukaj.astro`) covering **przepisy**, **edukacja**, and **produkty**. Results appear in a panel under the search field and deep-link into the matching modal. The query is mirrored to `?q=`. Reachable from the nav link with the magnifier icon and from the mobile menu. See ADR 0024. |
| **knowledge tile** | Large gradient link tile on `/baza-wiedzy/` (`.knowledge-tile` inside `.knowledge-grid`), built from the same styles as the **partners CTA**. The whole tile is one `<a>`; it shows a title, description, and an action pill with an arrow. |
| **Zakres opieki** | Homepage section (`#zakres`) backed by the `zakres` singleton. |
| **Kontakt** | Homepage section (`#kontakt`) backed by the `contact` singleton; the nav CTA links here. Contains the visit FAQ accordion and the editable price list. |
| **cennik** | Editable price list in the `contact` singleton (`pricingHeading`, `pricingItems`), rendered under the visit FAQ as a collapsible native `<details>` accordion with rows of name and price; the block is hidden until at least one row exists. |

## Technical terms

| Term | Definition |
| :--- | :--- |
| **ADR** | Architecture Decision Record in `docs/adr/`; see `docs/adr/README.md` for the index and rules. |
| **Astro** | Static site generator used for the site; pages live in `src/pages/`. |
| **content collection** | Astro collection defined in `src/content.config.ts` and loaded from `src/content/`. |
| **rich-text** | Shared typographic styles (`.rich-text` in `src/styles/global.css`) used by edukacja bodies and recipe/product modal content. |
| **modal helper** | Shared client-side dialog controller (`src/scripts/modals.ts`) for opening, closing, and hash-linking edukacja, recipe, product, collaboration, and profile modals. |
| **search index** | Static JSON index built from the `edukacja`, `przepisy`, and `produkty` collections by `src/utils/search-index.ts` and served at `/szukaj/index.json`; fetched only on `/szukaj/`. See ADR 0024. |
| **search matching** | Pure helpers in `src/utils/search-text.ts` (diacritic normalization, token matching, stemming, ranking, snippets) shared by the build-time index and the browser UI. |
| **search page script** | Browser controller for `/szukaj/` (`src/scripts/search-page.ts`): fetches the index, renders grouped results, highlights snippets, and syncs `?q=`. |
| **singleton** | Single fixed content entry backing a homepage section or a standalone page (e.g. Współpraca); a Keystatic singleton read via `getEntry()` from a one-file Astro collection. |
| **Keystatic** | Git-based CMS used to edit content; the admin runs only in dev at `/keystatic/`. |
| **GitHub storage** | Keystatic storage mode that reads and writes content by committing to `holimedicine/website`. |
| **MDX** | Markdown + JSX format used for article, recipe, and some singleton bodies. |
| **local launcher** | `Start Website.command` — macOS double-click script that runs `git pull` and `npm run dev` for content editors. |
| **Tailwind CSS v4** | Styling system used via PostCSS; the theme lives in `src/styles/global.css`. |
| **light theme** | The sage/steel colour system defined by the `@theme` tokens in `src/styles/global.css` (Montserrat headings, Public Sans body). See ADR 0018. |
| **hero banner** | Homepage banner component (`src/components/HeroBanner.astro`) with HTML copy, `public/images/hero-backdrop.svg` as a decorative background, and the logo mark as a separate image so it can reflow below the copy on mobile. |
| **logo mark** | `public/images/logo-mark.svg` — the heart/spine/ECG brand mark used in the hero and as the basis for `public/favicon.svg` and `favicon.ico`. |
| **PostCSS** | CSS pipeline that runs the `@tailwindcss/postcss` plugin (`postcss.config.mjs`). |
| **base path** | URL prefix the site is served from; currently `/` (custom domain `holimedicine.eu`). See ADR 0021. |
| **withBase()** | Utility (`src/utils/url.ts`) that prepends the base path to root-relative URLs. MUST be used for all links/assets. |
| **nav dropdown** | Translucent link panel under a top-level nav item, opened on hover or keyboard focus with `:hover`/`:focus-within` (no JS). It is mirrored as an indented link in the mobile menu. Children normally point at pages; under "Przepisy" they point at **recipe category deep links**. See `src/components/Nav.astro`. |
| **KEYSTATIC_DISABLED** | Env var set by `npm run build`/`preview` to exclude CMS routes from the static build. |
| **static build** | `npm run build` output in `dist/`, deployed to GitHub Pages; no server runtime. |
| **check-dist** | Post-build validation (`scripts/check-dist.mjs`) that fails on base-path leaks or missing local links/assets in `dist/`. |
| **canonical** | `<link rel="canonical">` emitted by `Layout.astro` through `absoluteUrl()` (`src/utils/seo.ts`); always points at `https://holimedicine.eu/` with a trailing slash. See ADR 0025. |
| **Open Graph (OG)** | `og:*` and Twitter Card meta tags in `Layout.astro` used for social previews; the image defaults to `public/images/og-default.jpg` (1200×630). |
| **sitemap** | `sitemap-index.xml` + `sitemap-0.xml` generated by `@astrojs/sitemap` from the configured `site`; `/szukaj/` is excluded because it is `noindex`. See ADR 0025. |
| **robots.txt** | Static `public/robots.txt` that allows crawling and points at the sitemap; not routed through `withBase()` because it is a raw asset. |
| **noindex page** | Page rendered with `<meta name="robots" content="noindex, follow">` via the `noindex` prop on `SiteLayout`; currently `/szukaj/`. |
| **absoluteUrl()** | Helper in `src/utils/seo.ts` that normalizes a path and resolves it against the production `site` origin; used for canonical and OG URLs. |
| **E2E test** | Playwright test in `tests/e2e/` run against the production build at `/`. |
| **content-only commit** | Commit touching only `src/content/**` and `public/images/**`; pre-commit and CI run `build:site` but skip E2E. See ADR 0013. |
