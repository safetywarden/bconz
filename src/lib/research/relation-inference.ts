import { researchDb } from "./supabase-rest";

type DiseaseRow = { id: string };
type EvidenceRow = { id: string };
type EntityRow = { evidence_id: string; entity_type: string; normalized_id: string; text: string };
type ExistingRelation = { evidence_id: string; entity1_id: string; entity1_text: string; entity2_id: string; entity2_text: string };

type InferredRelationRow = {
  evidence_id: string;
  relation_type: "INFERRED_COOCCURRENCE";
  entity1_type: string;
  entity1_id: string;
  entity1_text: string;
  entity2_type: string;
  entity2_id: string;
  entity2_text: string;
  source: "BCONZ_COOCCURRENCE_V2";
};

function isChemical(type: string) {
  const value = type.toUpperCase();
  return value === "CHEMICAL" || value === "DRUG";
}

function isRelevantPartner(type: string) {
  const value = type.toUpperCase();
  return value === "DISEASE" || value === "GENE" || value === "VARIANT";
}

function entityKey(id: string, text: string) {
  return id || text.trim().toLowerCase();
}

function pairKey(row: { evidence_id: string; entity1_id: string; entity1_text: string; entity2_id: string; entity2_text: string }) {
  return [row.evidence_id, entityKey(row.entity1_id, row.entity1_text), entityKey(row.entity2_id, row.entity2_text)].join("|");
}

export async function inferEvidenceRelations(diseaseName: string) {
  const diseases = await researchDb<DiseaseRow[]>(`research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id`);
  const diseaseId = diseases[0]?.id;
  if (!diseaseId) return { inferred: 0, evidenceWithSignals: 0 };

  const evidence = await researchDb<EvidenceRow[]>(`research_evidence?disease_id=eq.${diseaseId}&source_type=eq.PUBMED&select=id`);
  if (!evidence.length) return { inferred: 0, evidenceWithSignals: 0 };
  const evidenceIds = evidence.map((row) => row.id);

  const [entities, existingRelations] = await Promise.all([
    researchDb<EntityRow[]>(`research_evidence_entities?evidence_id=in.(${evidenceIds.join(",")})&select=evidence_id,entity_type,normalized_id,text`),
    researchDb<ExistingRelation[]>(`research_evidence_relations?evidence_id=in.(${evidenceIds.join(",")})&select=evidence_id,entity1_id,entity1_text,entity2_id,entity2_text`),
  ]);

  const entitiesByEvidence = new Map<string, EntityRow[]>();
  for (const entity of entities) {
    const rows = entitiesByEvidence.get(entity.evidence_id) ?? [];
    rows.push(entity);
    entitiesByEvidence.set(entity.evidence_id, rows);
  }

  const existingKeys = new Set(existingRelations.flatMap((row) => [
    pairKey(row),
    [row.evidence_id, entityKey(row.entity2_id, row.entity2_text), entityKey(row.entity1_id, row.entity1_text)].join("|"),
  ]));
  const inferred = new Map<string, InferredRelationRow>();
  const evidenceWithSignals = new Set<string>();

  for (const [evidenceId, rows] of entitiesByEvidence) {
    const chemicals = rows.filter((row) => isChemical(row.entity_type));
    const partners = rows.filter((row) => isRelevantPartner(row.entity_type));
    if (!chemicals.length || !partners.length) continue;

    for (const chemical of chemicals) {
      for (const partner of partners) {
        const chemicalKey = entityKey(chemical.normalized_id, chemical.text);
        const partnerKey = entityKey(partner.normalized_id, partner.text);
        if (!chemicalKey || !partnerKey || chemicalKey === partnerKey) continue;
        const key = [evidenceId, chemicalKey, partnerKey].join("|");
        if (existingKeys.has(key)) continue;
        inferred.set(key, {
          evidence_id: evidenceId,
          relation_type: "INFERRED_COOCCURRENCE",
          entity1_type: chemical.entity_type,
          entity1_id: chemical.normalized_id ?? "",
          entity1_text: chemical.text,
          entity2_type: partner.entity_type,
          entity2_id: partner.normalized_id ?? "",
          entity2_text: partner.text,
          source: "BCONZ_COOCCURRENCE_V2",
        });
        evidenceWithSignals.add(evidenceId);
      }
    }
  }

  const rows = [...inferred.values()];
  if (rows.length) {
    await researchDb<unknown>("research_evidence_relations?on_conflict=evidence_id,relation_type,entity1_id,entity1_text,entity2_id,entity2_text", {
      method: "POST",
      body: rows,
      prefer: "resolution=merge-duplicates,return=minimal",
    });
  }
  return { inferred: rows.length, evidenceWithSignals: evidenceWithSignals.size };
}
