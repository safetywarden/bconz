import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { detectMaterialChanges } from "@/lib/research/change-detection";
import { ingestPubmedDisease } from "@/lib/research/ingestion/pubmed";
import { ingestClinicalTrialsDisease } from "@/lib/research/ingestion/clinical-trials";
import { extractPubTator3 } from "@/lib/research/ingestion/pubtator3";
import { persistEvidence, persistMaterialChanges, persistPubTatorExtraction } from "@/lib/research/ingestion/persist";

const requestSchema = z.object({
  diseaseName: z.string().trim().min(2).max(200),
  sources: z.array(z.enum(["PUBMED", "CLINICAL_TRIALS"])).min(1).default(["PUBMED", "CLINICAL_TRIALS"]),
  limitPerSource: z.number().int().min(1).max(100).default(20),
  includePubTator3: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { diseaseName, sources, limitPerSource, includePubTator3 } = parsed.data;
    const results = await Promise.all(
      sources.map((source) =>
        source === "PUBMED"
          ? ingestPubmedDisease(diseaseName, limitPerSource)
          : ingestClinicalTrialsDisease(diseaseName, limitPerSource),
      ),
    );
    const normalized = results.flatMap((result) => result.normalized);
    const persistence = await persistEvidence(normalized);

    const pubmedEvidence = normalized.filter((item) => item.sourceType === "PUBMED");
    const pubtator = includePubTator3
      ? await extractPubTator3(pubmedEvidence)
      : { entities: [], relations: [] };
    const pubtatorPersistence = includePubTator3
      ? await persistPubTatorExtraction(diseaseName, pubtator)
      : { entities: 0, relations: 0 };

    const changes = detectMaterialChanges(normalized, pubtator);
    const changePersistence = await persistMaterialChanges(diseaseName, changes);

    return NextResponse.json({
      diseaseName,
      fetched: results.reduce((sum, result) => sum + result.fetched, 0),
      normalized: normalized.length,
      persisted: persistence.inserted,
      skippedUnknownDisease: persistence.skippedUnknownDisease,
      pubtator3: {
        enabled: includePubTator3,
        entitiesExtracted: pubtator.entities.length,
        relationsExtracted: pubtator.relations.length,
        entitiesPersisted: pubtatorPersistence.entities,
        relationsPersisted: pubtatorPersistence.relations,
      },
      materialChanges: {
        logged: changePersistence.logged,
        red: changes.filter((change) => change.severity === "RED").length,
        amber: changes.filter((change) => change.severity === "AMBER").length,
        green: changes.filter((change) => change.severity === "GREEN").length,
        reviewRequired: changes.filter((change) => change.materialReviewRequired).length,
      },
      sources: results.map((result) => ({ source: result.source, fetched: result.fetched, normalized: result.normalized.length })),
    });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Evidence ingestion failed" }, { status });
  }
}
