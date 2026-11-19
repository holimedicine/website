# Glossary

Key domain terms and technical concepts for `holimedicine-website`.

## Domain terms

| Term | Definition |
| :--- | :--- |
| **edukacja** | Collection of educational articles (`src/content/edukacja/`), rendered as cards on `/edukacja/`; clicking a card opens the education modal. Order comes from the `order` frontmatter field. |
| **education modal** | Native `<dialog>` on `/edukacja/` showing an article's title, teaser, and full MDX body (or a placeholder when the body is empty). See `src/pages/edukacja.astro`. |
| **education deep link** | Hash URL `#edukacja-<slug>` that opens the matching education modal; the slug is derived from the content entry ID. |
| **przepisy** | Collection of recipes (`src/content/przepisy/`), rendered as cards on `/przepisy/`; clicking a card opens the recipe modal. Membership and order come from the `recipes` lists in `Kategorie przepisów`; a recipe may appear in multiple categories or none. |
| **recipe modal** | Native `<dialog>` on `/przepisy/` showing a recipe's cover image, tag, title, summary, and full MDX body (or a placeholder when the body is empty). See `src/pages/przepisy.astro`. |
| **recipe deep link** | Hash URL `#przepis-<slug>` that opens the matching recipe modal and activates its category tab. |
| **Kategorie przepisów** | Keystatic collection (`src/content/kategorie-przepisow/*.json`) that defines the recipe tabs; each entry has a name, tab order, and an ordered list of recipe slugs. See ADR 0014. |
| **na-wynos** | Default recipe category entry (`src/content/kategorie-przepisow/na-wynos.json`); owns its ordered recipe list and is shown as the first "Na wynos" tab. |
| **dania** | Default recipe category entry (`src/content/kategorie-przepisow/dania.json`); owns its ordered recipe list and is shown as the "Dania" tab. |
| **Polecane produkty** | Product and supplement recommendations page (`src/pages/produkty.astro`) backed by the `produkty` and `sekcjeProduktow` collections; card sections open the product modal. |
| **produkty** | Collection of product recommendation entries (`src/content/produkty/*.mdx`), rendered as cards on `/produkty/`; each entry has examples, a summary, optional image/link/details, and an optional MDX body. |
| **sekcjeProduktow** | Keystatic collection (`src/content/sekcje-produktow/*.json`) that defines the `/produkty/` sections: heading, order, display (`cards` or `table`), an ordered product list for cards, or columns/rows for tables. See ADR 0017. |
| **product modal** | Native `<dialog>` on `/produkty/` showing a product's image, examples, summary, extra details, full MDX body, and optional store link. See `src/pages/produkty.astro`. |
| **product deep link** | Hash URL `#produkt-<slug>` that opens the matching product modal; the slug is derived from the content entry ID. |
| **collaboration modal** | Native `<dialog>` on `/wspolpraca/` showing a cooperation area's full description (`body`); the card shows its short `summary`. The dialog ID is derived from the area's position (`#wspolpraca-obszar-<n>`). See `src/pages/wspolpraca.astro`. |
| **Współpraca** | Collaboration page (`/wspolpraca/`, `src/pages/wspolpraca.astro`) backed by the `wspolpraca` singleton: cooperation areas as clickable tiles with modals, principles, steps, an editable contact box, and a header CTA to the collaborator directory. |
| **professions** | Collection of collaborator groups (`src/content/professions/*.json`), one file per profession (Dietetycy, Fizjoterapeuci, Położne, Lekarze); each entry has a title, order, summary, and an ordered `members` list. See ADR 0020. |
| **collaborator directory** | Page at `/wspolpraca/partnerzy/` (`src/pages/wspolpraca/partnerzy.astro`) listing the people the practice works with, grouped into profession accordions. It is reachable from the **nav dropdown** under "Współpraca" and from the **partners CTA** on `/wspolpraca/`. |
| **partners CTA** | Green card-link in the `/wspolpraca/` page header (`partnersCtaLabel` in the `wspolpraca` singleton) that opens the collaborator directory. |
| **collaborator card** | Card inside a profession accordion showing a person's photo or initials avatar, name, role, workplace, bio, and optional profile link. |
| **O nas** | Homepage section (`#o-nas`) backed by the `about` singleton. |
| **Medycyna holistyczna** | Homepage section (`#podejscie`) backed by the `podejscie` singleton; the nav label for it (formerly **Podejście**). The route keeps the `#podejscie` anchor. |
| **Baza wiedzy** | User-facing name of the `/edukacja/` page: its nav label, page-header eyebrow, and `<title>`. The route and the `edukacja` collection keep their original names. |
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
| **modal helper** | Shared client-side dialog controller (`src/scripts/modals.ts`) for opening, closing, and hash-linking edukacja, recipe, and product modals. |
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
| **base path** | Production URL prefix `/website/`; dev uses `/`. See ADR 0007. |
| **withBase()** | Utility (`src/utils/url.ts`) that prepends the base path to root-relative URLs. MUST be used for all links/assets. |
| **nav dropdown** | Translucent link panel under a top-level nav item, opened on hover or keyboard focus with `:hover`/`:focus-within` (no JS). It is mirrored as an indented link in the mobile menu. See `src/components/Nav.astro`. |
| **KEYSTATIC_DISABLED** | Env var set by `npm run build`/`preview` to exclude CMS routes from the static build. |
| **static build** | `npm run build` output in `dist/`, deployed to GitHub Pages; no server runtime. |
| **check-dist** | Post-build validation (`scripts/check-dist.mjs`) that fails on base-path leaks or missing local links/assets in `dist/`. |
| **E2E test** | Playwright test in `tests/e2e/` run against the production build under `/website/`. |
| **content-only commit** | Commit touching only `src/content/**` and `public/images/**`; pre-commit and CI run `build:site` but skip E2E. See ADR 0013. |
