import { researchDb } from "./supabase-rest";

export type EvidenceQualityScore = {
  evidenceId: string;
  sourceQuality: number;
  studyDesignQuality: number;
  humanRelevance: number;
  recency: number;
  ontologyResolution: number;
  reproducibilitySignal: number;
  compositeScore: number;
  rationale: Record<string, string | number | boolean>;
};

type EvidenceRow = {
  id: string;
  source_type: string;
  evidence_class: string;
  publication_date: string | null;
  title: string;
  extracted_claim: string;
  population: string | null;
};

type ResolutionRow = { evidence_entity_id: string; confidence: number };
type EvidenceEntityRow = { id: string; evidence_id: string };

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
}

function designScore(evidenceClass: string) {
  const scores: Record<string, number> = { E1: 100, E2: 90, E3: 80, E4: 65, E5: 50, E6: 40, E7: 30, E8: 20, H: 35 };
  return scores[evidenceClass] ?? 35;
}

function sourceScore(sourceType: string) {
  if (sourceType === "CLINICAL_TRIALS") return 90;
  if (sourceType === "PUBMED") return 85;
  return 60;
}

function recencyScore(publicationDate: string | null) {
  if (!publicationDate) return 50;
  const date = new Date(publicationDate);
  if (Number.isNaN(date.getTime())) return 50;
  const ageYears = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (ageYears <= 2) return 100;
  if (ageYears <= 5) return 85;
  if (ageYears <= 10) return 65;
  return 45;
}

function humanScore(row: EvidenceRow) {
  const text = `${row.title} ${row.extracted_claim} ${row.population ?? ""}`.toLowerCase();
  if (/randomi[sz]ed|patient|human|clinical trial|cohort|prospective|retrospective/.test(text)) return 95;
  if (/mouse|mice|murine|rat|zebrafish|cell line|in vitro|in-vitro/.test(text)) return 35;
  return 60;
}

function reproducibilityScore(text: string) {
  const t = text.toLowerCase();
  let score = 50;
  if (/multicenter|multi-center|replicat|validation cohort|independent cohort/.test(t)) score += 25;
  if (/systematic review|meta-analysis/.test(t)) score += 20;
  if (/single center|single-centre|case report/.test(t)) score -= 15;
  return clamp(score);
}

export async function scoreEvidenceQuality(diseaseName: string) {
  const diseases = await researchDb<{ id: string }[]>(`research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id`);
  const diseaseId = diseases[0]?.id;
  if (!diseaseId) return { scored: 0, scores: [] as EvidenceQualityScore[] };

  const evidence = await researchDb<EvidenceRow[]>(
    `research_evidence?disease_id=eq.${diseaseId}&select=id,source_type,evidence_class,publication_date,title,extracted_claim,population`,
  );
  if (evidence.length === 0) return { scored: 0, scores: [] as EvidenceQualityScore[] };

  const entities = await researchDb<EvidenceEntityRow[]>(
    `research_evidence_entities?evidence_id=in.(${evidence.map((row) => row.id).join(",")})&select=id,evidence_id`,
  );
  const resolutions = entities.length > 0
    ? await researchDb<ResolutionRow[]>(
      `evidence_entity_resolutions?evidence_entity_id=in.(${entities.map((row) => row.id).join(",")})&select=evidence_entity_id,confidence`,
    )
    : [];
  const resolutionByEntity = new Map(resolutions.map((row) => [row.evidence_entity_id, Number(row.confidence)]));
  const entitiesByEvidence = new Map<string, EvidenceEntityRow[]>();
  for (const entity of entities) {
    const current = entitiesByEvidence.get(entity.evidence_id) ?? [];
    current.push(entity);
    entitiesByEvidence.set(entity.evidence_id, current);
  }

  const scores = evidence.map((row): EvidenceQualityScore => {
    const evidenceEntities = entitiesByEvidence.get(row.id) ?? [];
    const resolvedConfidences = evidenceEntities.map((entity) => resolutionByEntity.get(entity.id)).filter((value): value is number => value !== undefined);
    const ontologyResolution = evidenceEntities.length === 0 ? 50 : resolvedConfidences.length === 0 ? 25 : resolvedConfidences.reduce((a, b) => a + b, 0) / evidenceEntities.length;
    const sourceQuality = sourceScore(row.source_type);
    const studyDesignQuality = designScore(row.evidence_class);
    const humanRelevance = humanScore(row);
    const recency = recencyScore(row.publication_date);
    const reproducibilitySignal = reproducibilityScore(`${row.title} ${row.extracted_claim}`);
    const compositeScore = clamp(
      sourceQuality * 0.15 +
      studyDesignQuality * 0.25 +
      humanRelevance * 0.20 +
      recency * 0.15 +
      ontologyResolution * 0.15 +
      reproducibilitySignal * 0.10,
    );

    return {
      evidenceId: row.id,
      sourceQuality,
      studyDesignQuality,
      humanRelevance,
      recency,
      ontologyResolution: clamp(ontologyResolution),
      reproducibilitySignal,
      compositeScore,
      rationale: {
        sourceType: row.source_type,
        evidenceClass: row.evidence_class,
        resolvedEntityFraction: evidenceEntities.length === 0 ? 0 : resolvedConfidences.length / evidenceEntities.length,
      },
    };
  });

  await researchDb<unknown>("evidence_quality_scores?on_conflict=evidence_id,scoring_version", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: scores.map((score) => ({
      evidence_id: score.evidenceId,
      source_quality: score.sourceQuality,
      study_design_quality: score.studyDesignQuality,
      human_relevance: score.humanRelevance,
      recency: score.recency,
      ontology_resolution: score.ontologyResolution,
      reproducibility_signal: score.reproducibilitySignal,
      composite_score: score.compositeScore,
      rationale: score.rationale,
      scoring_version: "EQS-1.0",
      updated_at: new Date().toISOString(),
    })),
  });

  return { scored: scores.length, scores };
}
