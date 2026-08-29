import { researchDb } from "../supabase-rest";
import type { NormalizedEvidence } from "./types";

type DiseaseRow = { id: string; canonical_name: string };

export async function persistEvidence(records: NormalizedEvidence[]) {
  if (records.length === 0) return { inserted: 0, skippedUnknownDisease: 0 };

  const diseaseNames = [...new Set(records.map((record) => record.diseaseName))];
  const diseaseByName = new Map<string, string>();

  for (const diseaseName of diseaseNames) {
    const rows = await researchDb<DiseaseRow[]>(
      `research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id,canonical_name`,
    );
    const row = rows[0];
    if (row) diseaseByName.set(row.canonical_name, row.id);
  }

  let skippedUnknownDisease = 0;
  const rows = records.flatMap((record) => {
    const diseaseId = diseaseByName.get(record.diseaseName);
    if (!diseaseId) {
      skippedUnknownDisease += 1;
      return [];
    }

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

  if (rows.length === 0) return { inserted: 0, skippedUnknownDisease };

  await researchDb<unknown>("research_evidence?on_conflict=disease_id,source_type,source_id", {
    method: "POST",
    body: rows,
    prefer: "resolution=merge-duplicates,return=minimal",
  });

  return { inserted: rows.length, skippedUnknownDisease };
}
