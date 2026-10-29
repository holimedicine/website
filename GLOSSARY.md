# Glossary

Key domain terms and technical concepts for `holimedicine-website`.

| Term | Definition |
| :--- | :--- |
| **edukacja** | Collection of educational articles. Managed in `src/content/edukacja/`. |
| **przepisy** | Collection of recipes. Managed in `src/content/przepisy/`. |
| **Keystatic** | CMS used for managing MDX content. |
| **withBase()** | Utility (`src/utils/url.ts`) used to prepend the production base path (`/website/`) to root-relative URLs. MUST be used for all links/assets. |
| **KEYSTATIC_DISABLED** | Environment variable used during `npm run build` to exclude CMS routes from the production build. |
