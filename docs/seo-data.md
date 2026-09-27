# Research data pages — SEO notes

Evidence: Google autocomplete, 2026-09-27. No volume tool; confirm in Search Console after launch.

## Intent

"<disease> dataset" queries are dominated by free public datasets (kaggle, github, download, csv).
We target them because that is where the volume is, and qualify the visitor immediately: every
page says the data is governed, research-grade and licensed — not a free download — and answers
"how is this different from public datasets on Kaggle or GitHub?". Commercial-intent phrases
("de-identified EHR data", "real world data EHR", "longitudinal patient database",
"buy medical data") are carried on the `/data` hub.

| Page | Primary query | Secondary |
|---|---|---|
| `/data` | EHR datasets | de-identified EHR data, real world data EHR, longitudinal patient data, buy medical data |
| `/data/ophthalmology` | ophthalmology datasets | diabetic retinopathy dataset, glaucoma dataset, AMD dataset, OCT / retinal image dataset |
| `/data/neurology` | Alzheimer's disease dataset | multiple sclerosis dataset, migraine dataset, myasthenia gravis dataset |
| `/data/nephrology` | chronic kidney disease dataset | CKD dataset, nephrology datasets |
| `/data/respiratory` | COPD dataset | chronic obstructive pulmonary disease dataset, asthma dataset |
| `/data/metabolic` | NASH / MASH dataset | NAFLD / MASLD dataset |
| `/data/immunology` | inflammatory bowel disease dataset | IBD datasets, Crohn's disease dataset, ulcerative colitis dataset |

## Patient figures

Published figures are **rounded down** to two significant figures (under 10,000: to the thousand)
and shown as "N+". Exact counts live only in the internal DIA dataset profiles and are never
committed to this repository. Update `src/content/datasets.ts` when counts change.

## Structured data

Each area page: WebPage, BreadcrumbList, Dataset (`isAccessibleForFree: false`, US coverage) and
FAQPage. The hub adds FAQPage for its FAQ.
