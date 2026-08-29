import { scoreRdia } from "@/lib/research/rdia";
import { rdiaScoreRequestSchema } from "@/lib/research/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rdiaScoreRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid RDIA score request", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    return Response.json(scoreRdia(parsed.data.opportunity, parsed.data.confidence));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to score RDIA request";
    return Response.json({ error: message }, { status: 400 });
  }
}
