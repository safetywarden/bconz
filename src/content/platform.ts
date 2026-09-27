import type { IconName } from "@/components/ui/icon";

/**
 * BCONZ platform content: HARM, PIA and DIA.
 *
 * Each product page targets one search intent (see docs/seo-platform.md):
 *   HARM -> "data readiness assessment"
 *   PIA  -> "clinical trial site selection"
 *   DIA  -> "healthcare data monetization"
 * Copy states only what the capabilities actually do. No performance figures.
 */

export type PlatformSlug = "harm" | "pia" | "dia";

export type ProductContent = {
  slug: PlatformSlug;
  name: string;
  full: string;
  icon: IconName;
  audience: string;
  /** One sentence for cards; also the meta description's opening. */
  card: string;
  h1: string;
  intro: string[];
  capabilities: string[];
  outputs: string[];
  /** Keyword-led content sections. */
  sections: Array<{ heading: string; body?: string; bullets?: string[] }>;
  faqs: Array<{ q: string; a: string }>;
  cta: { label: string; href: string };
  related: PlatformSlug[];
};

export const products: ProductContent[] = [
  {
    slug: "harm",
    name: "HARM",
    full: "Healthcare data readiness assessment",
    icon: "governance",
    audience: "For hospitals, laboratories and data partners",
    card: "A healthcare data readiness assessment that runs inside your own systems and shows what your data can support for research and AI — without the data leaving.",
    h1: "Healthcare data readiness assessment for research and AI",
    intro: [
      "Before a hospital or laboratory enters a research data partnership, it needs to know what its data can actually support. HARM is BCONZ's data readiness assessment: it reads your data exports inside your own environment and produces a readiness report on patients, longitudinal follow-up, coding and identifiers.",
      "It is read-only by design. HARM blocks network use in the tool itself, never copies or moves patient data, and never writes patient values into its report — so your IT and governance teams can verify the assessment is safe before anything is shared.",
    ],
    capabilities: [
      "Runs read-only on your own systems; network use is blocked in the tool itself",
      "Measures patients, visits and real longitudinal follow-up",
      "Shows whether diagnoses, drugs and labs are coded or free text",
      "Flags columns carrying identifiers that must be removed before research use",
      "Assesses whether tables can map to a research data model",
    ],
    outputs: ["Readiness report", "Longitudinal depth", "Coding and identifier review", "Cohort floor counts"],
    sections: [
      {
        heading: "What a data readiness assessment checks",
        body: "A research-ready dataset is more than a large one. HARM's data readiness checklist covers the questions a data partnership actually turns on:",
        bullets: [
          "Volume: how many patients, visits and clinical records exist",
          "Longitudinal depth: how many patients have two or more visits, and the median follow-up span",
          "Coding: whether diagnoses (e.g. ICD), medications and laboratory results are coded or free text",
          "Identifiers: which columns hold direct or quasi-identifiers that must be removed before research use",
          "Structure: whether tables can be linked by patient and visit and mapped to a research data model",
          "Cohort floor counts: patients matching given diagnosis terms, reported as a floor, not a clinical cohort",
        ],
      },
      {
        heading: "Data readiness for AI",
        body: "Healthcare AI projects fail most often on the data, not the model: too little follow-up to define outcomes, labels trapped in free text, or identifiers that block access. A data readiness assessment for AI surfaces those issues before a model development or validation project is scoped.",
      },
      {
        heading: "A governance-first assessment",
        body: "HARM is also a data governance readiness assessment. Because it counts identifier columns and never outputs their values, it gives governance and ethics committees an evidence base for de-identification planning without exposing patient information during the assessment itself.",
      },
    ],
    faqs: [
      { q: "What is a healthcare data readiness assessment?", a: "It is a structured review of whether a healthcare dataset can support a specific kind of research — measuring volume, longitudinal follow-up, coding quality, identifiers and structure — before a partnership or project is committed to." },
      { q: "Does HARM send our data to BCONZ?", a: "No. HARM runs on your own systems, blocks network use, and writes only aggregate counts to a report that you review before choosing whether to share it." },
      { q: "What file formats does HARM read?", a: "Delimited exports such as CSV and TSV, and Excel workbooks where the environment supports them." },
      { q: "Is the cohort count a guarantee of eligible patients?", a: "No. Cohort counts are a floor based on diagnosis text and code matching only, with no clinical adjudication or eligibility criteria applied. The report says so explicitly." },
    ],
    cta: { label: "Request a data readiness assessment", href: "/contact" },
    related: ["dia", "pia"],
  },
  {
    slug: "pia",
    name: "PIA",
    full: "Provider Intelligence Agent",
    icon: "partnership",
    audience: "For life sciences, CRO and research teams",
    card: "Evidence-led clinical trial site selection and data partner identification: find the providers most likely to hold the patients and data a study needs.",
    h1: "Clinical trial site selection and data partner identification",
    intro: [
      "Choosing the right sites and data partners decides whether a study recruits and whether a dataset can be assembled. PIA — BCONZ's Provider Intelligence Agent — turns a research requirement into a universe of candidate hospitals, research sites and provider networks, built from public trial, publication and provider evidence.",
      "Each candidate is ranked with stated rationale and visible evidence. Where public evidence cannot establish something — such as the number of eligible patients — PIA reports it as unknown rather than estimating it.",
    ],
    capabilities: [
      "Turns a data requirement into a candidate provider universe",
      "Draws on public trial, publication and provider evidence",
      "Ranks with stated rationale and visible evidence states",
      "Reports unknowns as unknown — no imputed patient counts",
    ],
    outputs: ["Provider shortlist", "Evidence per provider", "Market and country view"],
    sections: [
      {
        heading: "Clinical trial site selection criteria, evidenced",
        body: "Common site selection criteria for clinical trials include experience in the indication, an active research programme, access to the right patient population and the ability to support data sharing. PIA evidences each from public sources so the shortlist can be defended:",
        bullets: [
          "Prior and current trials in the indication, from trial registries",
          "Published research output in the disease area",
          "Country and market footprint",
          "An explicit evidence state for every score, including where evidence is absent",
        ],
      },
      {
        heading: "Clinical trial feasibility assessment",
        body: "A feasibility assessment asks whether a study can be run where it is planned. PIA supports the site and partner side of that question — which providers are credible candidates, and why — so feasibility conversations start from evidence rather than a list of names.",
      },
      {
        heading: "Patient cohort identification through the right partners",
        body: "Identifying a patient cohort starts with identifying the organisations that hold it. PIA shortlists the providers; HARM can then assess what each partner's data can actually support.",
      },
    ],
    faqs: [
      { q: "What is clinical trial site selection?", a: "It is the process of choosing the hospitals and research sites that will run a study, based on criteria such as experience in the indication, patient access and operational capacity." },
      { q: "Does PIA estimate how many eligible patients a site has?", a: "No. Public evidence rarely supports a reliable count, so PIA reports it as unknown. Patient numbers come from the partner's own data, for example through a HARM readiness assessment." },
      { q: "Which markets does PIA cover?", a: "PIA builds its provider universe from international public trial and publication evidence, with country filters for the markets a study targets." },
    ],
    cta: { label: "Discuss a site or partner search", href: "/contact" },
    related: ["harm", "dia"],
  },
  {
    slug: "dia",
    name: "DIA",
    full: "Demand Intelligence Agent",
    icon: "research",
    audience: "For hospitals, laboratories and data partners",
    card: "Responsible healthcare data monetization starts with demand: DIA shows who has published a need for data like yours, and which of their needs your dataset meets.",
    h1: "Healthcare data monetization, driven by published research demand",
    intro: [
      "Who buys healthcare data, and what do they actually need? Research teams answer that question themselves — in the limitations sections of their papers, in their funded grants, and in the countries their trials cannot reach. DIA, BCONZ's Demand Intelligence Agent, reads that published demand and matches it against a specific dataset.",
      "For a data partner, that turns healthcare data monetization from a guess into an evidence-led conversation: named organisations, the verbatim need they stated, and a need-by-need check of whether your data meets it — through governed, institution-led partnerships, never a data sale.",
    ],
    capabilities: [
      "Searches by disease, drug, biomarker, data type, population or organisation",
      "Covers Europe PMC, ClinicalTrials.gov, NIH, EU CTIS and CORDIS, UK ISRCTN and UKRI",
      "Matches each stated need to a dataset: met, not met, or not known",
      "Scores that do not separate organisations are shown as flags, not numbers",
      "Contacts limited to details published for contact, each with its source and lawful basis",
    ],
    outputs: ["Ranked demand with verbatim evidence", "Dataset-to-buyer fit", "Provenance-first contacts"],
    sections: [
      {
        heading: "Who needs healthcare data — in their own words",
        body: "DIA searches for stated data gaps rather than topics. A paper that says its findings came from a single centre, need external validation, or lack under-represented populations is a research team describing the data it needs next. DIA records the exact sentence, the organisation and the date.",
      },
      {
        heading: "Real-world data sources DIA reads",
        bullets: [
          "Published research limitations in Europe PMC",
          "Active funded programmes: NIH RePORTER (US), CORDIS Horizon Europe (EU), UKRI Gateway to Research (UK)",
          "Live trials and their site footprints: ClinicalTrials.gov, EU CTIS, ISRCTN",
        ],
      },
      {
        heading: "Matching demand to your dataset",
        body: "Describe a dataset — its diseases, data types, patients, sites, follow-up and origin — and DIA checks every stated need against it. Longer follow-up, a multi-site cohort, imaging, EHR or real-world data: each is marked met, not met or not known, so nobody pitches a dataset for a need it cannot fill.",
      },
      {
        heading: "Responsible healthcare data monetization",
        body: "DIA never guesses email addresses, scrapes social profiles or uses purchased lists. Contacts are limited to details published so people could be contacted, each stored with its source and lawful basis, and opt-outs are honoured across every search and export.",
      },
    ],
    faqs: [
      { q: "Who buys healthcare data?", a: "Pharmaceutical and biotechnology companies, contract research organisations, healthcare AI developers and academic research groups — typically to support drug development, real-world evidence, model training and validation, or population research. DIA identifies the specific organisations whose published work states a need." },
      { q: "Is DIA a healthcare data marketplace?", a: "No. DIA does not list or sell data. It identifies research demand so that data partners and BCONZ can pursue governed, institution-led collaborations where the data stays under the partner's control." },
      { q: "Where does the demand evidence come from?", a: "Public sources only: published limitations in research papers, active grants from NIH, the European Commission and UKRI, and live trials in ClinicalTrials.gov, the EU Clinical Trials Information System and ISRCTN." },
      { q: "How are contacts handled?", a: "Only details published so people could be contacted — such as a paper's corresponding author or a trial's listed study contact — are recorded, together with the source and the lawful basis for using them." },
    ],
    cta: { label: "See demand for your data", href: "/contact" },
    related: ["harm", "pia"],
  },
];

export const productBySlug = (slug: PlatformSlug) => products.find((p) => p.slug === slug)!;
