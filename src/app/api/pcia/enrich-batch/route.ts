import { NextRequest, NextResponse } from "next/server";
import { pciaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const providerIds = Array.isArray(body?.provider_ids)
      ? body.provider_ids.map((value: unknown) => String(value || "").trim()).filter(Boolean)
      : [];

    if (!body?.pilot_id || !providerIds.length) {
      return NextResponse.json(
        { detail: "pilot_id and provider_ids are required" },
        { status: 400 },
      );
    }

    if (providerIds.length > 20) {
      return NextResponse.json(
        { detail: "Deep PCIA batch is limited to 20 providers per request" },
        { status: 400 },
      );
    }

    const upstream = await pciaGatewayRequest("/v1/pcia/enrich-batch", {
      method: "POST",
      body: JSON.stringify({
        pilot_id: String(body.pilot_id),
        provider_ids: providerIds,
        people: body?.people !== false,
        force: Boolean(body?.force),
      }),
    });
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to queue PCIA batch" },
      { status: 500 },
    );
  }
}
