import { researchDb } from "../supabase-rest";
import type { MaterialChange } from "../change-detection";
import type { CandidateHypothesis, HypothesisImpact } from "../hypothesis-change";
import type { NormalizedEvidence } from "./types";
import type { PubTatorExtraction } from "./pubtator3";

type DiseaseRow = { id: string; canonical_name: string };
type EvidenceRow = { id: string; source_id: string | null };
type CandidateRow = {
  id: string;
  disease_id: string;
  drug_name: string;
  responder_hypothesis: string | null;
  biomarker: string | null;
  regimen_concept: string | null;
  dra_score: number | null;
};

async function getDiseaseId(diseaseName: string): Promise<string | undefined> {
  const rows = await researchDb<DiseaseRow[]>(
    `research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id,canonical_name`,
  );
  return rows[0]?.id;
}

export async function getCandidateHypotheses(diseaseName: string): Promise<CandidateHypothesis[]> {
  const diseaseId = await getDiseaseId(diseaseName);
  if (!diseaseId) return [];

  const rows = await researchDb<CandidateRow[]>(
    `repurposing_candidates?disease_id=eq.${diseaseId}&select=id,disease_id,drug_name,responder_hypothesis,biomarker,regimen_concept,dra_score`,
  );

  return rows.map((row) => ({
    candidateId: row.id,
    diseaseName,
    drugName: row.drug_name,
    responderHypothesis: row.responder_hypothesis ?? undefined,
    biomarker: row.biomarker ?? undefined,
    regimenConcept: row.regimen_concept ?? undefined,
    currentDraScore: row.dra_score ?? undefined,
  }));
}

export async function persistEvidence(records: NormalizedEvidence[]) {
  if (records.length === 0) return { inserted: 0, skippedUnknownDisease: 0 };

  const diseaseNames = [...new Set(records.map((record) => record.diseaseName))];
  const diseaseByName = new Map<string, string>();
  for (const diseaseName of diseaseNames) {
    const diseaseId = await getDiseaseId(diseaseName);
    if (diseaseId) diseaseByName.set(diseaseName, diseaseId);
  }

  let skippedUnknownDisease = 0;
  const rows = records.flatMap((record) => {
    const diseaseId = diseaseByName.get(record.diseaseName);
    if (!diseaseId) {
      skippedUnknownDisease += 1;
      return [];
    }
    return [{ disease_id: diseaseId, source_type: record.sourceType, source_id: record.sourceId, source_url: record.sourceUrl, title: record.title, publication_date: record.publicationDate || null, evidence_class: record.evidenceClass, population: record.population || null, extracted_claim: record.extractedClaim, confidence: record.confidence, review_state: "AI_EXTRACTED", checked_at: new Date().toISOString() }];
  });

  if (rows.length === 0) return { inserted: 0, skippedUnknownDisease };
  await researchDb<unknown>("research_evidence?on_conflict=disease_id,source_type,source_id", { method: "POST", body: rows, prefer: "resolution=merge-duplicates,return=minimal" });
  return { inserted: rows.length, skippedUnknownDisease };
}

export async function persistPubTatorExtraction(diseaseName: string, extraction: PubTatorExtraction) {
  const diseaseId = await getDiseaseId(diseaseName);
  if (!diseaseId) return { entities: 0, relations: 0 };
  const evidenceRows = await researchDb<EvidenceRow[]>(`research_evidence?disease_id=eq.${diseaseId}&source_type=eq.PUBMED&select=id,source_id`);
  const evidenceBySourceId = new Map(evidenceRows.flatMap((row) => row.source_id ? [[row.source_id, row.id] as const] : []));

  const entityRows = extraction.entities.flatMap((entity) => {
    const evidenceId = evidenceBySourceId.get(entity.evidenceSourceId);
    return evidenceId ? [{ evidence_id: evidenceId, entity_type: entity.entityType, normalized_id: entity.normalizedId ?? "", text: entity.text, source: "PUBTATOR3" }] : [];
  });
  const relationRows = extraction.relations.flatMap((relation) => {
    const evidenceId = evidenceBySourceId.get(relation.evidenceSourceId);
    return evidenceId ? [{ evidence_id: evidenceId, relation_type: relation.relationType, entity1_type: relation.entity1Type ?? null, entity1_id: relation.entity1Id ?? "", entity1_text: relation.entity1Text ?? "", entity2_type: relation.entity2Type ?? null, entity2_id: relation.entity2Id ?? "", entity2_text: relation.entity2Text ?? "", source: "PUBTATOR3" }] : [];
  });

  if (entityRows.length > 0) await researchDb<unknown>("research_evidence_entities?on_conflict=evidence_id,entity_type,normalized_id,text", { method: "POST", body: entityRows, prefer: "resolution=merge-duplicates,return=minimal" });
  if (relationRows.length > 0) await researchDb<unknown>("research_evidence_relations?on_conflict=evidence_id,relation_type,entity1_id,entity1_text,entity2_id,entity2_text", { method: "POST", body: relationRows, prefer: "resolution=merge-duplicates,return=minimal" });
  return { entities: entityRows.length, relations: relationRows.length };
}

export async function persistMaterialChanges(diseaseName: string, changes: MaterialChange[]) {
  const diseaseId = await getDiseaseId(diseaseName);
  if (!diseaseId || changes.length === 0) return { logged: 0 };
  const rows = changes.map((change) => ({ disease_id: diseaseId, event_date: change.eventDate, development: change.development, impact: change.impact, estimated_score_delta: change.estimatedScoreDelta, material_review_required: change.materialReviewRequired, severity: change.severity, trigger_type: change.triggerType, source_type: change.sourceType, source_id: change.sourceId }));
  await researchDb<unknown>("evidence_change_log?on_conflict=disease_id,source_type,source_id,trigger_type", { method: "POST", body: rows, prefer: "resolution=merge-duplicates,return=minimal" });
  return { logged: rows.length };
}

export async function persistHypothesisImpacts(diseaseName: string, impacts: HypothesisImpact[]) {
  const diseaseId = await getDiseaseId(diseaseName);
  if (!diseaseId || impacts.length === 0) return { logged: 0 };

  const rows = impacts.flatMap((impact) => {
    if (!impact.candidateId) return [];
    return [{
      candidate_id: impact.candidateId,
      disease_id: diseaseId,
      source_type: impact.sourceType,
      source_id: impact.sourceId,
      direction: impact.direction,
      confidence: impact.confidence,
      proposed_dra_delta: impact.proposedDraDelta,
      proposed_rdia_delta: impact.proposedRdiaDelta,
      hard_gate_candidate: impact.hardGateCandidate,
      rationale: impact.rationale,
      matched_signals: impact.matchedSignals,
      requires_human_review: impact.requiresHumanReview,
      review_status: "PENDING",
    }];
  });

  if (rows.length === 0) return { logged: 0 };

  await researchDb<unknown>("hypothesis_change_events?on_conflict=candidate_id,source_type,source_id", {
    method: "POST",
    body: rows,
    prefer: "resolution=merge-duplicates,return=minimal",
  });

  return { logged: rows.length };
}
