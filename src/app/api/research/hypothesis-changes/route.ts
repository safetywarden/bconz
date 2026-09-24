import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { researchDb } from "@/lib/research/supabase-rest";

const reviewSchema = z.object({
  id: z.string().uuid(),
  decision: z.enum(["APPROVED", "REJECTED", "SUPERSEDED"]),
  reviewedBy: z.string().trim().min(2).max(120),
});

type HypothesisChangeRow = {
  id: string;
  candidate_id: string;
  disease_id: string;
  source_type: string;
  source_id: string;
  direction: "STRENGTHEN" | "WEAKEN" | "KILL" | "NEUTRAL";
  confidence: number;
  proposed_dra_delta: number;
  proposed_rdia_delta: number;
  hard_gate_candidate: boolean;
  rationale: string;
  matched_signals: string[];
  requires_human_review: boolean;
  review_status: "PENDING" | "APPROVED" | "REJECTED" | "SUPERSEDED";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export async function GET(request: Request) {
  try {
    assertResearchApiToken(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? "PENDING";
    if (!["PENDING", "APPROVED", "REJECTED", "SUPERSEDED", "ALL"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const filter = status === "ALL" ? "" : `review_status=eq.${status}&`;
    const rows = await researchDb<HypothesisChangeRow[]>(
      `hypothesis_change_events?${filter}select=*&order=hard_gate_candidate.desc,confidence.desc,created_at.desc`,
    );

    return NextResponse.json({ count: rows.length, changes: rows });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load hypothesis changes" }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    assertResearchApiToken(request);
    const parsed = reviewSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { id, decision, reviewedBy } = parsed.data;
    const rows = await researchDb<HypothesisChangeRow[]>(`hypothesis_change_events?id=eq.${id}&select=*`);
    const existing = rows[0];
    if (!existing) return NextResponse.json({ error: "Hypothesis change not found" }, { status: 404 });
    if (existing.review_status !== "PENDING") {
      return NextResponse.json({ error: `Hypothesis change already ${existing.review_status.toLowerCase()}` }, { status: 409 });
    }

    await researchDb<unknown>(`hypothesis_change_events?id=eq.${id}`, {
      method: "PATCH",
      body: {
        review_status: decision,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
      },
      prefer: "return=minimal",
    });

    return NextResponse.json({
      id,
      decision,
      reviewedBy,
      note: "Review status recorded. Proposed RDIA/DRA deltas are not applied automatically.",
    });
  } catch (error) {
    const status = (error as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to review hypothesis change" }, { status });
  }
}
