import { researchDb } from "./supabase-rest";

export type OntologyEntityType = "DISEASE" | "DRUG" | "GENE" | "VARIANT" | "BIOMARKER" | "PHENOTYPE" | "MECHANISM" | "OTHER";

type EvidenceRow = { id: string; source_id: string | null };
type EvidenceEntityRow = { id: string; evidence_id: string; entity_type: string; normalized_id: string | null; text: string };
type OntologyEntityRow = { id: string; entity_type: OntologyEntityType; canonical_name: string; namespace: string; external_id: string };
type AliasRow = { entity_id: string; normalized_alias: string; confidence: number };

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

function ontologyType(pubtatorType: string): OntologyEntityType {
  const type = pubtatorType.toUpperCase();
  if (type === "DISEASE") return "DISEASE";
  if (type === "CHEMICAL" || type === "DRUG") return "DRUG";
  if (type === "GENE") return "GENE";
  if (type === "VARIANT") return "VARIANT";
  return "OTHER";
}

function parseNormalizedId(value: string | null) {
  if (!value) return undefined;
  const cleaned = value.trim();
  const match = cleaned.match(/^([^:]+):(.+)$/);
  if (!match) return { namespace: "PUBTATOR", externalId: cleaned };
  const rawNamespace = match[1].toUpperCase();
  const namespace = rawNamespace === "NCBIGENE" || rawNamespace === "GENE" ? "NCBI_GENE"
    : rawNamespace === "MESH" ? "MESH"
      : rawNamespace === "NCBI" ? "NCBI"
        : rawNamespace;
  return { namespace, externalId: match[2] };
}

async function upsertOntologyEntity(entity: EvidenceEntityRow): Promise<OntologyEntityRow | undefined> {
  const type = ontologyType(entity.entity_type);
  const parsed = parseNormalizedId(entity.normalized_id);
  const externalId = parsed?.externalId ?? `NAME:${normalizeText(entity.text)}`;
  const namespace = parsed?.namespace ?? "BCONZ_NAME";

  await researchDb<unknown>("ontology_entities?on_conflict=entity_type,namespace,external_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      entity_type: type,
      canonical_name: entity.text,
      namespace,
      external_id: externalId,
      updated_at: new Date().toISOString(),
    },
  });

  const rows = await researchDb<OntologyEntityRow[]>(
    `ontology_entities?entity_type=eq.${type}&namespace=eq.${encodeURIComponent(namespace)}&external_id=eq.${encodeURIComponent(externalId)}&select=id,entity_type,canonical_name,namespace,external_id`,
  );
  const row = rows[0];
  if (!row) return undefined;

  const alias = normalizeText(entity.text);
  if (alias) {
    await researchDb<unknown>("ontology_aliases?on_conflict=entity_id,normalized_alias", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: {
        entity_id: row.id,
        alias: entity.text,
        normalized_alias: alias,
        source: "PUBTATOR3",
        confidence: parsed ? 100 : 85,
      },
    });
  }
  return row;
}

export async function resolveEvidenceEntities(diseaseName: string) {
  const diseases = await researchDb<{ id: string }[]>(
    `research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id`,
  );
  const diseaseId = diseases[0]?.id;
  if (!diseaseId) return { examined: 0, resolved: 0, externalId: 0, alias: 0 };

  const evidence = await researchDb<EvidenceRow[]>(
    `research_evidence?disease_id=eq.${diseaseId}&select=id,source_id`,
  );
  let examined = 0;
  let resolved = 0;
  let externalId = 0;
  let alias = 0;

  for (const item of evidence) {
    const entities = await researchDb<EvidenceEntityRow[]>(
      `research_evidence_entities?evidence_id=eq.${item.id}&select=id,evidence_id,entity_type,normalized_id,text`,
    );

    for (const entity of entities) {
      examined += 1;
      let ontology: OntologyEntityRow | undefined;
      const parsed = parseNormalizedId(entity.normalized_id);

      if (parsed) {
        const existing = await researchDb<OntologyEntityRow[]>(
          `ontology_entities?entity_type=eq.${ontologyType(entity.entity_type)}&namespace=eq.${encodeURIComponent(parsed.namespace)}&external_id=eq.${encodeURIComponent(parsed.externalId)}&select=id,entity_type,canonical_name,namespace,external_id`,
        );
        ontology = existing[0] ?? await upsertOntologyEntity(entity);
        if (ontology) externalId += 1;
      } else {
        const normalizedAlias = normalizeText(entity.text);
        const aliases = normalizedAlias
          ? await researchDb<AliasRow[]>(`ontology_aliases?normalized_alias=eq.${encodeURIComponent(normalizedAlias)}&select=entity_id,normalized_alias,confidence&order=confidence.desc&limit=1`)
          : [];
        if (aliases[0]) {
          const rows = await researchDb<OntologyEntityRow[]>(`ontology_entities?id=eq.${aliases[0].entity_id}&select=id,entity_type,canonical_name,namespace,external_id`);
          ontology = rows[0];
          if (ontology) alias += 1;
        } else {
          ontology = await upsertOntologyEntity(entity);
        }
      }

      if (!ontology) continue;
      await researchDb<unknown>("evidence_entity_resolutions?on_conflict=evidence_entity_id,ontology_entity_id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: {
          evidence_entity_id: entity.id,
          ontology_entity_id: ontology.id,
          resolution_method: parsed ? "EXTERNAL_ID" : alias > 0 ? "EXACT_ALIAS" : "CANONICAL_NAME",
          confidence: parsed ? 100 : 85,
        },
      });
      resolved += 1;
    }
  }

  return { examined, resolved, externalId, alias };
}

export async function resolveCandidateEntityLinks(candidateId: string) {
  const aliases = await researchDb<Array<{ alias_type: string; alias: string; normalized_id: string | null }>>(
    `candidate_aliases?candidate_id=eq.${candidateId}&select=alias_type,alias,normalized_id`,
  );

  let linked = 0;
  for (const candidateAlias of aliases) {
    const type: OntologyEntityType = candidateAlias.alias_type === "DRUG" ? "DRUG"
      : candidateAlias.alias_type === "DISEASE" ? "DISEASE"
        : candidateAlias.alias_type === "GENE" ? "GENE"
          : candidateAlias.alias_type === "BIOMARKER" ? "BIOMARKER"
            : candidateAlias.alias_type === "PHENOTYPE" ? "PHENOTYPE"
              : "OTHER";
    const parsed = parseNormalizedId(candidateAlias.normalized_id);
    const namespace = parsed?.namespace ?? "BCONZ_NAME";
    const externalId = parsed?.externalId ?? `NAME:${normalizeText(candidateAlias.alias)}`;

    await researchDb<unknown>("ontology_entities?on_conflict=entity_type,namespace,external_id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: { entity_type: type, canonical_name: candidateAlias.alias, namespace, external_id: externalId, updated_at: new Date().toISOString() },
    });
    const entities = await researchDb<OntologyEntityRow[]>(
      `ontology_entities?entity_type=eq.${type}&namespace=eq.${encodeURIComponent(namespace)}&external_id=eq.${encodeURIComponent(externalId)}&select=id,entity_type,canonical_name,namespace,external_id`,
    );
    const entity = entities[0];
    if (!entity) continue;

    await researchDb<unknown>("ontology_aliases?on_conflict=entity_id,normalized_alias", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: { entity_id: entity.id, alias: candidateAlias.alias, normalized_alias: normalizeText(candidateAlias.alias), source: "CANDIDATE_REGISTRY", confidence: 100 },
    });
    await researchDb<unknown>("candidate_entity_links", {
      method: "POST",
      prefer: "return=minimal",
      body: { candidate_id: candidateId, ontology_entity_id: entity.id, role: type === "DRUG" ? "DRUG" : type === "DISEASE" ? "DISEASE" : type === "GENE" ? "GENE" : type === "BIOMARKER" ? "BIOMARKER" : type === "PHENOTYPE" ? "PHENOTYPE" : "OTHER" },
    });
    linked += 1;
  }
  return { linked };
}
