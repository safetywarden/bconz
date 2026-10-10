/**
 * Disease-area dataset pages under /data.
 *
 * Target queries (Google autocomplete, 2026-09-27; see docs/seo-data.md):
 * "<disease> dataset" and "<specialty> datasets". Those results are dominated by
 * free public datasets (Kaggle, GitHub), so every page states plainly that these
 * are governed, research-grade datasets licensed through partnerships -- which
 * qualifies commercial buyers and answers the "vs public datasets" question.
 *
 * Claims are limited to what is true today: US EMR/EHR data in these areas.
 * Only disease areas and indications are published -- no patient figures (the
 * cohort for each study is confirmed in feasibility). Data types beyond EHR are
 * "may include", also confirmed in feasibility.
 */

export type AreaSlug = "ophthalmology" | "neurology" | "nephrology" | "respiratory" | "metabolic" | "immunology" | "imaging";

export type DatasetArea = {
  slug: AreaSlug;
  name: string;
  title: string;          // <= 52 chars before " | BCONZ"
  description: string;    // <= 155 chars
  keywords: string[];
  h1: string;
  /** Indications available in this area. No patient figures are published. */
  diseases: Array<{ name: string }>;
  intro: string;
  uses: Array<{ title: string; text: string }>;
  dataTypes: string[];
  faqs: Array<{ q: string; a: string }>;
  /** Defaults suit the US EHR areas; the imaging area overrides them. */
  listHeading?: string;
  sourceNote?: string;
  /** Unnamed partner archives, described without figures. */
  partnerNote?: string;
  /** Dataset structured data; omitted where no single country applies. */
  coverage?: string;
};

const SHARED_FAQS = (area: string) => [
  {
    q: `How large is the ${area} cohort for my study?`,
    a: "Cohort size depends on your study's criteria. It is confirmed during feasibility, together with follow-up and the data types available. Tell us your criteria through the research data request form.",
  },
  {
    q: `How are these ${area} datasets different from public datasets on Kaggle or GitHub?`,
    a: "Public datasets are valuable for learning and benchmarking, but they are usually small, single-source, fixed snapshots with limited clinical context and no route to more data. BCONZ datasets are research-grade, de-identified and licensed through governed partnerships, with longitudinal records and a feasibility step to confirm the cohort fits your study before any agreement.",
  },
  {
    q: "Is this a free dataset download?",
    a: "No. Access is licensed for a defined research or development purpose under a data use agreement, after a feasibility review. Tell us what you need through the research data request form.",
  },
  {
    q: "Where does the data come from?",
    a: "From US healthcare data partners, and from partner networks in other regions where a study needs them. Data is de-identified before research use and stays governed by the partner's agreement.",
  },
];

export const areas: DatasetArea[] = [
  {
    slug: "ophthalmology",
    name: "Ophthalmology",
    title: "Ophthalmology Datasets: AMD, DR and Glaucoma",
    description: "Research-grade US ophthalmology datasets for age-related macular degeneration, diabetic retinopathy and glaucoma, licensed for research and AI.",
    keywords: ["ophthalmology datasets", "diabetic retinopathy dataset", "glaucoma dataset", "amd dataset", "retinal image dataset", "oct dataset"],
    h1: "Ophthalmology datasets for AMD, diabetic retinopathy and glaucoma research",
    diseases: [{ name: "Age-related macular degeneration (AMD)" }, { name: "Diabetic retinopathy" }, { name: "Glaucoma" }],
    intro: "Eye disease research depends on long follow-up and, increasingly, on imaging. BCONZ provides governed, de-identified US ophthalmology datasets for age-related macular degeneration, diabetic retinopathy and glaucoma — for real-world evidence, disease progression studies and the development and validation of retinal AI.",
    uses: [
      { title: "Retinal AI development and external validation", text: "Train or externally validate diabetic retinopathy, AMD or glaucoma models on real-world data from outside the development cohort." },
      { title: "Disease progression", text: "Study progression from early to advanced AMD, or visual field and structural change in glaucoma, over longitudinal follow-up." },
      { title: "Treatment patterns and outcomes", text: "Real-world use and outcomes of anti-VEGF therapy, glaucoma medication and surgery." },
      { title: "Screening programmes", text: "Evidence for diabetic retinopathy screening pathways and referral outcomes." },
    ],
    dataTypes: ["Longitudinal EHR (diagnoses, procedures, medications)", "Visual acuity and intraocular pressure", "Retinal imaging such as OCT and fundus photographs, where available", "Treatment and procedure history"],
    faqs: [
      { q: "Do the ophthalmology datasets include retinal images (OCT or fundus)?", a: "Imaging availability varies by partner and is confirmed during feasibility, together with how images link to the clinical record." },
      ...SHARED_FAQS("ophthalmology"),
    ],
  },
  {
    slug: "neurology",
    name: "Neurology",
    title: "Neurology Datasets: Alzheimer's, MS and Migraine",
    description: "Research-grade US neurology datasets for Alzheimer's disease, multiple sclerosis, migraine and myasthenia gravis, licensed for research and AI.",
    keywords: ["alzheimer's disease dataset", "multiple sclerosis dataset", "migraine dataset", "myasthenia gravis dataset", "neurology datasets"],
    h1: "Neurology datasets for Alzheimer's disease, multiple sclerosis, migraine and myasthenia gravis",
    diseases: [{ name: "Migraine" }, { name: "Multiple sclerosis" }, { name: "Alzheimer's disease and related dementias" }, { name: "Myasthenia gravis" }],
    intro: "Neurological diseases unfold over years, so the questions that matter — progression, relapse, treatment response — need longitudinal data. BCONZ provides governed, de-identified US neurology datasets for Alzheimer's disease and related dementias, multiple sclerosis, migraine and myasthenia gravis.",
    uses: [
      { title: "Real-world treatment effectiveness", text: "Outcomes and persistence on disease-modifying therapies in MS, preventive treatments in migraine, and novel therapies in myasthenia gravis." },
      { title: "Disease progression and natural history", text: "Cognitive decline and care pathways in Alzheimer's disease; relapse and disability trajectories in MS." },
      { title: "Rare disease evidence", text: "Myasthenia gravis cohorts for natural history and external comparator work, where a single centre rarely has enough patients." },
      { title: "Model development and validation", text: "Risk and progression models validated on real-world populations beyond trial cohorts." },
    ],
    dataTypes: ["Longitudinal EHR (diagnoses, encounters, medications)", "Procedures and specialist visits", "Brain MRI, where available", "Laboratory results"],
    faqs: SHARED_FAQS("neurology"),
  },
  {
    slug: "nephrology",
    name: "Nephrology",
    title: "Chronic Kidney Disease Datasets for Research",
    description: "Research-grade US nephrology and chronic kidney disease datasets with longitudinal labs and outcomes, licensed for research, RWE and AI.",
    keywords: ["chronic kidney disease dataset", "ckd dataset", "nephrology datasets", "kidney disease data"],
    h1: "Chronic kidney disease and nephrology datasets",
    diseases: [{ name: "Chronic kidney disease (CKD)" }],
    intro: "Chronic kidney disease research is built on repeated laboratory measures over time — eGFR, albuminuria and the treatments that change their course. BCONZ provides governed, de-identified US nephrology datasets for CKD progression, outcomes and treatment research.",
    uses: [
      { title: "CKD progression", text: "eGFR trajectories and time to kidney replacement therapy in real-world populations." },
      { title: "Cardio-renal-metabolic outcomes", text: "Real-world evidence for SGLT2 inhibitors, GLP-1 receptor agonists and other therapies across kidney, heart and metabolic endpoints." },
      { title: "Risk prediction", text: "Development and validation of CKD risk models on longitudinal laboratory data." },
      { title: "Comorbidity and care pathways", text: "Diabetes, hypertension and heart failure alongside CKD." },
    ],
    dataTypes: ["Longitudinal laboratory results (eGFR, creatinine, albuminuria)", "Diagnoses and comorbidities", "Medications and treatment history", "Encounters and procedures"],
    faqs: SHARED_FAQS("chronic kidney disease"),
  },
  {
    slug: "respiratory",
    name: "Respiratory",
    title: "COPD and Asthma Datasets for Research",
    description: "Research-grade US EHR datasets for COPD and asthma, with longitudinal treatment and exacerbation history, licensed for research, RWE and AI.",
    keywords: ["copd dataset", "chronic obstructive pulmonary disease dataset", "asthma dataset", "respiratory datasets"],
    h1: "COPD and asthma datasets",
    diseases: [{ name: "Chronic obstructive pulmonary disease (COPD)" }, { name: "Asthma" }],
    intro: "Respiratory trials enrol tightly selected patients; most people with COPD or asthma would not qualify. Real-world data shows how treatments perform in practice — across exacerbations, healthcare use and comorbidity. BCONZ provides governed, de-identified US EHR datasets for COPD and asthma.",
    uses: [
      { title: "Comparative effectiveness", text: "Real-world outcomes of inhaled therapies and biologics in routine COPD and asthma care." },
      { title: "Exacerbations and healthcare use", text: "Emergency visits, hospitalisation and oral corticosteroid use over time." },
      { title: "Trial generalisability", text: "How trial-eligible patients compare with the wider COPD and asthma populations." },
      { title: "Asthma–COPD overlap and phenotypes", text: "Identifying and following severe, uncontrolled or overlapping disease." },
    ],
    dataTypes: ["Longitudinal EHR (diagnoses, encounters)", "Prescriptions and inhaler therapy", "Exacerbations and hospital visits", "Laboratory and lung function results, where available"],
    faqs: SHARED_FAQS("COPD and asthma"),
  },
  {
    slug: "metabolic",
    name: "Metabolic",
    title: "MASH (NASH) Datasets for Research and AI",
    description: "Research-grade US EHR datasets for MASH (formerly NASH), with longitudinal liver labs and comorbidity history, licensed for research and AI.",
    keywords: ["mash dataset", "nash dataset", "nafld dataset", "masld dataset", "metabolic liver disease data"],
    h1: "MASH (NASH) and metabolic liver disease datasets",
    diseases: [{ name: "Metabolic dysfunction-associated steatohepatitis (MASH, formerly NASH)" }],
    intro: "MASH — metabolic dysfunction-associated steatohepatitis, formerly NASH — is a fast-moving development area, and real-world evidence on how patients progress and are treated is still thin. BCONZ provides governed, de-identified US EHR datasets for MASH research, drug development and model building.",
    uses: [
      { title: "Natural history and progression", text: "Liver enzyme and fibrosis-marker trajectories, and progression towards cirrhosis, over longitudinal follow-up." },
      { title: "Real-world treatment evidence", text: "Use and outcomes of newly approved MASH therapies and metabolic treatments such as GLP-1 receptor agonists." },
      { title: "Cardio-metabolic comorbidity", text: "Type 2 diabetes, obesity, dyslipidaemia and cardiovascular disease alongside MASH." },
      { title: "Patient identification", text: "Non-invasive markers and risk scores to find under-diagnosed patients for studies and trials." },
    ],
    dataTypes: ["Longitudinal laboratory results (liver enzymes, lipids, HbA1c)", "Diagnoses and comorbidities", "Medications and treatment history", "Imaging and elastography, where available"],
    faqs: [
      { q: "Do the datasets use the new MASH / MASLD terminology?", a: "Records use the diagnosis codes in place at the time of care, so older records typically refer to NASH or NAFLD. Cohorts are defined across both the older and newer terminology." },
      ...SHARED_FAQS("MASH"),
    ],
  },
  {
    slug: "immunology",
    name: "Immunology",
    title: "IBD Datasets: Crohn's Disease and Ulcerative Colitis",
    description: "Research-grade US EHR datasets for inflammatory bowel disease, including Crohn's disease and ulcerative colitis, licensed for research and AI.",
    keywords: ["inflammatory bowel disease dataset", "ibd datasets", "crohn's disease dataset", "ulcerative colitis dataset"],
    h1: "Inflammatory bowel disease datasets: Crohn's disease and ulcerative colitis",
    diseases: [{ name: "Inflammatory bowel disease (Crohn's disease and ulcerative colitis)" }],
    intro: "IBD treatment has moved through several generations of therapy, and patients often switch between them. Understanding sequencing, persistence and outcomes needs longitudinal real-world data. BCONZ provides governed, de-identified US EHR datasets for inflammatory bowel disease, including Crohn's disease and ulcerative colitis.",
    uses: [
      { title: "Treatment sequencing and persistence", text: "Switching between conventional, biologic and small-molecule therapies." },
      { title: "Real-world effectiveness and safety", text: "Outcomes, flares, hospitalisation and surgery across therapy classes in routine care." },
      { title: "Disease course", text: "Progression, complications and healthcare use in Crohn's disease and ulcerative colitis." },
      { title: "Patient stratification", text: "Identifying subgroups for trial design and targeted development." },
    ],
    dataTypes: ["Longitudinal EHR (diagnoses, encounters)", "Medications and therapy switching", "Laboratory results and inflammatory markers", "Procedures, endoscopy and surgery"],
    faqs: SHARED_FAQS("inflammatory bowel disease"),
  },
  {
    slug: "imaging",
    name: "Medical imaging",
    title: "Medical Imaging Datasets with Reports",
    description: "De-identified medical imaging datasets with clinical reports: X-ray, CT, MRI, ultrasound and echo, licensed for imaging AI and research. Early access open.",
    keywords: ["medical imaging datasets", "medical imaging dataset for ai", "chest x-ray dataset", "ct dataset", "mri dataset", "ultrasound dataset", "echocardiography dataset", "radiology report dataset"],
    h1: "Medical imaging datasets with reports, for imaging AI and research",
    diseases: [{ name: "X-ray" }, { name: "CT" }, { name: "MRI" }, { name: "Ultrasound" }, { name: "Echocardiography" }],
    listHeading: "Modalities",
    partnerNote: "An Indian archive of X-ray, CT and MRI studies from 2016 to 2025, almost all paired with the radiologist's report.",
    sourceNote: "Early access through BCONZ partner networks in the United States and India. Modalities, volume and population for each project are confirmed during feasibility.",
    coverage: "",
    intro: "Imaging AI is limited less by model design than by data: too few studies, too little clinical text, and populations that look alike. BCONZ is opening governed access to de-identified medical imaging datasets with the clinical report, from partner networks in the United States and India, for training, external validation and imaging research. Early access is open now.",
    uses: [
      { title: "Training and fine-tuning", text: "Imaging studies with reports for developing and improving imaging-AI models." },
      { title: "External validation", text: "Test a model on studies and populations outside its development data, before submission or deployment." },
      { title: "Image–report pairs", text: "Images linked to their clinical reports, for vision-language models, report generation and label creation." },
      { title: "Targeted cohorts", text: "Cohorts defined from report text, such as a finding, body area or modality, confirmed during feasibility." },
    ],
    dataTypes: ["DICOM images, de-identified at header and pixel level before release", "Clinical reports linked to each study", "Study metadata such as modality and body area", "Clinical context from linked records, where available"],
    faqs: [
      { q: "Which imaging modalities are available?", a: "X-ray, CT, MRI, ultrasound and echocardiography through BCONZ's partner networks. Availability, volume and population for a project are confirmed during feasibility." },
      { q: "Where does the imaging data come from?", a: "From BCONZ partner networks in the United States and India, including populations that are under-represented in public imaging datasets. Which sources fit a project is confirmed during feasibility." },
      { q: "Do the studies come with reports?", a: "Studies are paired with their clinical report where available, as text linked to the study. Report coverage for a project is confirmed during feasibility." },
      { q: "Can we see a sample before committing?", a: "Where the data partner agrees, a small de-identified evaluation sample can be provided under an evaluation agreement." },
      { q: "Is this a free dataset download?", a: "No. Access is licensed for a defined research or development purpose under a data use agreement, after feasibility and governance review." },
    ],
  },
];

export const areaBySlug = (slug: AreaSlug) => areas.find((a) => a.slug === slug)!;
