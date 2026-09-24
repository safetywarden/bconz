import type { NormalizedEvidence } from "./ingestion/types";
import type { PubTatorExtraction } from "./ingestion/pubtator3";

export type MaterialChange = {
  sourceType: string;
  sourceId: string;
  eventDate: string;
  severity: "RED" | "AMBER" | "GREEN";
  triggerType: string;
  development: string;
  impact: string;
  estimatedScoreDelta: number;
  materialReviewRequired: boolean;
};

const redPatterns = [
  /phase\s*(3|iii)/i,
  /randomi[sz]ed/i,
  /approved|approval|authori[sz]ation/i,
  /boxed warning|withdrawn|withdrawal|terminated for safety|serious adverse/i,
  /guideline|consensus recommendation/i,
];

const amberPatterns = [
  /phase\s*(1|2|i|ii)/i,
  /prospective/i,
  /biomarker|genotype|variant|founder mutation/i,
  /drug repurpos|off-label|responder/i,
  /clinical trial|interventional/i,
];

const highSignalRelations = new Set([
  "TREAT",
  "CAUSE",
  "PREVENT",
  "INHIBIT",
  "STIMULATE",
  "POSITIVE_CORRELATE",
  "NEGATIVE_CORRELATE",
  "DRUG_INTERACT",
]);

export function detectMaterialChanges(
  evidence: NormalizedEvidence[],
  pubtator: PubTatorExtraction,
): MaterialChange[] {
  const relationBySource = new Map<string, string[]>();
  for (const relation of pubtator.relations) {
    const current = relationBySource.get(relation.evidenceSourceId) ?? [];
    current.push(relation.relationType.toUpperCase());
    relationBySource.set(relation.evidenceSourceId, current);
  }

  return evidence.map((item) => {
    const text = `${item.title} ${item.extractedClaim}`;
    const relations = relationBySource.get(item.sourceId) ?? [];
    const relationSignal = relations.some((relation) => highSignalRelations.has(relation));
    const red = redPatterns.some((pattern) => pattern.test(text));
    const amber = amberPatterns.some((pattern) => pattern.test(text)) || relationSignal;

    if (red) {
      return {
        sourceType: item.sourceType,
        sourceId: item.sourceId,
        eventDate: item.publicationDate ?? new Date().toISOString().slice(0, 10),
        severity: "RED" as const,
        triggerType: "MAJOR_EVIDENCE_EVENT",
        development: item.title,
        impact: "Potentially changes standard of care, safety, pivotal efficacy, regulatory status, or core RDIA/DRA assumptions.",
        estimatedScoreDelta: 5,
        materialReviewRequired: true,
      };
    }

    if (amber) {
      return {
        sourceType: item.sourceType,
        sourceId: item.sourceId,
        eventDate: item.publicationDate ?? new Date().toISOString().slice(0, 10),
        severity: "AMBER" as const,
        triggerType: relationSignal ? "BIOLOGICAL_RELATION_SIGNAL" : "TRANSLATIONAL_EVIDENCE_EVENT",
        development: item.title,
        impact: "May alter mechanism, responder, biomarker, trial, competitive, or validation assumptions and should enter the next scientific review cycle.",
        estimatedScoreDelta: 2,
        materialReviewRequired: false,
      };
    }

    return {
      sourceType: item.sourceType,
      sourceId: item.sourceId,
      eventDate: item.publicationDate ?? new Date().toISOString().slice(0, 10),
      severity: "GREEN" as const,
      triggerType: "INCREMENTAL_EVIDENCE",
      development: item.title,
      impact: "Incremental evidence stored for longitudinal intelligence; no immediate portfolio review indicated.",
      estimatedScoreDelta: 0,
      materialReviewRequired: false,
    };
  });
}
