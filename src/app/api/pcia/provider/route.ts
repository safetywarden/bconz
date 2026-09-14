import { NextRequest, NextResponse } from "next/server";
import { pciaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const pilotId = String(request.nextUrl.searchParams.get("pilot_id") || "").trim();
    const providerId = String(request.nextUrl.searchParams.get("provider_id") || "").trim();

    if (!pilotId || !providerId) {
      return NextResponse.json(
        { detail: "pilot_id and provider_id are required" },
        { status: 400 },
      );
    }

    const upstream = await pciaGatewayRequest(
      `/v1/pcia/pilots/${encodeURIComponent(pilotId)}/providers/${providerId}`,
    );
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to reach PCIA gateway" },
      { status: 500 },
    );
  }
}
