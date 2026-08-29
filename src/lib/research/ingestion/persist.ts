import { researchDb } from "../supabase-rest";
import type { NormalizedEvidence } from "./types";

type DiseaseRow = { id: string; canonical_name: string };

export async function persistEvidence(records: NormalizedEvidence[]) {
  if (records.length === 0) return { inserted: 0 };

  const diseaseNames = [...new Set(records.map((record) => record.diseaseName))];
  const filter = encodeURIComponent(`(${diseaseNames.map((name) => `\"${name.replace(/\"/g, "") }\"`).join(",")})`);
  const diseases = await researchDb<DiseaseRow[]>(`research_diseases?canonical_name=in.${filter}&select=id,canonical_name`);
  const diseaseByName = new Map(diseases.map((row) => [row.canonical_name, row.id]));

  const rows = records.flatMap((record) => {
    const diseaseId = diseaseByName.get(record.diseaseName);
    if (!diseaseId) return [];
    return [{
      disease_id: diseaseId,
      source_type: record.sourceType,
      source_id: record.sourceId,
      source_url: record.sourceUrl,
      title: record.title,
      publication_date: record.publicationDate || null,
      evidence_class: record.evidenceClass,
      population: record.population || null,
      extracted_claim: record.extractedClaim,
      confidence: record.confidence,
      review_state: "AI_EXTRACTED",
      checked_at: new Date().toISOString(),
    }];
  });

  if (rows.length === 0) return { inserted: 0 };
  await researchDb<unknown>("research_evidence?on_conflict=disease_id,source_type,source_id", {
    method: "POST",
    body: rows,
    prefer: "resolution=merge-duplicates,return=minimal",
  });
  return { inserted: rows.length };
}
