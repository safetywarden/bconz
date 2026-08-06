# Performance and Accessibility Review

## Routes reviewed

- `/`
- `/data`
- `/solutions`
- `/data-partners`
- `/request-data`
- `/insights`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/_not-found`

## Baseline issues found

- The Insights route was a full client component even though only the search and tag filter required client state.
- The root layout included a no-op client theme wrapper that only wrote a static light theme value.
- The root layout loaded a mono font variable that was not used by rendered content.
- The header logo still used the deprecated `priority` image prop in Next.js 16.
- Some `Image` components using `fill` did not include `sizes`, increasing the chance of oversized image downloads.
- The homepage content did not expose its own `<main>` landmark.
- Forms had field-level errors, but the live status region and native form semantics could be clearer.
- The mobile navigation had basic keyboard support, but lacked `aria-controls` and body scroll containment while open.
- Reduced-motion handling was not explicitly documented in global styles.

## Improvements completed

- Split the interactive Insights filtering into `InsightsFilter`, allowing the rest of the Insights page to render as a Server Component.
- Removed the unused client `ThemeProvider` wrapper from the root layout.
- Removed the dormant client-only `HeroSection` component that was not rendered by the homepage.
- Removed the unused mono font loader and configured the active Geist font with `display: "swap"` and explicit fallbacks.
- Replaced the header logo `priority` prop with the Next.js 16 `preload` image prop.
- Added responsive `sizes` to Insights `Image` components using `fill`.
- Added a `<main>` landmark to the homepage.
- Improved form semantics with `required`, `autoComplete`, `aria-busy`, stable live status IDs, larger checkbox controls and better error associations.
- Added `aria-controls`, scroll containment and decorative SVG hiding for mobile navigation.
- Added global `prefers-reduced-motion` handling and consistent visible focus outlines.
- Kept Web3Forms network calls submit-only.

## Known limitations

- The approved logo artwork is preserved as-is. Some logo source images are still larger than ideal for their rendered dimensions and can be further optimized later.
- Insights article imagery still uses simple SVG placeholder assets because real editorial images are not yet available.
- Browser-based viewport visual review was limited by available automation tooling. HTTP and Lighthouse validation were completed locally.

## Manual testing performed

- Verified public routes return HTTP 200 locally.
- Verified one H1 per reviewed public route.
- Verified `/`, `/data`, `/solutions`, `/data-partners`, `/request-data`, `/insights`, `/about`, `/contact`, `/privacy` and `/terms` expose page content without localhost or staging asset references.
- Verified core image assets return HTTP 200.
- Verified contact and request-data forms still render Web3Forms fields and honeypot markup.
- Verified Lighthouse against a production server for Home, Data, Contact and Request Data.

## Lighthouse results

Measured locally against `next start` on `http://127.0.0.1:3102`.

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| `/` | 93 | 100 | 100 | 100 | 3.1 s | 0 | 80 ms |
| `/data` | 94 | 96 | 100 | 100 | 3.0 s | 0 | 80 ms |
| `/contact` | 92 | 96 | 100 | 100 | 3.1 s | 0 | 170 ms |
| `/request-data` | 93 | 96 | 100 | 100 | 3.1 s | 0 | 110 ms |

## Recommended future monitoring

- Re-run Lighthouse on the deployed production URL after DNS/CDN caching is active.
- Add periodic link and asset checks before launch.
- Replace oversized placeholder/editorial images with final optimized WebP or AVIF assets.
- Consider a lightweight bundle analyzer command if future dependencies are added.
