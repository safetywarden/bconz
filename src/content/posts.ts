/**
 * Insight articles under /insights/<slug>.
 *
 * Each article targets a specific, low-competition question a data buyer or
 * data owner searches (see docs/seo-data.md), and doubles as the link for that
 * week's LinkedIn post. Facts must be checkable: cite sources in `references`.
 * No partner names and no figures about partner datasets.
 *
 * Paragraph and list text may contain inline links as [text](/path).
 */

export type PostSlug =
  | "de-identifying-medical-images"
  | "public-medical-imaging-datasets-limits"
  | "what-research-papers-say-about-missing-data";

export type Block =
  | { h2: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] };

export type Post = {
  slug: PostSlug;
  title: string;          // the H1
  seoTitle: string;       // <= 52 chars before " | BCONZ"
  description: string;    // <= 155 chars
  keywords: string[];
  category: string;
  published: string;      // ISO date
  readingTime: string;
  body: Block[];
  references: Array<{ text: string; url?: string }>;
};

export const posts: Post[] = [
  {
    slug: "de-identifying-medical-images",
    title: "De-identifying medical images: why removing the DICOM header isn't enough",
    seoTitle: "Medical Image De-identification: Beyond the Header",
    description:
      "Names and dates can sit in image pixels, report text and private DICOM tags. What full de-identification of medical images involves, and what to ask.",
    keywords: [
      "de-identify DICOM images",
      "medical image de-identification",
      "burned-in annotations",
      "DICOM anonymisation",
      "PHI in medical images",
      "de-identified imaging data",
    ],
    category: "Data governance",
    published: "2026-11-02",
    readingTime: "7 min read",
    body: [
      { p: "Ask most teams how they de-identify a scan and they'll describe one step: strip the patient's name and ID from the DICOM header. It's the right first step. It's also where many datasets stop, and where identifying information gets through." },
      { p: "A medical image carries identifying information in at least four places, and each needs its own method." },
      { h2: "1. The DICOM header" },
      { p: "Every DICOM file has a header of tagged fields: patient name, patient ID, birth date, accession number, study dates, the hospital, the referring doctor, the scanner's serial number and more. Manufacturers also add private tags, whose contents aren't standardised and can hold anything, including names." },
      { p: "The DICOM standard sets out what to remove. Part 15, Annex E defines a Basic Application Level Confidentiality Profile: a table of which attributes to remove, blank or replace, plus options for when some information must be kept or cleaned more thoroughly. Applying a recognised profile, and recording which options were used, is far better than a home-grown list of tags." },
      { p: "Two details matter for research:" },
      { ul: [
        "Dates. Removing every date destroys the timeline between scans. A common approach is to shift all of a patient's dates by the same random offset, so intervals survive but real dates don't. Annex E has an option for keeping longitudinal temporal information in a modified form.",
        "Identifiers that link studies. Patient and study identifiers should be replaced consistently, so one patient's studies still link to each other without linking back to the hospital's records.",
      ] },
      { h2: "2. The pixels" },
      { p: "This is the step most often missed. On many images, identifying text is part of the picture itself: burned into the pixels as a label in a corner of the screen. Cleaning the header doesn't touch it." },
      { p: "It's common in:" },
      { ul: [
        "ultrasound and echocardiography, where the machine prints patient details and the date on the screen it captures",
        "secondary captures and screenshots, such as 3D reconstructions saved as images",
        "scanned paper documents stored as DICOM",
        "some radiography and fluoroscopy, depending on the device and the site's settings",
      ] },
      { p: "DICOM has a Burned In Annotation attribute meant to flag these images, but it isn't reliably filled in, so it can't be trusted on its own. Practical approaches combine masking the known text regions for each device model, text detection (OCR) to find what's left, and a human review of a sample before release. Annex E's Clean Pixel Data option covers this step." },
      { h2: "3. The face" },
      { p: "A head CT or MRI can be rendered in 3D into a recognisable face. For datasets that include head imaging, defacing (removing facial features from the image volume) is often needed. Annex E calls this the Clean Recognizable Visual Features option, and HIPAA's Safe Harbor list includes full-face photographs and comparable images." },
      { h2: "4. The report" },
      { p: "Radiology and cardiology reports are free text. They can name the patient, the referring doctor, the hospital, a date, a relative or a place, and header tools don't touch them. Reports need their own de-identification pass, usually software that finds names, dates and numbers followed by human checks, with dates shifted the same way as in the images so the report still matches the scan." },
      { p: "Don't forget the files themselves: folder and file names often contain patient IDs or accession numbers." },
      { h2: "What the law expects" },
      { p: "In the United States, HIPAA offers two routes to de-identified data. Safe Harbor removes 18 types of identifiers; Expert Determination has a qualified expert confirm that the risk of re-identification is very small. Either way, the standard applies to everything in the dataset: headers, pixels and reports." },
      { p: "In India, the Digital Personal Data Protection Act 2023 governs personal data, and what counts as adequately anonymised data is still being settled. Other countries have their own rules. In every case, the contract should state which method was used and who checked it." },
      { h2: "Questions to ask a data supplier" },
      { ol: [
        "Which de-identification profile did you apply to the DICOM headers, and with which options?",
        "How do you find and remove text burned into the pixels: by device, by OCR, by human review?",
        "Are head studies defaced?",
        "How are reports de-identified, and are dates shifted consistently with the images?",
        "Was the result checked by a person or an independent expert, and on what sample?",
        "Which legal route applies (for example HIPAA Safe Harbor or Expert Determination), and can you show the documentation?",
      ] },
      { p: "If a supplier can answer the first question but not the second, the dataset probably still contains names." },
      { p: "We ask these questions of every data source before we work with it. If you need de-identified imaging data with reports for research or AI development, see [medical imaging datasets](/data/imaging) or [tell us what you need](/request-data)." },
    ],
    references: [
      { text: "DICOM Standard, PS3.15 Annex E: Attribute Confidentiality Profiles", url: "https://dicom.nema.org/medical/dicom/current/output/chtml/part15/chapter_E.html" },
      { text: "US Department of Health and Human Services: Guidance regarding methods for de-identification of protected health information under HIPAA", url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html" },
      { text: "Digital Personal Data Protection Act, 2023 (India)" },
    ],
  },
  {
    slug: "public-medical-imaging-datasets-limits",
    title: "Free medical imaging datasets: where they fall short for commercial AI",
    seoTitle: "Public Imaging Datasets: Limits for Commercial AI",
    description:
      "MIMIC-CXR, CheXpert and ChestX-ray14 trained a generation of models. Where public imaging datasets fall short for products, and what to use alongside them.",
    keywords: [
      "public medical imaging datasets",
      "chest X-ray dataset commercial use",
      "medical imaging dataset licence",
      "external validation dataset",
      "MIMIC-CXR CheXpert limitations",
      "licensed medical imaging data",
    ],
    category: "Healthcare AI",
    published: "2026-11-02",
    readingTime: "8 min read",
    body: [
      { p: "Public imaging datasets changed medical AI. Three chest X-ray collections alone gave thousands of research groups something to train on:" },
      { ul: [
        "ChestX-ray14 (NIH Clinical Center, 2017): 112,120 frontal chest X-rays from 30,805 patients.",
        "CheXpert (Stanford, 2019): 224,316 chest X-rays from 65,240 patients.",
        "MIMIC-CXR (Beth Israel Deaconess Medical Center, 2019): 377,110 images from 227,835 studies, with the free-text reports.",
      ] },
      { p: "They're excellent for learning, prototyping and benchmarking. But teams building a product find their limits, usually at the worst moment: when the model meets a hospital it has never seen, or when a regulator asks how it was tested." },
      { h2: "1. The licence may not cover your use" },
      { p: "Public doesn't mean unrestricted. Some public datasets are licensed for non-commercial research only. Others need credentialed access, training and a signed data use agreement, and forbid passing the data on. Terms can also differ between versions of the same dataset." },
      { p: "Before you build a product on a public dataset, read the licence for the exact version you downloaded, and have counsel confirm it covers training and selling a commercial model." },
      { h2: "2. A few hospitals stand in for the world" },
      { p: "Each of these datasets comes from one academic hospital, or a handful. A model trained on them learns those hospitals' patients, scanners, protocols and habits along with the disease." },
      { p: "Zech and colleagues showed how much this matters. They trained a pneumonia detector on chest X-rays from several hospital systems and tested it on others. Performance dropped at hospitals it hadn't seen, and the model could tell which hospital an image came from: a sign it was learning the site as well as the disease." },
      { h2: "3. The labels are often inferred from reports" },
      { p: "Large public datasets usually get their labels by running natural-language processing over radiology reports, not from a radiologist reviewing each image. That makes huge datasets possible, but the labels are noisy. Oakden-Rayner's review of public chest X-ray datasets found many labels that didn't match the images. Noisy labels put a ceiling on what a model can learn and make test scores less trustworthy." },
      { h2: "4. The population may not be your market" },
      { p: "The patients in these datasets reflect who attends those hospitals. Seyyed-Kalantari and colleagues found that chest X-ray models trained on large public datasets underdiagnosed disease more often in under-served groups, including female patients, Black patients and patients on Medicaid. If you plan to sell in Asia, Europe or community hospitals, a US academic dataset won't tell you how your model performs there." },
      { h2: "5. Everyone has the same data" },
      { p: "If your model is trained on the same public data as every competitor's, the data gives you no edge. And because so many models have been tuned against the same benchmarks, scores on them can overstate how a model will perform in practice." },
      { h2: "6. Regulators want independent test data" },
      { p: "For a regulatory submission, performance has to be shown on data that's independent of the training data and representative of the patients the device is intended for. Reusing a public dataset that also fed your training, or one from a population unlike your intended users, makes that case harder." },
      { h2: "What to use alongside public data" },
      { p: "Use public datasets for what they're good at: learning, pretraining and early prototypes. Then add licensed data where it counts:" },
      { ul: [
        "Training data from your target population, scanners and care settings.",
        "External validation data from sites your model has never seen, held back from training.",
        "Subgroup coverage by age, sex, ethnicity and equipment, so you can show the model works for everyone it's meant for.",
        "Reports or expert labels you can trust as ground truth.",
      ] },
      { p: "When you evaluate a licensed dataset, ask the same questions you'd ask of a public one: what exactly the licence allows, how many sites and scanners it covers, how the labels were made, who the patients are, and how it was [de-identified](/insights/de-identifying-medical-images)." },
      { p: "BCONZ has opened early access to de-identified medical imaging data with reports, licensed for AI research and development. See [medical imaging datasets](/data/imaging) or [tell us the modality, population and volume you need](/request-data)." },
    ],
    references: [
      { text: "Wang X, et al. ChestX-ray8: Hospital-scale chest X-ray database and benchmarks on weakly-supervised classification and localization of common thorax diseases. CVPR, 2017." },
      { text: "Irvin J, et al. CheXpert: A large chest radiograph dataset with uncertainty labels and expert comparison. AAAI, 2019." },
      { text: "Johnson AEW, et al. MIMIC-CXR, a de-identified publicly available database of chest radiographs with free-text reports. Scientific Data, 2019." },
      { text: "Zech JR, et al. Variable generalization performance of a deep learning model to detect pneumonia in chest radiographs: a cross-sectional study. PLOS Medicine, 2018." },
      { text: "Oakden-Rayner L. Exploring large-scale public medical image datasets. Academic Radiology, 2020." },
      { text: "Seyyed-Kalantari L, et al. Underdiagnosis bias of artificial intelligence algorithms applied to chest radiographs in under-served patient populations. Nature Medicine, 2021." },
    ],
  },
  {
    slug: "what-research-papers-say-about-missing-data",
    title: "What 1,959 research papers say about missing healthcare data",
    seoTitle: "What 1,959 Papers Say About Missing Clinical Data",
    description:
      "We analysed the limitations sections of 1,959 recent papers that state a data gap. 47% cite a single-centre design. What researchers say they need next.",
    keywords: [
      "single centre study limitation",
      "external validation cohort",
      "research data gaps",
      "multi-site healthcare data",
      "real-world data demand",
      "limitations section analysis",
    ],
    category: "Research",
    published: "2026-11-02",
    readingTime: "6 min read",
    body: [
      { p: "Near the end of almost every clinical research paper is a paragraph few people read: the limitations. It's where authors say, in writing, what their study couldn't do, and usually why. Very often, the reason is data." },
      { p: "We built software to read those paragraphs at scale. Here's what 1,959 of them say." },
      { h2: "What we looked at" },
      { p: "Our Demand Intelligence Agent (DIA) searched Europe PMC for papers published between 2023 and 2026 that state a data limitation, across 11 disease areas, taking up to 200 recent papers per area. For each paper it records the exact sentence where the authors describe the gap, their organisation and the date, and sorts the gap into a type." },
      { h2: "What researchers say they're missing" },
      { p: "The share of papers stating each type of gap:" },
      { ul: [
        "Single-centre data: 47%. Almost half say their evidence comes from one hospital or site, so their results may not hold elsewhere.",
        "A larger cohort: 16%. Too few patients for the question they wanted to answer.",
        "External validation: 13%. A model or finding not yet tested on an independent group of patients.",
        "Under-represented populations: 12%. Groups the study couldn't include in sufficient numbers.",
      ] },
      { p: "The pattern is clear. The thing researchers most often say they lack isn't a better method or more computing power. It's data from beyond their own hospital." },
      { h2: "Why this matters" },
      { p: "For research teams: if your study was single-centre, you're in good company, and reviewers will keep asking for the same thing. Planning multi-site or external validation data early saves a second study later." },
      { p: "For hospitals, labs and imaging centres: the data you hold is what these researchers say they need. Data from a different site, population or health system is what turns a single-centre result into evidence that holds. Our [Data Collaboration Programme](/data-partners) is how data owners make their data available for research, under governance, with a share of licensing revenue." },
      { p: "For companies building AI or diagnostics: the same gap applies to products. A model validated at one site hasn't yet met the rest of the world. See [where public imaging datasets fall short for commercial AI](/insights/public-medical-imaging-datasets-limits)." },
      { h2: "Our own limitations" },
      { p: "In the spirit of the paragraph we studied:" },
      { ul: [
        "We only see papers indexed in Europe PMC, mostly in English.",
        "Software sorts free-text sentences into types, and it won't be perfect.",
        "A stated need isn't a budget. Some authors will never look for more data; others need it but can't fund it.",
        "Papers report gaps months or years after the work was done.",
      ] },
      { p: "Even so, a limitations section is one of the few places where people describe their data needs in their own words, with their name and organisation attached." },
      { h2: "How DIA uses this" },
      { p: "DIA turns these sentences into a list of organisations that have published a specific data need, with the evidence for each, alongside grants, clinical trials and regulatory filings. Data owners use it to see who needs data like theirs. [See how DIA works](/platform/dia)." },
    ],
    references: [
      { text: "Method: BCONZ DIA analysis of 1,959 papers stating a data limitation, published 2023–2026, across 11 disease areas; up to 200 recent papers per area." },
      { text: "Source: Europe PMC", url: "https://europepmc.org" },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
