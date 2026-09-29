export type CandidateEligibilityClass =
  | "APPROVED_DRUG"
  | "CLINICAL_DRUG"
  | "INVESTIGATIONAL_DRUG"
  | "ENDOGENOUS_METABOLITE"
  | "BIOMARKER"
  | "EXPERIMENTAL_REAGENT"
  | "DRUG_CLASS"
  | "GENERIC_CHEMICAL_CLASS"
  | "DRUGLIKE_UNVERIFIED"
  | "OTHER";

export type EligibilityFact = { fact_type: string; confidence: number };

export type CandidateEligibility = {
  canonicalName: string;
  normalizedKey: string;
  eligibilityClass: CandidateEligibilityClass;
  eligibleForRepurposing: boolean;
  requiresReview: boolean;
  confidence: number;
  rationale: string[];
};

const exactAliases: Record<string, string> = {
  "lipids": "lipid",
  "lipid": "lipid",
  "glucosyl sphingosine": "glucosylsphingosine",
  "glucosylsphingosine": "glucosylsphingosine",
  "lyso gl1": "glucosylsphingosine",
  "lyso-gl1": "glucosylsphingosine",
  "conduritol b-epoxide": "conduritol B epoxide",
  "conduritol b epoxide": "conduritol B epoxide",
  "cbe": "conduritol B epoxide",
};

const endogenousMetabolites = new Set([
  "glucosylsphingosine",
  "glucosylceramide",
  "ceramide",
  "sphingosine",
  "cholesterol",
  "glucose",
  "lactate",
  "pyruvate",
]);

const experimentalReagents = new Set([
  "conduritol b epoxide",
  "conduritol B epoxide",
  "cbe",
]);

const genericClasses = new Set([
  "lipid",
  "lipids",
  "protein",
  "proteins",
  "peptide",
  "peptides",
  "steroid",
  "steroids",
  "antioxidant",
  "antioxidants",
  "enzyme",
  "enzymes",
  "amino acid",
  "amino acids",
  "fatty acid",
  "fatty acids",
]);

const drugClassPatterns = [
  /\binhibitors?$/i,
  /\bagonists?$/i,
  /\bantagonists?$/i,
  /\bmodulators?$/i,
  /\bblockers?$/i,
  /\bantibodies?$/i,
  /\bstatins?$/i,
  /\bgliflozins?$/i,
];

export function normalizeCandidateName(value: string) {
  const compact = value.normalize("NFKD").replace(/[‐‑–—]/g, "-").replace(/\s+/g, " ").trim();
  const lookup = compact.toLowerCase();
  return exactAliases[lookup] ?? compact;
}

export function normalizedCandidateKey(value: string) {
  return normalizeCandidateName(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function assessCandidateEligibility(name: string, facts: EligibilityFact[] = []): CandidateEligibility {
  const canonicalName = normalizeCandidateName(name);
  const key = normalizedCandidateKey(canonicalName);
  const rationale: string[] = [];

  const approved = facts.some((f) => ["APPROVAL", "APPROVED_INDICATION"].includes(f.fact_type) && Number(f.confidence) >= 60);
  const clinical = facts.some((f) => ["ACTIVE_TRIAL", "HUMAN_EXPOSURE", "KNOWN_INDICATION"].includes(f.fact_type) && Number(f.confidence) >= 55);
  if (approved) return { canonicalName, normalizedKey: key, eligibilityClass: "APPROVED_DRUG", eligibleForRepurposing: true, requiresReview: false, confidence: 95, rationale: ["Curated landscape evidence indicates regulatory approval or an approved indication."] };
  if (clinical) return { canonicalName, normalizedKey: key, eligibilityClass: "CLINICAL_DRUG", eligibleForRepurposing: true, requiresReview: false, confidence: 85, rationale: ["Curated landscape evidence indicates human clinical exposure or active clinical development."] };

  if (experimentalReagents.has(key) || /\b(epoxide|probe|reagent|inhibitor used to induce|experimental inhibitor)\b/i.test(canonicalName)) {
    rationale.push("Known or strongly patterned experimental reagent; not treated as a repurposable therapeutic asset.");
    return { canonicalName, normalizedKey: key, eligibilityClass: "EXPERIMENTAL_REAGENT", eligibleForRepurposing: false, requiresReview: false, confidence: 95, rationale };
  }
  if (endogenousMetabolites.has(key)) {
    rationale.push("Endogenous metabolite/biological analyte; should not enter drug-repurposing ranking by default.");
    return { canonicalName, normalizedKey: key, eligibilityClass: "ENDOGENOUS_METABOLITE", eligibleForRepurposing: false, requiresReview: false, confidence: 92, rationale };
  }
  if (genericClasses.has(key)) {
    rationale.push("Generic chemical or biological class rather than a specific therapeutic candidate.");
    return { canonicalName, normalizedKey: key, eligibilityClass: "GENERIC_CHEMICAL_CLASS", eligibleForRepurposing: false, requiresReview: false, confidence: 95, rationale };
  }
  if (drugClassPatterns.some((pattern) => pattern.test(canonicalName))) {
    rationale.push("Drug-class level concept; requires resolution to a specific agent before repurposing ranking.");
    return { canonicalName, normalizedKey: key, eligibilityClass: "DRUG_CLASS", eligibleForRepurposing: false, requiresReview: true, confidence: 80, rationale };
  }
  if (/\b(biomarker|marker|metabolite)\b/i.test(canonicalName)) {
    rationale.push("Biomarker/metabolite-like concept; not a specific therapeutic agent.");
    return { canonicalName, normalizedKey: key, eligibilityClass: "BIOMARKER", eligibleForRepurposing: false, requiresReview: true, confidence: 75, rationale };
  }

  // PubTator CHEMICAL is broader than DRUG. Unknown specific chemicals remain reviewable,
  // but are never promoted solely because they co-occur with a disease.
  const specificEnough = key.length >= 4 && key.split(" ").length <= 6 && !/^\d+$/.test(key);
  if (specificEnough) {
    rationale.push("Specific chemical entity, but therapeutic status is not yet verified against a drug registry or curated landscape fact.");
    return { canonicalName, normalizedKey: key, eligibilityClass: "DRUGLIKE_UNVERIFIED", eligibleForRepurposing: true, requiresReview: true, confidence: 55, rationale };
  }
  rationale.push("Entity is not sufficiently specific to establish drug eligibility.");
  return { canonicalName, normalizedKey: key, eligibilityClass: "OTHER", eligibleForRepurposing: false, requiresReview: true, confidence: 45, rationale };
}
