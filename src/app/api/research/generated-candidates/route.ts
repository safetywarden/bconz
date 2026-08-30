import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { researchDb } from "@/lib/research/supabase-rest";

const reviewSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["REVIEW", "REJECT", "PROMOTE", "SUPERSEDE"]),
  reviewedBy: z.string().trim().min(2).max(200),
});

type GeneratedRow = {
  id: string;
  disease_id: string;
  drug_name: string;
  drug_normalized_id: string | null;
  gene_name: string | null;
  gene_normalized_id: string | null;
  relation_type: string;
  hypothesis_summary: string;
  generation_score: number;
  confidence: number;
  status: string;
};

type DiseaseRow = { id: string; canonical_name: string };
type CandidateRow = { id: string; disease_id: string; drug_name: string };

export async function GET(request: Request) {
  try {
    assertResearchApiToken(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? "PROPOSED";
    const limit = Math.max(1, Math.min(200, Number(url.searchParams.get("limit") ?? 50)));
    const rows = await researchDb<GeneratedRow[]>(
      `generated_candidate_hypotheses?status=eq.${encodeURIComponent(status)}&select=id,disease_id,drug_name,drug_normalized_id,gene_name,gene_normalized_id,relation_type,hypothesis_summary,generation_score,confidence,status&order=generation_score.desc&limit=${limit}`,
    );
    return NextResponse.json({ count: rows.length, candidates: rows });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generated candidate read failed" }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = reviewSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });

    const { id, action, reviewedBy } = parsed.data;
    const generatedRows = await researchDb<GeneratedRow[]>(
      `generated_candidate_hypotheses?id=eq.${id}&select=id,disease_id,drug_name,drug_normalized_id,gene_name,gene_normalized_id,relation_type,hypothesis_summary,generation_score,confidence,status`,
    );
    const generated = generatedRows[0];
    if (!generated) return NextResponse.json({ error: "Generated candidate not found" }, { status: 404 });

    if (action !== "PROMOTE") {
      const nextStatus = action === "REVIEW" ? "REVIEW" : action === "REJECT" ? "REJECTED" : "SUPERSEDED";
      await researchDb<unknown>(`generated_candidate_hypotheses?id=eq.${id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: { status: nextStatus, reviewed_by: reviewedBy, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      });
      return NextResponse.json({ ok: true, id, status: nextStatus });
    }

    const diseases = await researchDb<DiseaseRow[]>(`research_diseases?id=eq.${generated.disease_id}&select=id,canonical_name`);
    const disease = diseases[0];
    if (!disease) return NextResponse.json({ error: "Disease record not found" }, { status: 409 });

    let candidates = await researchDb<CandidateRow[]>(
      `repurposing_candidates?disease_id=eq.${generated.disease_id}&drug_name=ilike.${encodeURIComponent(generated.drug_name)}&select=id,disease_id,drug_name&limit=1`,
    );

    if (candidates.length === 0) {
      candidates = await researchDb<CandidateRow[]>("repurposing_candidates", {
        method: "POST",
        prefer: "return=representation",
        body: {
          disease_id: generated.disease_id,
          drug_name: generated.drug_name,
          responder_hypothesis: generated.hypothesis_summary,
          decision: "INVESTIGATE",
          evidence_confidence: generated.confidence,
          decisive_next_gate: "Human scientific review and DRA scoring required before advancement.",
        },
      });
    }

    const candidate = candidates[0];
    if (!candidate) return NextResponse.json({ error: "Candidate promotion failed" }, { status: 500 });

    await researchDb<unknown>("candidate_hypotheses?on_conflict=candidate_id,hypothesis_version", {
      method: "POST",
      prefer: "resolution=ignore-duplicates,return=minimal",
      body: {
        candidate_id: candidate.id,
        hypothesis_version: 1,
        status: "ACTIVE",
        responder_subgroup: null,
        mechanism_terms: generated.gene_name ? [generated.gene_name] : [],
        biomarker_terms: [],
        phenotype_terms: [],
        genotype_terms: generated.gene_name ? [generated.gene_name] : [],
        regimen_terms: [],
        positive_signal_terms: [generated.relation_type],
        negative_signal_terms: [],
        kill_criteria: ["Generated hypothesis fails expert validation or DRA hard-gate assessment."],
        rationale: generated.hypothesis_summary,
      },
    });

    const aliases = [
      { candidate_id: candidate.id, alias_type: "DRUG", alias: generated.drug_name, normalized_id: generated.drug_normalized_id, source: "GENERATION_ENGINE" },
      { candidate_id: candidate.id, alias_type: "DISEASE", alias: disease.canonical_name, normalized_id: null, source: "GENERATION_ENGINE" },
      ...(generated.gene_name ? [{ candidate_id: candidate.id, alias_type: "GENE", alias: generated.gene_name, normalized_id: generated.gene_normalized_id, source: "GENERATION_ENGINE" }] : []),
    ];
    await researchDb<unknown>("candidate_aliases?on_conflict=candidate_id,alias_type,alias", {
      method: "POST",
      prefer: "resolution=ignore-duplicates,return=minimal",
      body: aliases,
    });

    await researchDb<unknown>(`generated_candidate_hypotheses?id=eq.${id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: { status: "PROMOTED", reviewed_by: reviewedBy, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    });

    return NextResponse.json({ ok: true, id, status: "PROMOTED", candidateId: candidate.id });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generated candidate review failed" }, { status });
  }
}
