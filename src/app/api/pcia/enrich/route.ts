import { NextRequest, NextResponse } from "next/server";
import { pciaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pilotId = String(body?.pilot_id || "").trim();
    const providerId = String(body?.provider_id || "").trim();

    if (!pilotId || !providerId) {
      return NextResponse.json(
        { detail: "pilot_id and provider_id are required" },
        { status: 400 },
      );
    }

    const upstream = await pciaGatewayRequest("/v1/pcia/enrich", {
      method: "POST",
      body: JSON.stringify({
        pilot_id: pilotId,
        provider_id: providerId,
        force: Boolean(body?.force),
      }),
    });
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to reach PCIA gateway" },
      { status: 500 },
    );
  }
}
