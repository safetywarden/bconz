export function assertResearchApiToken(request: Request) {
  const expected = process.env.RESEARCH_API_TOKEN;
  if (!expected) throw new Error("RESEARCH_API_TOKEN is not configured");

  const header = request.headers.get("authorization");
  const supplied = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!supplied || supplied !== expected) {
    const error = new Error("Unauthorized");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
}
