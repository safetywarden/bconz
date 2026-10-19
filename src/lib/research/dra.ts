import { calculateWeightedScore, type ScoreInput, type WeightedCriterion } from "./scoring";

export const DRA_CRITERIA: WeightedCriterion[] = [
  { key: "diseaseMechanismFit", weight: 10 },
  { key: "targetPathwayEvidence", weight: 7 },
  { key: "translationalEvidence", weight: 7 },
  { key: "genotypePhenotypeRationale", weight: 6 },
  { key: "humanSafety", weight: 7 },
  { key: "pkExposure", weight: 6 },
  { key: "relevantTissueExposure", weight: 5 },
  { key: "regulatoryClinicalHistory", weight: 4 },
  { key: "formulationDosingPracticality", weight: 3 },
  { key: "diseaseSpecificHumanEvidence", weight: 7 },
  { key: "measurableBiomarkerEndpoint", weight: 5 },
  { key: "indiaValidationFeasibility", weight: 5 },
  { key: "evidenceQuality", weight: 3 },
  { key: "unmetNeedDifferentiation", weight: 6 },
  { key: "competitiveWhitespace", weight: 6 },
  { key: "preliminaryIpDefensibility", weight: 6 },
  { key: "developmentPracticality", weight: 4 },
  { key: "globalRelevance", weight: 3 },
];

export type DraDecision = "ADVANCE" | "INVESTIGATE" | "KILL" | "BENCHMARK";

export type HardGate = {
  failed: boolean;
  reason?: string;
};

export function classifyDra(score: number, confidence: number, hardGate?: HardGate): DraDecision {
  if (hardGate?.failed) return "KILL";
  if (score >= 75 && confidence >= 70) return "ADVANCE";
  if (score >= 60) return "INVESTIGATE";
  return "KILL";
}

export function scoreDra(input: ScoreInput, confidence: number, hardGate?: HardGate) {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) {
    throw new Error("DRA confidence must be between 0 and 100");
  }
  const result = calculateWeightedScore(input, DRA_CRITERIA);
  return { ...result, confidence, decision: classifyDra(result.score, confidence, hardGate), hardGate };
}
