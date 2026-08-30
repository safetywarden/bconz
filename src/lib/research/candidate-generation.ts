import { normalizeCandidateName, normalizedCandidateKey } from "./candidate-eligibility";
import { researchDb } from "./supabase-rest";

const supportedRelations = new Set(["TREAT", "PREVENT", "INHIBIT", "STIMULATE", "POSITIVE_CORRELATE", "ASSOCIATE", "INFERRED_COOCCURRENCE"]);
type EvidenceRow = { id: string; title: string; source_id: string | null };
type RelationRow = { evidence_id: string; relation_type: string; entity1_type: string | null; entity1_id: string | null; entity1_text: string | null; entity2_type: string | null; entity2_id: string | null; entity2_text: string | null; source?: string | null };
type QualityRow = { evidence_id: string; composite_score: number };
type ExistingCandidate = { drug_name: string };
type ExistingGenerated = { id: string; drug_name: string; gene_name: string | null; relation_type: string };
export type GeneratedCandidate = { drugName: string; drugNormalizedId?: string; geneName?: string; geneNormalizedId?: string; relationType: string; evidenceIds: string[]; evidenceCount: number; meanEvidenceQuality: number; maxEvidenceQuality: number; confidence: number; noveltyScore: number; generationScore: number; hypothesisSummary: string; };
function normalize(value?: string | null) { return value ? normalizedCandidateKey(value) : ""; }
function isDrug(type?: string | null) { const t = type?.toUpperCase(); return t === "CHEMICAL" || t === "DRUG"; }
function isGene(type?: string | null) { return type?.toUpperCase() === "GENE"; }
function clamp(value: number) { return Math.max(0, Math.min(100, Math.round(value * 10) / 10)); }
function normalizedGene(value?: string | null) { return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? ""; }
function signature(drug: string, relation: string, gene?: string | null) { return `${normalizedCandidateKey(drug)}|${relation.toUpperCase()}|${normalizedGene(gene)}`; }

export async function generateCandidateHypotheses(diseaseName: string) {
  const diseases = await researchDb<{ id: string }[]>(`research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id`); const diseaseId = diseases[0]?.id;
  if (!diseaseId) return { generated: 0, candidates: [] as GeneratedCandidate[] };
  const evidence = await researchDb<EvidenceRow[]>(`research_evidence?disease_id=eq.${diseaseId}&select=id,title,source_id`); if (!evidence.length) return { generated: 0, candidates: [] as GeneratedCandidate[] };
  const evidenceIds = evidence.map((row) => row.id);
  const [relations, qualities, existingCandidates, existingGenerated] = await Promise.all([
    researchDb<RelationRow[]>(`research_evidence_relations?evidence_id=in.(${evidenceIds.join(",")})&select=evidence_id,relation_type,entity1_type,entity1_id,entity1_text,entity2_type,entity2_id,entity2_text,source`),
    researchDb<QualityRow[]>(`evidence_quality_scores?evidence_id=in.(${evidenceIds.join(",")})&scoring_version=eq.EQS-1.0&select=evidence_id,composite_score`),
    researchDb<ExistingCandidate[]>(`repurposing_candidates?disease_id=eq.${diseaseId}&select=drug_name`),
    researchDb<ExistingGenerated[]>(`generated_candidate_hypotheses?disease_id=eq.${diseaseId}&select=id,drug_name,gene_name,relation_type`),
  ]);
  const qualityByEvidence = new Map(qualities.map((row) => [row.evidence_id, Number(row.composite_score)])); const knownDrugs = new Set(existingCandidates.map((row) => normalize(row.drug_name)));
  const grouped = new Map<string, { drugName: string; drugId?: string; geneName?: string; geneId?: string; relationType: string; evidenceIds: Set<string>; qualities: number[] }>();
  for (const relation of relations) {
    const relationType = relation.relation_type.toUpperCase(); if (!supportedRelations.has(relationType)) continue;
    let drugName: string | undefined; let drugId: string | undefined; let geneName: string | undefined; let geneId: string | undefined;
    if (isDrug(relation.entity1_type)) { drugName = relation.entity1_text ?? undefined; drugId = relation.entity1_id ?? undefined; if (isGene(relation.entity2_type)) { geneName = relation.entity2_text ?? undefined; geneId = relation.entity2_id ?? undefined; } }
    else if (isDrug(relation.entity2_type)) { drugName = relation.entity2_text ?? undefined; drugId = relation.entity2_id ?? undefined; if (isGene(relation.entity1_type)) { geneName = relation.entity1_text ?? undefined; geneId = relation.entity1_id ?? undefined; } }
    if (!drugName || normalize(drugName).length < 2) continue;
    drugName = normalizeCandidateName(drugName);
    const key = signature(drugName, relationType, geneName); const group = grouped.get(key) ?? { drugName, drugId, geneName, geneId, relationType, evidenceIds: new Set<string>(), qualities: [] };
    group.evidenceIds.add(relation.evidence_id); const quality = qualityByEvidence.get(relation.evidence_id); if (quality !== undefined) group.qualities.push(quality); grouped.set(key, group);
  }
  const candidates: GeneratedCandidate[] = [...grouped.values()].map((group) => {
    const evidenceCount = group.evidenceIds.size; const meanEvidenceQuality = group.qualities.length ? group.qualities.reduce((a,b)=>a+b,0)/group.qualities.length : 45; const maxEvidenceQuality = group.qualities.length ? Math.max(...group.qualities) : 45;
    const noveltyScore = knownDrugs.has(normalize(group.drugName)) ? 20 : 85; const inferred = group.relationType === "INFERRED_COOCCURRENCE";
    const relationStrength = inferred ? (evidenceCount >= 3 ? 42 : evidenceCount >= 2 ? 34 : 22) : group.relationType === "TREAT" || group.relationType === "PREVENT" ? 90 : group.relationType === "INHIBIT" || group.relationType === "STIMULATE" ? 75 : group.relationType === "POSITIVE_CORRELATE" ? 65 : 50;
    const evidenceBreadth = clamp(35 + Math.min(evidenceCount,5)*12); const confidence = clamp(meanEvidenceQuality*0.55 + relationStrength*0.30 + evidenceBreadth*0.15); const generationScore = clamp(meanEvidenceQuality*0.40 + noveltyScore*0.25 + relationStrength*0.20 + evidenceBreadth*0.15);
    return { drugName: group.drugName, drugNormalizedId: group.drugId, geneName: group.geneName, geneNormalizedId: group.geneId, relationType: group.relationType, evidenceIds:[...group.evidenceIds], evidenceCount, meanEvidenceQuality:clamp(meanEvidenceQuality), maxEvidenceQuality:clamp(maxEvidenceQuality), confidence, noveltyScore, generationScore, hypothesisSummary: inferred ? `${group.drugName} co-occurs with ${diseaseName}${group.geneName ? ` and ${group.geneName}` : ""} across ${evidenceCount} evidence record${evidenceCount === 1 ? "" : "s"}. This is a discovery signal only; no causal or treatment relationship is asserted.` : `${group.drugName} has a ${group.relationType} evidence signal in ${diseaseName}${group.geneName ? ` involving ${group.geneName}` : ""}. This is a machine-generated research hypothesis requiring scientific review.` };
  }).filter((candidate) => candidate.relationType === "INFERRED_COOCCURRENCE" ? candidate.evidenceCount >= 2 && candidate.generationScore >= 50 : candidate.generationScore >= 45).sort((a,b)=>b.generationScore-a.generationScore).slice(0,100);
  const existingBySignature = new Map(existingGenerated.map((row)=>[signature(row.drug_name,row.relation_type,row.gene_name),row.id]));
  for (const candidate of candidates) {
    const row = { disease_id:diseaseId, drug_name:candidate.drugName, drug_normalized_id:candidate.drugNormalizedId ?? null, gene_name:candidate.geneName ?? null, gene_normalized_id:candidate.geneNormalizedId ?? null, relation_type:candidate.relationType, hypothesis_summary:candidate.hypothesisSummary, support_evidence_ids:candidate.evidenceIds, evidence_count:candidate.evidenceCount, mean_evidence_quality:candidate.meanEvidenceQuality, max_evidence_quality:candidate.maxEvidenceQuality, confidence:candidate.confidence, novelty_score:candidate.noveltyScore, generation_score:candidate.generationScore, updated_at:new Date().toISOString() };
    const id=existingBySignature.get(signature(candidate.drugName,candidate.relationType,candidate.geneName));
    if(id) await researchDb<unknown>(`generated_candidate_hypotheses?id=eq.${id}`,{method:"PATCH",body:row,prefer:"return=minimal"});
    else await researchDb<unknown>("generated_candidate_hypotheses",{method:"POST",body:row,prefer:"return=minimal"});
  }
  return { generated:candidates.length, candidates };
}
