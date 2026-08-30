import { normalizeCandidateName, normalizedCandidateKey } from "./candidate-eligibility";

export type TherapyIdentityClass =
  | "STANDARD_OF_CARE"
  | "KNOWN_DISEASE_PROGRAM"
  | "NON_DRUG_INTERVENTION"
  | "REPURPOSING_ELIGIBLE";

export type TherapyIdentityAssessment = {
  canonicalName: string;
  normalizedKey: string;
  identityClass: TherapyIdentityClass;
  noveltyCap: number;
  benchmark: boolean;
  eligibleForFastTrack: boolean;
  rationale: string[];
};

const nonDrugPatterns = [
  /^placebo$/i,
  /placebo/i,
  /stem cell transplant/i,
  /hematopoietic stem cell/i,
  /bone marrow transplant/i,
  /transplantation/i,
  /diet/i,
  /exercise/i,
  /device/i,
  /procedure/i,
  /supportive care/i,
  /standard of care/i,
];

const diseaseTherapyRegistry: Record<string, { standard: Record<string, string>; programs: Record<string, string> }> = {
  "gaucher disease": {
    standard: {
      "imiglucerase": "imiglucerase",
      "cerezyme": "imiglucerase",
      "velaglucerase alfa": "velaglucerase alfa",
      "vpriv": "velaglucerase alfa",
      "taliglucerase alfa": "taliglucerase alfa",
      "elelyso": "taliglucerase alfa",
      "eliglustat": "eliglustat",
      "eliglustat tartrate": "eliglustat",
      "cerdelga": "eliglustat",
      "miglustat": "miglustat",
      "zavesca": "miglustat"
    },
    programs: {
      "venglustat": "venglustat",
      "avr-rd-02": "AVR-RD-02",
      "iscu302": "ISU302",
      "vprn": "VPRN"
    }
  }
};

export function assessTherapyIdentity(diseaseName: string, candidateName: string): TherapyIdentityAssessment {
  const canonicalInput = normalizeCandidateName(candidateName);
  const key = normalizedCandidateKey(canonicalInput);
  const rationale: string[] = [];

  if (nonDrugPatterns.some((pattern) => pattern.test(canonicalInput))) {
    rationale.push("Clinical-trial intervention is not a specific repurposable drug asset.");
    return { canonicalName: canonicalInput, normalizedKey: key, identityClass: "NON_DRUG_INTERVENTION", noveltyCap: 0, benchmark: false, eligibleForFastTrack: false, rationale };
  }

  const registry = diseaseTherapyRegistry[normalizedCandidateKey(diseaseName)];
  const standardCanonical = registry?.standard[key];
  if (standardCanonical) {
    rationale.push("Known standard/approved therapy for this same disease; retained as a positive-control benchmark rather than a discovery candidate.");
    return { canonicalName: standardCanonical, normalizedKey: normalizedCandidateKey(standardCanonical), identityClass: "STANDARD_OF_CARE", noveltyCap: 5, benchmark: true, eligibleForFastTrack: false, rationale };
  }

  const programCanonical = registry?.programs[key];
  if (programCanonical) {
    rationale.push("Known disease-specific development program; clinical readiness may be high, but repurposing novelty is low.");
    return { canonicalName: programCanonical, normalizedKey: normalizedCandidateKey(programCanonical), identityClass: "KNOWN_DISEASE_PROGRAM", noveltyCap: 20, benchmark: false, eligibleForFastTrack: false, rationale };
  }

  return { canonicalName: canonicalInput, normalizedKey: key, identityClass: "REPURPOSING_ELIGIBLE", noveltyCap: 100, benchmark: false, eligibleForFastTrack: true, rationale: ["No same-disease standard-therapy or known-program match was found in the current CRN-2.3 registry."] };
}
