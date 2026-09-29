import { calculateWeightedScore, type ScoreInput, type WeightedCriterion } from "./scoring";

export const RDIA_CRITERIA: WeightedCriterion[] = [
  { key: "mechanisticClarity", weight: 10 },
  { key: "repurposingTractability", weight: 10 },
  { key: "humanPharmacologicalEvidence", weight: 5 },
  { key: "biomarkerEndpointQuality", weight: 5 },
  { key: "stratificationOpportunity", weight: 5 },
  { key: "cohortAccessibility", weight: 10 },
  { key: "indiaSpecificGenetics", weight: 7 },
  { key: "longitudinalData", weight: 4 },
  { key: "biospecimenOmicsAccess", weight: 4 },
  { key: "prospectiveValidationFeasibility", weight: 6 },
  { key: "measurableResponse", weight: 5 },
  { key: "drugSafetyPkKnowledge", weight: 4 },
  { key: "indiaTrialFeasibility", weight: 5 },
  { key: "unmetNeed", weight: 5 },
  { key: "competitiveWhitespace", weight: 5 },
  { key: "ipDefensibility", weight: 5 },
  { key: "globalPotential", weight: 5 },
];

export const RDIA_CONFIDENCE_CRITERIA: WeightedCriterion[] = [
  { key: "evidenceBreadth", weight: 25 },
  { key: "indiaEvidenceStrength", weight: 35 },
  { key: "evidenceRecency", weight: 20 },
  { key: "sourceQuality", weight: 20 },
];

export type RdiaStatus = "ACTIVE" | "INVESTIGATE" | "WATCHLIST" | "MONITOR";

export function classifyRdia(opportunity: number, confidence: number): RdiaStatus {
  if (opportunity >= 75 && confidence >= 60) return "ACTIVE";
  if (opportunity >= 75) return "INVESTIGATE";
  if (opportunity >= 55) return "WATCHLIST";
  return "MONITOR";
}

export function scoreRdia(opportunityInput: ScoreInput, confidenceInput: ScoreInput) {
  const opportunity = calculateWeightedScore(opportunityInput, RDIA_CRITERIA);
  const confidence = calculateWeightedScore(confidenceInput, RDIA_CONFIDENCE_CRITERIA);
  return { opportunity, confidence, status: classifyRdia(opportunity.score, confidence.score) };
}
