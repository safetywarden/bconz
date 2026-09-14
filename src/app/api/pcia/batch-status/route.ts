import { NextRequest, NextResponse } from "next/server";
import { pciaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const providerIds = request.nextUrl.searchParams
      .getAll("provider_id")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!providerIds.length) {
      return NextResponse.json(
        { detail: "At least one provider_id is required" },
        { status: 400 },
      );
    }

    if (providerIds.length > 20) {
      return NextResponse.json(
        { detail: "Batch status is limited to 20 providers" },
        { status: 400 },
      );
    }

    const query = new URLSearchParams();
    for (const providerId of providerIds) {
      query.append("provider_id", providerId);
    }

    const upstream = await pciaGatewayRequest(
      `/v1/pcia/batch-status?${query.toString()}`,
    );
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to load PCIA batch status" },
      { status: 500 },
    );
  }
}
