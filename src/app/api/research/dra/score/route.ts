import { scoreDra } from "@/lib/research/dra";
import { draScoreRequestSchema } from "@/lib/research/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = draScoreRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid DRA score request", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    return Response.json(
      scoreDra(parsed.data.scores, parsed.data.confidence, parsed.data.hardGate),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to score DRA request";
    return Response.json({ error: message }, { status: 400 });
  }
}
