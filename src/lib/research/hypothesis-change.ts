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
  aliases?: string[];
  diseaseAliases?: string[];
  mechanismTerms?: string[];
  biomarkerTerms?: string[];
  phenotypeTerms?: string[];
  genotypeTerms?: string[];
  regimenTerms?: string[];
  positiveSignalTerms?: string[];
  negativeSignalTerms?: string[];
  killCriteria?: string[];
  responderSubgroup?: string;
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

const defaultKillPatterns = [
  /failed to meet (the )?(primary|key) endpoint/i,
  /no significant (clinical )?benefit/i,
  /lack of efficacy/i,
  /terminated for (safety|toxicity)/i,
  /unacceptable toxicity/i,
  /contraindicat/i,
  /withdrawn due to safety/i,
];

const defaultWeakenPatterns = [
  /did not improve/i,
  /not associated with (improvement|benefit)/i,
  /adverse event/i,
  /dose[- ]limiting/i,
  /poor tolerability/i,
  /insufficient exposure/i,
];

const defaultStrengthenPatterns = [
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

function anyTermMentioned(terms: string[] | undefined, text: string) {
  const haystack = normalized(text);
  return (terms ?? []).some((term) => {
    const needle = normalized(term);
    return needle.length >= 2 && haystack.includes(needle);
  });
}

function candidateDrugTerms(candidate: CandidateHypothesis) {
  return [...new Set([candidate.drugName, ...(candidate.aliases ?? [])].filter(Boolean))];
}

function diseaseMatches(candidate: CandidateHypothesis, diseaseName: string) {
  const incoming = normalized(diseaseName);
  return [candidate.diseaseName, ...(candidate.diseaseAliases ?? [])]
    .some((term) => normalized(term) === incoming);
}

function drugMentioned(candidate: CandidateHypothesis, text: string, relations: PubTatorRelation[]) {
  const drugTerms = candidateDrugTerms(candidate).map(normalized).filter(Boolean);
  const body = normalized(text);
  if (drugTerms.some((term) => body.includes(term))) return true;

  return relations.some((relation) => {
    const values = [normalized(relation.entity1Text), normalized(relation.entity2Text)];
    return drugTerms.some((term) => values.some((value) => value.includes(term)));
  });
}

function relatedRelations(candidate: CandidateHypothesis, relations: PubTatorRelation[]) {
  const drugTerms = candidateDrugTerms(candidate).map(normalized).filter(Boolean);
  return relations.filter((relation) => {
    const left = normalized(relation.entity1Text);
    const right = normalized(relation.entity2Text);
    return drugTerms.some((term) => left.includes(term) || right.includes(term));
  });
}

function candidateSpecificKill(candidate: CandidateHypothesis, text: string) {
  const body = normalized(text);
  return (candidate.killCriteria ?? []).some((criterion) => {
    const terms = normalized(criterion).split(" ").filter((term) => term.length >= 5);
    return terms.length >= 2 && terms.filter((term) => body.includes(term)).length >= Math.min(3, terms.length);
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
      if (!diseaseMatches(hypothesis, item.diseaseName)) continue;
      if (!drugMentioned(hypothesis, text, sourceRelations)) continue;

      const matchedSignals: string[] = [];
      const rels = relatedRelations(hypothesis, sourceRelations);
      const hasPositiveRelation = rels.some((relation) => positiveRelationTypes.has(relation.relationType.toUpperCase()));
      const hasNegativeRelation = rels.some((relation) => negativeRelationTypes.has(relation.relationType.toUpperCase()));
      const hardKill = defaultKillPatterns.some((pattern) => pattern.test(text)) || candidateSpecificKill(hypothesis, text);
      const customNegative = anyTermMentioned(hypothesis.negativeSignalTerms, text);
      const customPositive = anyTermMentioned(hypothesis.positiveSignalTerms, text);
      const weaken = defaultWeakenPatterns.some((pattern) => pattern.test(text)) || hasNegativeRelation || customNegative;
      const strengthen = defaultStrengthenPatterns.some((pattern) => pattern.test(text)) || hasPositiveRelation || customPositive;

      const biomarkerHit = anyTermMentioned(
        [hypothesis.biomarker ?? "", ...(hypothesis.biomarkerTerms ?? [])].filter(Boolean),
        text,
      );
      const genotypeHit = anyTermMentioned(hypothesis.genotypeTerms, text);
      const mechanismHit = anyTermMentioned(hypothesis.mechanismTerms, text);
      const phenotypeHit = anyTermMentioned(hypothesis.phenotypeTerms, text);
      const regimenHit = anyTermMentioned(hypothesis.regimenTerms, text);

      if (hardKill) matchedSignals.push("candidate kill/hard-gate signal");
      if (hasNegativeRelation) matchedSignals.push("negative PubTator relation");
      if (hasPositiveRelation) matchedSignals.push("positive PubTator relation");
      if (biomarkerHit) matchedSignals.push("candidate biomarker matched");
      if (genotypeHit) matchedSignals.push("candidate genotype matched");
      if (mechanismHit) matchedSignals.push("candidate mechanism matched");
      if (phenotypeHit) matchedSignals.push("candidate phenotype matched");
      if (regimenHit) matchedSignals.push("candidate regimen matched");
      if (customPositive) matchedSignals.push("registry positive signal matched");
      if (customNegative) matchedSignals.push("registry negative signal matched");
      if (strengthen) matchedSignals.push("supportive translational/clinical language");
      if (weaken) matchedSignals.push("negative efficacy/safety language");

      const specificityHits = [biomarkerHit, genotypeHit, mechanismHit, phenotypeHit, regimenHit].filter(Boolean).length;
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
        confidence = Math.min(95, 88 + specificityHits * 2);
      } else if (weaken && !strengthen) {
        direction = "WEAKEN";
        proposedDraDelta = specificityHits >= 2 ? -7 : -5;
        proposedRdiaDelta = specificityHits >= 2 ? -3 : -2;
        confidence = Math.min(90, (hasNegativeRelation || customNegative ? 78 : 68) + specificityHits * 3);
      } else if (strengthen) {
        direction = "STRENGTHEN";
        proposedDraDelta = specificityHits >= 2 ? 5 : 3;
        proposedRdiaDelta = specificityHits >= 2 ? 2 : 1;
        confidence = Math.min(92, (hasPositiveRelation || customPositive ? 78 : 68) + specificityHits * 3);
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
          ? "New evidence may invalidate a candidate-specific DRA hard-gate or kill criterion and requires immediate expert review."
          : direction === "WEAKEN"
            ? "New evidence conflicts with candidate efficacy, safety, exposure, responder, biomarker, genotype, or mechanism assumptions."
            : direction === "STRENGTHEN"
              ? "New evidence supports the candidate drug-disease, responder, biomarker, genotype, mechanism, phenotype, or regimen hypothesis."
              : "Evidence mentions the candidate but does not yet justify a score change.",
        matchedSignals,
        requiresHumanReview: direction !== "NEUTRAL",
      });
    }
  }

  return impacts;
}
