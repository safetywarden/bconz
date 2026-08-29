import type { NormalizedEvidence } from "./ingestion/types";
import type { PubTatorExtraction, PubTatorRelation } from "./ingestion/pubtator3";

export type HypothesisDirection = "STRENGTHEN" | "WEAKEN" | "KILL" | "NEUTRAL";

export type CandidateHypothesis = {
  candidateId?: string;
  diseaseName: string;
  drugName: string;
  responderHypothesis?: string;
  biomarker?: string;
  regimenConcept?: string;
  currentDraScore?: number;
};

export type HypothesisImpact = {
  sourceType: string;
  sourceId: string;
  candidateId?: string;
  diseaseName: string;
  drugName: string;
  direction: HypothesisDirection;
  confidence: number;
  proposedDraDelta: number;
  proposedRdiaDelta: number;
  hardGateCandidate: boolean;
  rationale: string;
  matchedSignals: string[];
  requiresHumanReview: boolean;
};

const positiveRelationTypes = new Set(["TREAT", "PREVENT", "STIMULATE", "POSITIVE_CORRELATE"]);
const negativeRelationTypes = new Set(["CAUSE", "NEGATIVE_CORRELATE"]);

const killPatterns = [
  /failed to meet (the )?(primary|key) endpoint/i,
  /no significant (clinical )?benefit/i,
  /lack of efficacy/i,
  /terminated for (safety|toxicity)/i,
  /unacceptable toxicity/i,
  /contraindicat/i,
  /withdrawn due to safety/i,
];

const weakenPatterns = [
  /did not improve/i,
  /not associated with (improvement|benefit)/i,
  /adverse event/i,
  /dose[- ]limiting/i,
  /poor tolerability/i,
  /insufficient exposure/i,
];

const strengthenPatterns = [
  /responder/i,
  /biomarker/i,
  /improved|improvement|benefit/i,
  /target engagement/i,
  /dose[- ]response/i,
  /genotype|variant/i,
  /prospective|randomi[sz]ed/i,
];

function normalized(value?: string) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? "";
}

function drugMentioned(candidate: CandidateHypothesis, text: string, relations: PubTatorRelation[]) {
  const drug = normalized(candidate.drugName);
  if (!drug) return false;
  if (normalized(text).includes(drug)) return true;
  return relations.some((relation) =>
    [relation.entity1Text, relation.entity2Text].some((value) => normalized(value).includes(drug)),
  );
}

function biomarkerMentioned(candidate: CandidateHypothesis, text: string) {
  const biomarker = normalized(candidate.biomarker);
  if (!biomarker) return false;
  return normalized(text).includes(biomarker);
}

function relatedRelations(candidate: CandidateHypothesis, relations: PubTatorRelation[]) {
  const drug = normalized(candidate.drugName);
  return relations.filter((relation) => {
    const left = normalized(relation.entity1Text);
    const right = normalized(relation.entity2Text);
    return Boolean(drug && (left.includes(drug) || right.includes(drug)));
  });
}

export function detectHypothesisImpacts(
  evidence: NormalizedEvidence[],
  pubtator: PubTatorExtraction,
  hypotheses: CandidateHypothesis[],
): HypothesisImpact[] {
  const relationsBySource = new Map<string, PubTatorRelation[]>();
  for (const relation of pubtator.relations) {
    const existing = relationsBySource.get(relation.evidenceSourceId) ?? [];
    existing.push(relation);
    relationsBySource.set(relation.evidenceSourceId, existing);
  }

  const impacts: HypothesisImpact[] = [];

  for (const item of evidence) {
    const text = `${item.title} ${item.extractedClaim}`;
    const sourceRelations = relationsBySource.get(item.sourceId) ?? [];

    for (const hypothesis of hypotheses) {
      if (normalized(hypothesis.diseaseName) !== normalized(item.diseaseName)) continue;
      if (!drugMentioned(hypothesis, text, sourceRelations)) continue;

      const matchedSignals: string[] = [];
      const rels = relatedRelations(hypothesis, sourceRelations);
      const hasPositiveRelation = rels.some((relation) => positiveRelationTypes.has(relation.relationType.toUpperCase()));
      const hasNegativeRelation = rels.some((relation) => negativeRelationTypes.has(relation.relationType.toUpperCase()));
      const hardKill = killPatterns.some((pattern) => pattern.test(text));
      const weaken = weakenPatterns.some((pattern) => pattern.test(text)) || hasNegativeRelation;
      const strengthen = strengthenPatterns.some((pattern) => pattern.test(text)) || hasPositiveRelation;
      const biomarkerHit = biomarkerMentioned(hypothesis, text);

      if (hardKill) matchedSignals.push("fatal-negative-human/safety signal");
      if (hasNegativeRelation) matchedSignals.push("negative PubTator relation");
      if (hasPositiveRelation) matchedSignals.push("positive PubTator relation");
      if (biomarkerHit) matchedSignals.push("candidate biomarker matched");
      if (strengthen) matchedSignals.push("supportive translational/clinical language");
      if (weaken) matchedSignals.push("negative efficacy/safety language");

      let direction: HypothesisDirection = "NEUTRAL";
      let proposedDraDelta = 0;
      let proposedRdiaDelta = 0;
      let hardGateCandidate = false;
      let confidence = 55;

      if (hardKill) {
        direction = "KILL";
        proposedDraDelta = -20;
        proposedRdiaDelta = -5;
        hardGateCandidate = true;
        confidence = 90;
      } else if (weaken && !strengthen) {
        direction = "WEAKEN";
        proposedDraDelta = -5;
        proposedRdiaDelta = -2;
        confidence = hasNegativeRelation ? 80 : 70;
      } else if (strengthen) {
        direction = "STRENGTHEN";
        proposedDraDelta = biomarkerHit ? 5 : 3;
        proposedRdiaDelta = biomarkerHit ? 2 : 1;
        confidence = hasPositiveRelation || biomarkerHit ? 80 : 70;
      }

      impacts.push({
        sourceType: item.sourceType,
        sourceId: item.sourceId,
        candidateId: hypothesis.candidateId,
        diseaseName: hypothesis.diseaseName,
        drugName: hypothesis.drugName,
        direction,
        confidence,
        proposedDraDelta,
        proposedRdiaDelta,
        hardGateCandidate,
        rationale: direction === "KILL"
          ? "New evidence may invalidate a DRA hard-gate assumption and requires immediate expert review."
          : direction === "WEAKEN"
            ? "New evidence appears inconsistent with efficacy, safety, exposure, or responder assumptions."
            : direction === "STRENGTHEN"
              ? "New evidence supports the drug-disease, responder, biomarker, or translational hypothesis."
              : "Evidence mentions the candidate but does not yet justify a score change.",
        matchedSignals,
        requiresHumanReview: direction !== "NEUTRAL",
      });
    }
  }

  return impacts;
}
