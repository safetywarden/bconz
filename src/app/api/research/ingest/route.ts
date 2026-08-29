import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { ingestPubmedDisease } from "@/lib/research/ingestion/pubmed";
import { ingestClinicalTrialsDisease } from "@/lib/research/ingestion/clinical-trials";
import { persistEvidence } from "@/lib/research/ingestion/persist";

const requestSchema = z.object({
  diseaseName: z.string().trim().min(2).max(200),
  sources: z.array(z.enum(["PUBMED", "CLINICAL_TRIALS"])).min(1).default(["PUBMED", "CLINICAL_TRIALS"]),
  limitPerSource: z.number().int().min(1).max(100).default(20),
});

export async function POST(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { diseaseName, sources, limitPerSource } = parsed.data;
    const results = await Promise.all(
      sources.map((source) =>
        source === "PUBMED"
          ? ingestPubmedDisease(diseaseName, limitPerSource)
          : ingestClinicalTrialsDisease(diseaseName, limitPerSource),
      ),
    );
    const normalized = results.flatMap((result) => result.normalized);
    const persistence = await persistEvidence(normalized);

    return NextResponse.json({
      diseaseName,
      fetched: results.reduce((sum, result) => sum + result.fetched, 0),
      normalized: normalized.length,
      persisted: persistence.inserted,
      sources: results.map((result) => ({ source: result.source, fetched: result.fetched, normalized: result.normalized.length })),
    });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Evidence ingestion failed" }, { status });
  }
}
