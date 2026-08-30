import type { NormalizedEvidence } from "./types";

export type PubTatorEntity = {
  evidenceSourceId: string;
  entityType: "GENE" | "DISEASE" | "CHEMICAL" | "VARIANT" | "SPECIES" | "CELL_LINE" | "OTHER";
  normalizedId?: string;
  text: string;
};

export type PubTatorRelation = {
  evidenceSourceId: string;
  relationType: string;
  entity1Type?: string;
  entity1Id?: string;
  entity1Text?: string;
  entity2Type?: string;
  entity2Id?: string;
  entity2Text?: string;
};

export type PubTatorExtractionStatus = "SUCCESS" | "PARTIAL" | "EMPTY" | "UNAVAILABLE" | "DISABLED";
export type PubTatorExtraction = {
  entities: PubTatorEntity[];
  relations: PubTatorRelation[];
  status: PubTatorExtractionStatus;
  requestedPmids: number;
  documentsParsed: number;
  batchesRequested: number;
  batchesSucceeded: number;
  batchesFailed: number;
  parseFailures: number;
  warnings: string[];
};
type JsonRecord = Record<string, unknown>;

type ParsedBioC = { documents: unknown[]; parseFailures: number };

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : undefined;
}
function asArray(value: unknown): unknown[] { return Array.isArray(value) ? value : []; }
function firstString(...values: unknown[]): string | undefined {
  for (const value of values) if (typeof value === "string" && value.trim()) return value.trim();
  return undefined;
}
function normalizeEntityType(value?: string): PubTatorEntity["entityType"] {
  const v = value?.toUpperCase().replace(/[ -]/g, "_");
  if (v === "GENE") return "GENE";
  if (v === "DISEASE") return "DISEASE";
  if (v === "CHEMICAL" || v === "DRUG") return "CHEMICAL";
  if (v === "VARIANT" || v === "MUTATION") return "VARIANT";
  if (v === "SPECIES") return "SPECIES";
  if (v === "CELL_LINE" || v === "CELLLINE") return "CELL_LINE";
  return "OTHER";
}
function annotationEntity(annotation: JsonRecord, sourceId: string): PubTatorEntity | undefined {
  const infons = asRecord(annotation.infons) ?? {};
  const text = firstString(annotation.text, infons.name, infons.identifier);
  if (!text) return undefined;
  return { evidenceSourceId: sourceId, entityType: normalizeEntityType(firstString(infons.type, infons.biotype, annotation.type)), normalizedId: firstString(infons.identifier, infons.id, infons.database_id), text };
}
function resolveRelationNode(node: unknown, annotationById: Map<string, PubTatorEntity>) {
  const record = asRecord(node); if (!record) return {};
  const refid = firstString(record.refid, record.id, record.identifier);
  const entity = refid ? annotationById.get(refid) : undefined;
  return { type: entity?.entityType ?? firstString(record.type), id: entity?.normalizedId ?? refid, text: entity?.text ?? firstString(record.text) };
}

function parseBioCJsonText(text: string): ParsedBioC {
  const trimmed = text.trim();
  if (!trimmed) return { documents: [], parseFailures: 0 };
  try {
    const payload = JSON.parse(trimmed) as unknown;
    if (Array.isArray(payload)) return { documents: payload, parseFailures: 0 };
    const record = asRecord(payload);
    return { documents: asArray(record?.documents).length ? asArray(record?.documents) : record ? [record] : [], parseFailures: 0 };
  } catch {
    let parseFailures = 0;
    const documents = trimmed.split(/\r?\n/).flatMap((line) => {
      const value = line.trim();
      if (!value) return [];
      try { return [JSON.parse(value) as unknown]; } catch { parseFailures += 1; return []; }
    });
    return { documents, parseFailures };
  }
}

export async function extractPubTator3(evidence: NormalizedEvidence[]): Promise<PubTatorExtraction> {
  const pmids = [...new Set(evidence.filter((item) => item.sourceType === "PUBMED").map((item) => item.sourceId))];
  if (pmids.length === 0) return { entities: [], relations: [], status: "EMPTY", requestedPmids: 0, documentsParsed: 0, batchesRequested: 0, batchesSucceeded: 0, batchesFailed: 0, parseFailures: 0, warnings: ["No PubMed PMIDs were available for PubTator3 extraction."] };
  const entities: PubTatorEntity[] = []; const relations: PubTatorRelation[] = []; const warnings: string[] = [];
  let documentsParsed = 0; let batchesRequested = 0; let batchesSucceeded = 0; let batchesFailed = 0; let parseFailures = 0;

  for (let i = 0; i < pmids.length; i += 20) {
    const batch = pmids.slice(i, i + 20); batchesRequested += 1;
    const url = `https://www.ncbi.nlm.nih.gov/research/pubtator3-api/publications/export/biocjson?pmids=${batch.join(",")}`;
    try {
      const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) { batchesFailed += 1; warnings.push(`PubTator3 batch failed with HTTP ${response.status}.`); continue; }
      batchesSucceeded += 1;
      const parsed = parseBioCJsonText(await response.text()); parseFailures += parsed.parseFailures; documentsParsed += parsed.documents.length;
      if (parsed.parseFailures) warnings.push(`PubTator3 returned ${parsed.parseFailures} unparseable BioCJSON record(s).`);

      for (const rawDocument of parsed.documents) {
        const document = asRecord(rawDocument); if (!document) continue;
        const sourceId = firstString(document.id, asRecord(document.infons)?.pmid); if (!sourceId) continue;
        const annotationById = new Map<string, PubTatorEntity>();
        for (const passageValue of asArray(document.passages)) {
          const passage = asRecord(passageValue); if (!passage) continue;
          for (const annotationValue of asArray(passage.annotations)) {
            const annotation = asRecord(annotationValue); if (!annotation) continue;
            const entity = annotationEntity(annotation, sourceId); if (!entity) continue;
            entities.push(entity); const annotationId = firstString(annotation.id); if (annotationId) annotationById.set(annotationId, entity);
          }
        }
        const relationValues = [...asArray(document.relations), ...asArray(document.passages).flatMap((passage) => asArray(asRecord(passage)?.relations))];
        for (const relationValue of relationValues) {
          const relation = asRecord(relationValue); if (!relation) continue;
          const infons = asRecord(relation.infons) ?? {}; const nodes = asArray(relation.nodes); if (nodes.length < 2) continue;
          const left = resolveRelationNode(nodes[0], annotationById); const right = resolveRelationNode(nodes[1], annotationById);
          relations.push({ evidenceSourceId: sourceId, relationType: firstString(infons.type, infons.relation, relation.type)?.toUpperCase() ?? "ASSOCIATE", entity1Type: left.type, entity1Id: left.id, entity1Text: left.text, entity2Type: right.type, entity2Id: right.id, entity2Text: right.text });
        }
      }
    } catch (error) {
      batchesFailed += 1; warnings.push(`PubTator3 request error: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }
  const entityKey = (entity: PubTatorEntity) => [entity.evidenceSourceId, entity.entityType, entity.normalizedId ?? "", entity.text].join("|");
  const relationKey = (relation: PubTatorRelation) => [relation.evidenceSourceId, relation.relationType, relation.entity1Id ?? relation.entity1Text ?? "", relation.entity2Id ?? relation.entity2Text ?? ""].join("|");
  const dedupedEntities = [...new Map(entities.map((entity) => [entityKey(entity), entity])).values()];
  const dedupedRelations = [...new Map(relations.map((relation) => [relationKey(relation), relation])).values()];
  let status: PubTatorExtractionStatus = "SUCCESS";
  if (batchesSucceeded === 0) status = "UNAVAILABLE";
  else if (batchesFailed > 0 || parseFailures > 0) status = "PARTIAL";
  else if (documentsParsed === 0 || dedupedEntities.length === 0) status = "EMPTY";
  if (status === "EMPTY") warnings.push("PubTator3 responded, but no biomedical entities were extracted; treat downstream candidate results as incomplete.");
  return { entities: dedupedEntities, relations: dedupedRelations, status, requestedPmids: pmids.length, documentsParsed, batchesRequested, batchesSucceeded, batchesFailed, parseFailures, warnings };
}
