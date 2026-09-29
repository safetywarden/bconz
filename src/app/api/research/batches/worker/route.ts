import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { processResearchBatch } from "@/lib/research/batch";

const workerSchema = z.object({
  workerId: z.string().trim().min(2).max(200),
  limit: z.number().int().min(1).max(25).default(3),
});

export async function POST(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = workerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const result = await processResearchBatch(parsed.data.workerId, parsed.data.limit);
    return NextResponse.json(result);
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Batch worker failed" }, { status });
  }
}
