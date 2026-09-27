# Platform pages — SEO keyword map

Keyword choices were based on Google autocomplete suggestions (evidence of real queries) collected
2026-09-27. No search-volume tool was used; **confirm and re-prioritise with Google Search Console
data 4–8 weeks after launch.**

One page per search intent, so pages do not compete with each other:

| Page | Primary query | Secondary queries |
|---|---|---|
| `/platform` | real world data platform / real world data companies | real world data sources, healthcare data for AI |
| `/platform/harm` | data readiness assessment | …for AI, data readiness checklist, data governance readiness assessment, healthcare data readiness |
| `/platform/pia` | clinical trial site selection | site selection criteria for clinical trials, clinical trial feasibility assessment, patient cohort identification |
| `/platform/dia` | healthcare data monetization | who buys healthcare data, sell medical data, healthcare data marketplace, real world evidence data sources |

Avoided on purpose: generic "healthcare data" and "hospital data" — autocomplete shows these are
dominated by job searches ("healthcare data analyst jobs").

## On-page rules applied

- Title ≤ 52 characters before the " | BCONZ" suffix; description ≤ 155 characters.
- Primary query in the H1, the first paragraph and at least one H2 — written as a sentence, not stuffed.
- Each product page answers the query itself (e.g. HARM lists the actual readiness checklist).
- Structured data: WebPage, BreadcrumbList, Service and FAQPage (FAQ answers match visible text).
- Internal links use descriptive anchors ("healthcare data readiness assessment", not "learn more").
- No performance figures or customer claims that cannot be substantiated.

## Follow-ups (not in this change)

1. Submit the updated sitemap in Google Search Console and request indexing for the four pages.
2. `/data` is the natural page for buyer queries ("EHR datasets", "de-identified patient data",
   "medical imaging datasets", "ophthalmology datasets", "multi-omics datasets"); review its copy next.
3. One insight article per primary query (e.g. "A data readiness checklist for healthcare AI"),
   linking to the matching product page.
4. Earn links: partner announcements and conference abstracts that cite the platform pages.
