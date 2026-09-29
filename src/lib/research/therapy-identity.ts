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
  aliasMatched: boolean;
  originalName: string;
  rationale: string[];
};

const nonDrugPatterns = [
  /^placebo$/i,/placebo/i,/stem cell transplant/i,/hematopoietic stem cell/i,/bone marrow transplant/i,/transplantation/i,/diet/i,/exercise/i,/device/i,/procedure/i,/supportive care/i,/standard of care/i,
];

const diseaseTherapyRegistry: Record<string, { standard: Record<string, string>; programs: Record<string, string> }> = {
  "gaucher disease": {
    standard: {
      "imiglucerase": "imiglucerase","cerezyme": "imiglucerase",
      "velaglucerase alfa": "velaglucerase alfa","vpriv": "velaglucerase alfa",
      "taliglucerase alfa": "taliglucerase alfa","elelyso": "taliglucerase alfa",
      "eliglustat": "eliglustat","eliglustat tartrate": "eliglustat","cerdelga": "eliglustat",
      "miglustat": "miglustat","zavesca": "miglustat"
    },
    programs: {
      "venglustat": "venglustat","avr rd 02": "AVR-RD-02","isu302": "ISU302","iscu302": "ISU302","vprn": "VPRN"
    }
  }
};

function stripInterventionDecoration(value:string){
  return value
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|ml|units?|u)\s*(?:\/\s*kg)?\b/gi," ")
    .replace(/\b(?:oral|intravenous|iv|subcutaneous|sc|tablet|capsule|solution|infusion|injection)\b/gi," ")
    .replace(/[(),]/g," ")
    .replace(/\s+/g," ").trim();
}

function registryLookup(registry:Record<string,string>|undefined,key:string){
  if(!registry)return undefined;
  if(registry[key])return registry[key];
  // Trial interventions frequently append dose/formulation text. Prefer the longest known alias prefix.
  const aliases=Object.keys(registry).sort((a,b)=>b.length-a.length);
  const match=aliases.find(alias=>key===alias||key.startsWith(`${alias} `));
  return match?registry[match]:undefined;
}

export function assessTherapyIdentity(diseaseName: string, candidateName: string): TherapyIdentityAssessment {
  const originalName=candidateName;
  const canonicalInput = normalizeCandidateName(stripInterventionDecoration(candidateName));
  const key = normalizedCandidateKey(canonicalInput);
  const rationale: string[] = [];

  if (nonDrugPatterns.some((pattern) => pattern.test(canonicalInput))) {
    rationale.push("Clinical-trial intervention is not a specific repurposable drug asset.");
    return { canonicalName: canonicalInput, normalizedKey: key, identityClass: "NON_DRUG_INTERVENTION", noveltyCap: 0, benchmark: false, eligibleForFastTrack: false, aliasMatched:normalizedCandidateKey(originalName)!==key, originalName, rationale };
  }

  const registry = diseaseTherapyRegistry[normalizedCandidateKey(diseaseName)];
  const standardCanonical = registryLookup(registry?.standard,key);
  if (standardCanonical) {
    rationale.push("Known same-disease standard therapy; retained as a positive-control benchmark rather than a discovery candidate.");
    if(normalizedCandidateKey(originalName)!==normalizedCandidateKey(standardCanonical))rationale.push(`Alias/dose-form resolved to ${standardCanonical}.`);
    return { canonicalName: standardCanonical, normalizedKey: normalizedCandidateKey(standardCanonical), identityClass: "STANDARD_OF_CARE", noveltyCap: 5, benchmark: true, eligibleForFastTrack: false, aliasMatched:normalizedCandidateKey(originalName)!==normalizedCandidateKey(standardCanonical), originalName, rationale };
  }

  const programCanonical = registryLookup(registry?.programs,key);
  if (programCanonical) {
    rationale.push("Known disease-specific development program; clinical readiness may be high, but repurposing novelty is low.");
    return { canonicalName: programCanonical, normalizedKey: normalizedCandidateKey(programCanonical), identityClass: "KNOWN_DISEASE_PROGRAM", noveltyCap: 20, benchmark: false, eligibleForFastTrack: false, aliasMatched:normalizedCandidateKey(originalName)!==normalizedCandidateKey(programCanonical), originalName, rationale };
  }

  return { canonicalName: canonicalInput, normalizedKey: key, identityClass: "REPURPOSING_ELIGIBLE", noveltyCap: 100, benchmark: false, eligibleForFastTrack: true, aliasMatched:normalizedCandidateKey(originalName)!==key, originalName, rationale: ["No same-disease standard-therapy or known-program match was found in the current CRN-2.3.1 registry."] };
}
