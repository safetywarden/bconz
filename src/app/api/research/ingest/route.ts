import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { runResearchPipeline } from "@/lib/research/pipeline";

const requestSchema = z.object({
  diseaseName: z.string().trim().min(2).max(200),
  sources: z.array(z.enum(["PUBMED", "CLINICAL_TRIALS"])).min(1).default(["PUBMED", "CLINICAL_TRIALS"]),
  limitPerSource: z.number().int().min(1).max(100).default(20),
  includePubTator3: z.boolean().default(true),
  includeHypothesisDetection: z.boolean().default(true),
  includeOntologyResolution: z.boolean().default(true),
  includeEvidenceQuality: z.boolean().default(true),
  includeCandidateGeneration: z.boolean().default(true),
  includeCandidateRankingV2: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await runResearchPipeline(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Evidence ingestion failed" }, { status });
  }
}
