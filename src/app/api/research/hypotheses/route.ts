import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { loadCandidateHypotheses } from "@/lib/research/hypothesis-registry";
import { researchDb } from "@/lib/research/supabase-rest";

const termList = z.array(z.string().trim().min(1).max(200)).max(100).default([]);

const createSchema = z.object({
  candidateId: z.string().uuid(),
  hypothesisVersion: z.number().int().min(1).default(1),
  status: z.enum(["ACTIVE", "PAUSED", "RETIRED"]).default("ACTIVE"),
  responderSubgroup: z.string().trim().max(2000).optional(),
  mechanismTerms: termList,
  biomarkerTerms: termList,
  phenotypeTerms: termList,
  genotypeTerms: termList,
  regimenTerms: termList,
  positiveSignalTerms: termList,
  negativeSignalTerms: termList,
  killCriteria: z.array(z.string().trim().min(1).max(2000)).max(50).default([]),
  rationale: z.string().trim().max(5000).optional(),
  aliases: z.array(z.object({
    type: z.enum(["DRUG", "DISEASE", "GENE", "BIOMARKER", "PHENOTYPE", "OTHER"]),
    alias: z.string().trim().min(1).max(200),
    normalizedId: z.string().trim().max(200).optional(),
    source: z.string().trim().max(200).optional(),
  })).max(200).default([]),
});

export async function GET(request: Request) {
  try {
    assertResearchApiToken(request);
    const diseaseName = new URL(request.url).searchParams.get("diseaseName") ?? undefined;
    const hypotheses = await loadCandidateHypotheses(diseaseName);
    return NextResponse.json({ count: hypotheses.length, hypotheses });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registry read failed" }, { status });
  }
}

export async function POST(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    await researchDb<unknown>("candidate_hypotheses?on_conflict=candidate_id,hypothesis_version", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: {
        candidate_id: data.candidateId,
        hypothesis_version: data.hypothesisVersion,
        status: data.status,
        responder_subgroup: data.responderSubgroup ?? null,
        mechanism_terms: data.mechanismTerms,
        biomarker_terms: data.biomarkerTerms,
        phenotype_terms: data.phenotypeTerms,
        genotype_terms: data.genotypeTerms,
        regimen_terms: data.regimenTerms,
        positive_signal_terms: data.positiveSignalTerms,
        negative_signal_terms: data.negativeSignalTerms,
        kill_criteria: data.killCriteria,
        rationale: data.rationale ?? null,
        updated_at: new Date().toISOString(),
      },
    });

    if (data.aliases.length > 0) {
      await researchDb<unknown>("candidate_aliases?on_conflict=candidate_id,alias_type,alias", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: data.aliases.map((alias) => ({
          candidate_id: data.candidateId,
          alias_type: alias.type,
          alias: alias.alias,
          normalized_id: alias.normalizedId ?? null,
          source: alias.source ?? "REGISTRY_API",
        })),
      });
    }

    return NextResponse.json({ ok: true, candidateId: data.candidateId, hypothesisVersion: data.hypothesisVersion }, { status: 201 });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registry write failed" }, { status });
  }
}
