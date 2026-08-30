import { researchDb } from "./supabase-rest";

const positiveRelations = new Set(["TREAT", "PREVENT", "INHIBIT", "STIMULATE", "POSITIVE_CORRELATE", "ASSOCIATE"]);
const negativeRelations = new Set(["CAUSE", "NEGATIVE_CORRELATE"]);

type GeneratedRow = {
  id: string;
  disease_id: string;
  drug_name: string;
  drug_normalized_id: string | null;
  relation_type: string;
  evidence_count: number;
  mean_evidence_quality: number;
  max_evidence_quality: number;
  confidence: number;
  novelty_score: number;
  generation_score: number;
};

type RelationRow = {
  evidence_id: string;
  relation_type: string;
  entity1_type: string | null;
  entity1_id: string | null;
  entity1_text: string | null;
  entity2_type: string | null;
  entity2_id: string | null;
  entity2_text: string | null;
};

type EvidenceRow = { id: string; disease_id: string; title: string; source_type: string; evidence_class: string };
type TrialRow = { source_id: string | null; title: string; evidence_class: string };
type ExistingCandidate = { disease_id: string; drug_name: string };

function normalize(value?: string | null) {
  return value?.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim() ?? "";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
}

function isDrug(type?: string | null) {
  const t = type?.toUpperCase();
  return t === "CHEMICAL" || t === "DRUG";
}

function relationDrug(relation: RelationRow) {
  if (isDrug(relation.entity1_type)) return { name: relation.entity1_text ?? "", id: relation.entity1_id ?? undefined };
  if (isDrug(relation.entity2_type)) return { name: relation.entity2_text ?? "", id: relation.entity2_id ?? undefined };
  return undefined;
}

function humanExposureScore(evidence: EvidenceRow[], drugName: string) {
  const drug = normalize(drugName);
  if (!drug) return 0;
  const matching = evidence.filter((row) => normalize(row.title).includes(drug));
  if (matching.length === 0) return 20;
  let score = 30;
  for (const item of matching) {
    const t = normalize(item.title);
    if (item.evidence_class === "E1") score += 25;
    else if (item.evidence_class === "E2" || item.evidence_class === "E3") score += 15;
    else if (item.evidence_class === "E4" || item.evidence_class === "E5") score += 8;
    if (/phase 3|phase iii|randomized|randomised|approved|safety|pharmacokinetic|pk|dose/i.test(t)) score += 8;
  }
  return clamp(score);
}

function developmentReadinessScore(humanExposure: number, evidenceCount: number, meanQuality: number) {
  const breadth = clamp(25 + Math.min(evidenceCount, 8) * 9);
  return clamp(humanExposure * 0.45 + meanQuality * 0.35 + breadth * 0.20);
}

function route(score: number, negativePenalty: number, competitionPenalty: number) {
  if (negativePenalty >= 60) return "DEPRIORITIZE" as const;
  if (score >= 75 && competitionPenalty < 45) return "FAST_TRACK_DRA" as const;
  if (score >= 60) return "DRA_REVIEW" as const;
  if (score >= 45) return "HOLD" as const;
  return "DEPRIORITIZE" as const;
}

export async function rankGeneratedCandidatesV2(diseaseName?: string) {
  const diseaseFilter = diseaseName
    ? `&research_diseases.canonical_name=eq.${encodeURIComponent(diseaseName)}`
    : "";

  const diseases = await researchDb<Array<{ id: string; canonical_name: string }>>(
    `research_diseases?select=id,canonical_name${diseaseFilter}`,
  );
  const diseaseIds = diseases.map((d) => d.id);
  if (diseaseIds.length === 0) return { ranked: 0, fastTrack: 0, review: 0 };
  const inDiseases = `(${diseaseIds.join(",")})`;

  const [generated, evidence, existingCandidates] = await Promise.all([
    researchDb<GeneratedRow[]>(`generated_candidate_hypotheses?disease_id=in.${inDiseases}&status=in.(PROPOSED,REVIEW)&select=id,disease_id,drug_name,drug_normalized_id,relation_type,evidence_count,mean_evidence_quality,max_evidence_quality,confidence,novelty_score,generation_score`),
    researchDb<EvidenceRow[]>(`research_evidence?disease_id=in.${inDiseases}&select=id,disease_id,title,source_type,evidence_class`),
    researchDb<ExistingCandidate[]>(`repurposing_candidates?select=disease_id,drug_name`),
  ]);

  if (generated.length === 0) return { ranked: 0, fastTrack: 0, review: 0 };
  const evidenceIds = evidence.map((e) => e.id);
  const relations = evidenceIds.length
    ? await researchDb<RelationRow[]>(`research_evidence_relations?evidence_id=in.(${evidenceIds.join(",")})&select=evidence_id,relation_type,entity1_type,entity1_id,entity1_text,entity2_type,entity2_id,entity2_text`)
    : [];

  const evidenceById = new Map(evidence.map((e) => [e.id, e]));
  const currentCandidatePairs = new Set(existingCandidates.map((c) => `${c.disease_id}|${normalize(c.drug_name)}`));
  const crossDisease = new Map<string, { diseases: Set<string>; evidenceIds: Set<string>; positive: number; negative: number; qualities: number[]; drugName: string; drugId?: string }>();

  const generatedQualityByDrug = new Map<string, number[]>();
  for (const row of generated) {
    const key = row.drug_normalized_id ? `ID:${row.drug_normalized_id}` : `NAME:${normalize(row.drug_name)}`;
    const arr = generatedQualityByDrug.get(key) ?? [];
    arr.push(Number(row.mean_evidence_quality));
    generatedQualityByDrug.set(key, arr);
  }

  for (const relation of relations) {
    const drug = relationDrug(relation);
    if (!drug?.name) continue;
    const evidenceRow = evidenceById.get(relation.evidence_id);
    if (!evidenceRow) continue;
    const key = drug.id ? `ID:${drug.id}` : `NAME:${normalize(drug.name)}`;
    const group = crossDisease.get(key) ?? { diseases: new Set<string>(), evidenceIds: new Set<string>(), positive: 0, negative: 0, qualities: generatedQualityByDrug.get(key) ?? [], drugName: drug.name, drugId: drug.id };
    group.diseases.add(evidenceRow.disease_id);
    group.evidenceIds.add(relation.evidence_id);
    const type = relation.relation_type.toUpperCase();
    if (positiveRelations.has(type)) group.positive += 1;
    if (negativeRelations.has(type)) group.negative += 1;
    crossDisease.set(key, group);
  }

  for (const [drugKey, group] of crossDisease) {
    const meanQuality = group.qualities.length ? group.qualities.reduce((a, b) => a + b, 0) / group.qualities.length : 45;
    const exposure = humanExposureScore(evidence, group.drugName);
    await researchDb<unknown>("drug_cross_disease_signals?on_conflict=drug_key", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: {
        drug_key: drugKey,
        drug_name: group.drugName,
        drug_normalized_id: group.drugId ?? null,
        disease_count: group.diseases.size,
        evidence_count: group.evidenceIds.size,
        positive_signal_count: group.positive,
        negative_signal_count: group.negative,
        mean_evidence_quality: clamp(meanQuality),
        human_exposure_score: exposure,
        updated_at: new Date().toISOString(),
      },
    });
  }

  let fastTrack = 0;
  let review = 0;
  for (const candidate of generated) {
    const drugKey = candidate.drug_normalized_id ? `ID:${candidate.drug_normalized_id}` : `NAME:${normalize(candidate.drug_name)}`;
    const cross = crossDisease.get(drugKey);
    const crossDiseaseSupport = cross?.diseases.size ?? 1;
    const positive = cross?.positive ?? (positiveRelations.has(candidate.relation_type.toUpperCase()) ? 1 : 0);
    const negative = cross?.negative ?? 0;
    const totalSignal = Math.max(1, positive + negative);
    const negativePenalty = clamp((negative / totalSignal) * 100);

    const sameDiseaseKnown = currentCandidatePairs.has(`${candidate.disease_id}|${normalize(candidate.drug_name)}`);
    const competitionPenalty = sameDiseaseKnown ? 75 : crossDiseaseSupport >= 4 ? 35 : crossDiseaseSupport >= 2 ? 20 : 10;
    const exposure = humanExposureScore(evidence.filter((e) => e.disease_id === candidate.disease_id), candidate.drug_name);
    const readiness = developmentReadinessScore(exposure, Number(candidate.evidence_count), Number(candidate.mean_evidence_quality));
    const crossSupportScore = clamp(30 + Math.min(crossDiseaseSupport, 5) * 12);
    const adjustedNovelty = clamp(Number(candidate.novelty_score) - competitionPenalty * 0.55);
    const preliminaryDra = clamp(
      Number(candidate.mean_evidence_quality) * 0.24 +
      Number(candidate.confidence) * 0.18 +
      readiness * 0.22 +
      exposure * 0.14 +
      adjustedNovelty * 0.12 +
      crossSupportScore * 0.10 -
      negativePenalty * 0.28,
    );
    const routingDecision = route(preliminaryDra, negativePenalty, competitionPenalty);
    if (routingDecision === "FAST_TRACK_DRA") fastTrack += 1;
    if (routingDecision === "DRA_REVIEW") review += 1;

    await researchDb<unknown>(`generated_candidate_hypotheses?id=eq.${candidate.id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: {
        cross_disease_support: crossDiseaseSupport,
        negative_evidence_penalty: negativePenalty,
        competition_penalty: competitionPenalty,
        human_exposure_score: exposure,
        development_readiness_score: readiness,
        novelty_score: adjustedNovelty,
        preliminary_dra_score: preliminaryDra,
        routing_decision: routingDecision,
        ranking_version: "CRN-2.0",
        ranking_rationale: {
          crossDiseaseSupport,
          positiveSignals: positive,
          negativeSignals: negative,
          humanExposure: exposure,
          developmentReadiness: readiness,
          adjustedNovelty,
          competitionPenalty,
          negativePenalty,
        },
        updated_at: new Date().toISOString(),
      },
    });
  }

  return { ranked: generated.length, fastTrack, review };
}
