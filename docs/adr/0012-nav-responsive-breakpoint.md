# 0012. Responsive nav breakpoint and mobile CTA

- Status: Accepted
- Date: 2026-10-29
- Amended: 2026-11-15 — the brand became a 40px Instagram icon, the CTA grew to
  fit the plus icon, and two labels were renamed. Re-measured minimum is ~813px,
  so the 900px breakpoint still holds; see ADR 0018.
- Amended: 2026-11-16 — a seventh link ("Współpraca") raised the minimum to
  ~900px, so the breakpoint moved to 1000px; see ADR 0019.

## Context

The nav switched to the hamburger below 1300px, a value inherited from the legacy
hand-written site when the nav had eight links (including Galeria and Opinie).
Those pages were removed (ADR 0009), leaving six links: O nas, Medycyna
holistyczna, Zakres opieki, Przepisy, Baza wiedzy, Polecane produkty.

The 1300px breakpoint therefore hid the desktop nav far too early. Measured in
Chrome with the web fonts loaded, the row needs:

| Part                    | Width   |
| ----------------------- | ------- |
| Instagram icon          | 40px    |
| Links + gaps            | 559px   |
| CTA (with plus icon)    | 134px   |
| Flex gaps (2 × 16px)    | 32px    |
| Side padding (2 × 24px) | 48px    |
| **Minimum viewport**    | **813px** |

At 901px the row fits with room to spare (measured in Chrome with web fonts
loaded); the original 164px brand and 823px minimum are historical.

## Decision

Lower the nav breakpoint to `max-width: 900px` in `src/styles/global.css`, leaving
about 77px of headroom for scrollbars and font-rendering differences. Below
900px the header shows only the brand and hamburger, and the header CTA is hidden
because the mobile menu already contains its own "Umów wizytę" link.

## Consequences

- The full nav is visible from 901px up, instead of only above 1300px.
- Below 900px the CTA is reachable only through the mobile menu, so that link
  must stay in `Nav.astro`.
- Adding, removing, or renaming nav links changes the required width; re-measure
  before assuming 900px still fits.
- Both desktop and mobile link copies keep working with the active-state and
  scroll-spy logic from ADR 0010.
