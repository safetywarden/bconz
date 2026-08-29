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

export type PubTatorExtraction = {
  entities: PubTatorEntity[];
  relations: PubTatorRelation[];
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

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
  return {
    evidenceSourceId: sourceId,
    entityType: normalizeEntityType(firstString(infons.type, infons.biotype, annotation.type)),
    normalizedId: firstString(infons.identifier, infons.id, infons.database_id),
    text,
  };
}

function resolveRelationNode(node: unknown, annotationById: Map<string, PubTatorEntity>) {
  const record = asRecord(node);
  if (!record) return {};
  const refid = firstString(record.refid, record.id, record.identifier);
  const entity = refid ? annotationById.get(refid) : undefined;
  return {
    type: entity?.entityType ?? firstString(record.type),
    id: entity?.normalizedId ?? refid,
    text: entity?.text ?? firstString(record.text),
  };
}

export async function extractPubTator3(evidence: NormalizedEvidence[]): Promise<PubTatorExtraction> {
  const pmids = [...new Set(evidence.filter((item) => item.sourceType === "PUBMED").map((item) => item.sourceId))];
  if (pmids.length === 0) return { entities: [], relations: [] };

  const entities: PubTatorEntity[] = [];
  const relations: PubTatorRelation[] = [];

  for (let i = 0; i < pmids.length; i += 20) {
    const batch = pmids.slice(i, i + 20);
    const url = `https://www.ncbi.nlm.nih.gov/research/pubtator3-api/publications/export/biocjson?pmids=${batch.join(",")}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`PubTator3 export failed (${response.status})`);
    const payload = await response.json() as unknown;
    const documents = Array.isArray(payload) ? payload : asArray(asRecord(payload)?.documents);

    for (const rawDocument of documents) {
      const document = asRecord(rawDocument);
      if (!document) continue;
      const sourceId = firstString(document.id, asRecord(document.infons)?.pmid);
      if (!sourceId) continue;
      const annotationById = new Map<string, PubTatorEntity>();

      for (const passageValue of asArray(document.passages)) {
        const passage = asRecord(passageValue);
        if (!passage) continue;
        for (const annotationValue of asArray(passage.annotations)) {
          const annotation = asRecord(annotationValue);
          if (!annotation) continue;
          const entity = annotationEntity(annotation, sourceId);
          if (!entity) continue;
          entities.push(entity);
          const annotationId = firstString(annotation.id);
          if (annotationId) annotationById.set(annotationId, entity);
        }
      }

      const relationValues = [
        ...asArray(document.relations),
        ...asArray(document.passages).flatMap((passage) => asArray(asRecord(passage)?.relations)),
      ];
      for (const relationValue of relationValues) {
        const relation = asRecord(relationValue);
        if (!relation) continue;
        const infons = asRecord(relation.infons) ?? {};
        const nodes = asArray(relation.nodes);
        if (nodes.length < 2) continue;
        const left = resolveRelationNode(nodes[0], annotationById);
        const right = resolveRelationNode(nodes[1], annotationById);
        relations.push({
          evidenceSourceId: sourceId,
          relationType: firstString(infons.type, infons.relation, relation.type)?.toUpperCase() ?? "ASSOCIATE",
          entity1Type: left.type,
          entity1Id: left.id,
          entity1Text: left.text,
          entity2Type: right.type,
          entity2Id: right.id,
          entity2Text: right.text,
        });
      }
    }
  }

  const entityKey = (entity: PubTatorEntity) => [entity.evidenceSourceId, entity.entityType, entity.normalizedId ?? "", entity.text].join("|");
  const relationKey = (relation: PubTatorRelation) => [relation.evidenceSourceId, relation.relationType, relation.entity1Id ?? relation.entity1Text ?? "", relation.entity2Id ?? relation.entity2Text ?? ""].join("|");
  return {
    entities: [...new Map(entities.map((entity) => [entityKey(entity), entity])).values()],
    relations: [...new Map(relations.map((relation) => [relationKey(relation), relation])).values()],
  };
}
