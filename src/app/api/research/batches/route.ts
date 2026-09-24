import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { createResearchBatch, getResearchBatch } from "@/lib/research/batch";

const createSchema = z.object({
  diseases: z.array(z.string().trim().min(2).max(200)).min(1).max(1000),
  requestedBy: z.string().trim().max(200).optional(),
  priority: z.number().int().min(1).max(1000).default(100),
  pipeline: z.object({
    sources: z.array(z.enum(["PUBMED", "CLINICAL_TRIALS"])).min(1).optional(),
    limitPerSource: z.number().int().min(1).max(100).optional(),
    includePubTator3: z.boolean().optional(),
    includeHypothesisDetection: z.boolean().optional(),
    includeOntologyResolution: z.boolean().optional(),
  }).default({}),
});

export async function POST(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const result = await createResearchBatch(parsed.data);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Batch creation failed" }, { status });
  }
}

export async function GET(request: Request) {
  try {
    assertResearchApiToken(request);
    const runId = new URL(request.url).searchParams.get("runId");
    if (!runId || !z.string().uuid().safeParse(runId).success) return NextResponse.json({ error: "Valid runId is required" }, { status: 400 });
    const batch = await getResearchBatch(runId);
    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    return NextResponse.json(batch);
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Batch read failed" }, { status });
  }
}
