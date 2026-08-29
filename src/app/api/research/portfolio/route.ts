import { researchDb } from "@/lib/research/supabase-rest";

type DiseaseRow = {
  id: string;
  canonical_name: string;
  portfolio_status: string;
  portfolio_tier: string | null;
  opportunity_score: number | null;
  evidence_confidence: number | null;
  last_reviewed_at: string | null;
};

export async function GET() {
  try {
    const diseases = await researchDb<DiseaseRow[]>(
      "research_diseases?select=id,canonical_name,portfolio_status,portfolio_tier,opportunity_score,evidence_confidence,last_reviewed_at&order=portfolio_tier.asc,canonical_name.asc",
    );

    return Response.json({ diseases });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load research portfolio";
    return Response.json({ error: message }, { status: 500 });
  }
}
