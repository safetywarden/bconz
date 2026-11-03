/**
 * Insight articles under /insights/<slug>.
 *
 * Each article targets a specific, low-competition question a data buyer or
 * data owner searches (see docs/seo-data.md), and doubles as the link for that
 * week's LinkedIn post. Facts must be checkable: cite sources in `references`.
 * No partner names and no figures about partner datasets.
 *
 * Paragraph and list text may contain inline links as [text](/path) and bold as **text**.
 */

export type PostSlug =
  | "de-identifying-medical-images"
  | "public-medical-imaging-datasets-limits"
  | "what-research-papers-say-about-missing-data"
  | "licensing-medical-imaging-data-checklist"
  | "external-validation-medical-ai"
  | "hospital-data-licensing-guide";

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
  {
    slug: "licensing-medical-imaging-data-checklist",
    title: "Licensing medical imaging data for AI: a buyer's checklist",
    seoTitle: "Licensing Medical Imaging Data for AI: A Checklist",
    description:
      "What to agree before licensing medical imaging data for AI: rights, permitted use, model ownership, data specification, de-identification and price.",
    keywords: ["license medical imaging data", "data licensing agreement AI training", "buy medical imaging data", "imaging dataset licence terms"],
    category: "Data licensing",
    published: "2026-11-03",
    readingTime: "8 min read",
    body: [
      {"p": "Licensing data is now a normal part of building imaging AI. Data licences aren't standard yet, though, and when something goes wrong it's usually in the contract, not the data. Here's what to pin down before you sign, in the order we'd check it."},
      {"h2": "1. Who has the right to license it?"},
      {"p": "Start with the chain of rights. The organisation selling you data is often not the one that collected it. Ask three things:"},
      {"ul": ["Who holds the rights, by name?", "What agreement lets the seller license it to you?", "What did the patients consent to, or which ethics approval or waiver covers this kind of secondary use?"]},
      {"p": "If the answers are vague, everything after them rests on nothing."},
      {"h2": "2. What exactly you're allowed to do"},
      {"ul": ["**Purpose.** Training, validation, regulatory submission, a commercial product: each should be named.", "**Field of use.** Is the licence limited to one condition, body part or product?", "**Territory and term.** Where you can use it, for how long, and what happens at the end.", "**Exclusivity.** Most data licences are non-exclusive. Exclusivity costs more and is rarely needed.", "**Who else can touch it.** Your cloud provider, annotation vendor or contract research organisation may need access. Make sure the licence allows it."]},
      {"h2": "3. Who owns the model"},
      {"p": "This is the clause teams most often skim. The licence should say plainly that models, weights and outputs trained on the data belong to you, and that you can keep using and selling the model after the licence ends and the data is deleted."},
      {"p": "Watch for two traps: royalties on revenue from the model, and clauses requiring you to delete \"derivatives\" of the data, which could be read to include the model itself."},
      {"h2": "4. The data specification"},
      {"p": "Write down what \"the dataset\" means, in a schedule to the contract:"},
      {"ul": ["modalities and body parts", "number of patients and number of studies (both matter: studies per patient changes what you can do)", "sites, countries, scanner makers and models", "date range", "population: age, sex and ethnicity where recorded", "what comes with each study: reports, labels, clinical data, follow-up", "format: DICOM at original resolution, or converted and compressed", "how cases were chosen: every consecutive patient, or enriched for a condition"]},
      {"h2": "5. An evaluation sample first"},
      {"p": "Ask for a small de-identified sample under a short evaluation agreement before you commit. It shows you image quality, report quality, how complete the headers are and whether de-identification was done properly. A supplier who won't share any sample, even under a confidentiality agreement, is telling you something."},
      {"h2": "6. De-identification evidence"},
      {"p": "Ask how the headers, burned-in pixel text and reports were de-identified, and for the documentation behind it, such as an Expert Determination report under HIPAA. [Our guide to de-identifying medical images](/insights/de-identifying-medical-images) lists the questions."},
      {"h2": "7. Delivery, security and deletion"},
      {"ul": ["How the data is delivered: secure transfer, cloud storage or remote access only.", "What security you must have in place.", "A ban on re-identifying patients or linking the data to other sources.", "Return or deletion at the end, with a certificate of deletion.", "Breach notification: who tells whom, and how fast."]},
      {"h2": "8. Price"},
      {"p": "Common models are a price per study, per cohort, or a fixed fee for a defined dataset, sometimes with extra fees for labels or exclusivity. Prices tend to rise with rarity (rare conditions, specific populations), richness (reports, follow-up, outcomes) and restrictions (exclusivity, commercial use). Ask what's included: replacing corrupt files, answering questions about the data, refreshes with newer data."},
      {"h2": "Red flags"},
      {"ul": ["Answers about rights that still have template brackets in them.", "No sample under any terms.", "A licence that says nothing about who owns the model.", "\"Anonymised\" with no method described.", "Dataset sizes that change from one call to the next."]},
      {"p": "We check these points with every data partner before we offer their data. If you're looking for imaging data for training or validation, see [medical imaging datasets](/data/imaging) or [tell us what you need](/request-data)."},
    ],
    references: [
      {"text": "US Department of Health and Human Services: Guidance regarding methods for de-identification of protected health information under HIPAA", "url": "https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html"},
    ],
  },
  {
    slug: "external-validation-medical-ai",
    title: "External validation for medical AI: what a good test dataset looks like",
    seoTitle: "External Validation Datasets for Medical AI",
    description:
      "What makes a test set truly external for medical AI: independent sites, no patient overlap, a representative population and a sound reference standard.",
    keywords: ["external validation dataset", "independent test set medical AI", "external validation medical imaging AI", "AI model validation dataset"],
    category: "Healthcare AI",
    published: "2026-11-03",
    readingTime: "7 min read",
    body: [
      {"p": "\"External validation is needed.\" It's one of the most common sentences in medical AI papers. In [our analysis of 1,959 papers that state a data gap](/insights/what-research-papers-say-about-missing-data), 13% asked for exactly that. A 2019 review of studies of AI for medical image diagnosis found that only 6% had validated their algorithm on external data."},
      {"p": "Here's what external validation actually requires, and why a held-out slice of your training data isn't it."},
      {"h2": "Internal, temporal and external"},
      {"ul": ["**Internal validation:** a random split of the same data source. It tells you the model learned something, not that it travels.", "**Temporal validation:** later data from the same sites. It catches change over time, but the patients, scanners and habits are the same.", "**External validation:** data from different sites, ideally different health systems or countries, that played no part in building the model. This is the test that best predicts how the model will do in the real world."]},
      {"h2": "What makes a test set independent"},
      {"ul": ["It comes from different sites than the training data.", "There's no patient overlap. The same patient can be seen at two hospitals, and the same images can turn up in more than one public dataset.", "The model is locked before you look. No tuning thresholds on the test set.", "Where possible, someone other than the development team holds it and runs the test."]},
      {"h2": "Representative of the intended use"},
      {"p": "The test set should look like the patients and settings where the model will be used: the same intended population, the scanners and protocols in use there, the real-world prevalence of the condition (or both enriched and real-world estimates), and the full range of severity and confounders, such as implanted devices, prior surgery and poor image quality."},
      {"h2": "Subgroups"},
      {"p": "Report performance by age, sex, ethnicity where recorded, site and scanner maker. A model can look good overall and still fail one group; chest X-ray models trained on large public datasets have been shown to underdiagnose disease more often in under-served groups. Plan subgroup sizes before you collect data, so each subgroup has enough cases to say something."},
      {"h2": "The reference standard"},
      {"p": "Decide how the truth is established: the original radiology report, the consensus of several expert readers, pathology results or follow-up outcomes. Reports are cheaper but noisier; expert consensus and outcomes cost more and are easier to defend. Record the readers' experience and how disagreements were settled."},
      {"h2": "How many cases"},
      {"p": "Enough to estimate sensitivity and specificity with useful precision, and that depends on prevalence. A rare finding needs many cases in total, or an enriched set, to get enough positives. Work it out with a statistician before you acquire data, not after."},
      {"h2": "Reporting"},
      {"p": "Reporting guidelines help reviewers trust the result: TRIPOD+AI for prediction models and CLAIM for AI in medical imaging. For a regulatory submission, check the regulator's guidance for your device type and market."},
      {"h2": "Where external data comes from"},
      {"ul": ["**Collaborating hospitals:** strong evidence, but slow to set up.", "**Public datasets:** only if they weren't used in training and the licence allows your use. See [where public imaging datasets fall short](/insights/public-medical-imaging-datasets-limits).", "**Licensed datasets** from sites and populations your model hasn't seen."]},
      {"p": "If you need an external validation set, [tell us the modality, population and size you need](/request-data)."},
    ],
    references: [
      {"text": "Kim DW, et al. Design characteristics of studies reporting the performance of artificial intelligence algorithms for diagnostic analysis of medical images: results from recently published papers. Korean Journal of Radiology, 2019."},
      {"text": "Collins GS, et al. TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods. BMJ, 2024."},
      {"text": "Mongan J, Moy L, Kahn CE Jr. Checklist for Artificial Intelligence in Medical Imaging (CLAIM): a guide for authors and reviewers. Radiology: Artificial Intelligence, 2020."},
      {"text": "Seyyed-Kalantari L, et al. Underdiagnosis bias of artificial intelligence algorithms applied to chest radiographs in under-served patient populations. Nature Medicine, 2021."},
    ],
  },
  {
    slug: "hospital-data-licensing-guide",
    title: "Licensing de-identified hospital data for research: a guide for hospitals and labs",
    seoTitle: "Hospital Data Licensing for Research: A Guide",
    description:
      "How hospitals, labs and imaging centres can make de-identified data available for research and AI: demand, governance, de-identification and revenue.",
    keywords: ["monetize hospital data", "hospital data licensing", "hospital data partnership", "sell de-identified medical data", "healthcare data collaboration"],
    category: "Data partnerships",
    published: "2026-11-03",
    readingTime: "7 min read",
    body: [
      {"p": "Hospitals, labs and imaging centres hold years of images, test results and clinical records. Researchers and companies say in print that they need exactly this kind of data: [almost half the papers we analysed](/insights/what-research-papers-say-about-missing-data) say their evidence came from a single centre. Yet most of it never leaves the archive, usually not because nobody wants it, but because the path from archive to licensed dataset isn't clear."},
      {"p": "Here's what that path involves."},
      {"h2": "1. Is there demand for your data?"},
      {"p": "Data is most valuable when it fills a gap: a population under-represented in research, a region with little published data, long follow-up, images paired with reports, or a rare condition. Data from India and much of Asia, for example, is scarce in the public datasets most AI is trained on. Before investing, check who has published a need for data like yours. That's what [DIA](/platform/dia) does."},
      {"h2": "2. Governance comes first"},
      {"ul": ["An institutional decision on whether and how data is shared.", "Ethics committee approval, or a waiver, for secondary use. Requirements vary by country.", "A check of what patients consented to.", "Compliance with data protection law, such as India's Digital Personal Data Protection Act 2023, HIPAA in the United States or GDPR in Europe. Take legal advice.", "A policy on permitted uses, for example no re-identification, no insurance underwriting and no onward resale."]},
      {"h2": "3. Know what you have"},
      {"p": "Make an inventory: which modalities and tests, which years, what volumes, how much has reports, what clinical data links to it and how consistent the coding is. Most archives are messier than expected, with missing reports, mixed formats and duplicate patients. A [data readiness assessment](/platform/harm) shows what the data can support before anyone promises it to a buyer."},
      {"h2": "4. De-identification"},
      {"p": "Headers, text burned into images, faces in head scans and free-text reports all need treatment ([our guide](/insights/de-identifying-medical-images)). Dates are usually shifted rather than removed, to keep timelines intact. The method should be documented and checked."},
      {"h2": "5. Choose a sharing model"},
      {"ul": ["**Licensing de-identified extracts.** The data leaves under a licence for a defined purpose and term.", "**Federated or remote access.** The data stays on your systems; researchers run analyses or train models without taking it away.", "**Working through a partner.** A partner finds buyers, handles contracts and delivery, and shares the licensing revenue with you."]},
      {"p": "Each option trades control, effort and income differently."},
      {"h2": "6. What you get back"},
      {"p": "Licensing revenue; research collaborations and co-authorship; a better-organised archive; and research that includes your patients' population. Set realistic expectations: income depends on demand for your specific data and builds over time."},
      {"h2": "7. Questions to ask any partner"},
      {"ol": ["Who decides which buyers get access, and can we refuse a buyer?", "Which uses are prohibited?", "Where does the data sit, and who can reach it?", "How is revenue shared and reported?", "Who carries liability if something goes wrong?", "Can we leave, and what happens to data already licensed?"]},
      {"p": "The [BCONZ Data Collaboration Programme](/data-partners) works with hospitals, labs and imaging centres on readiness, de-identification and licensing, with a share of licensing revenue. [Talk to us](/contact)."},
    ],
    references: [
      {"text": "Digital Personal Data Protection Act, 2023 (India)"},
      {"text": "US Department of Health and Human Services: Guidance regarding methods for de-identification of protected health information under HIPAA", "url": "https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html"},
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
