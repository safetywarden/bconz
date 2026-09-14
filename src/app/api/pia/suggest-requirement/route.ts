import { NextRequest, NextResponse } from "next/server";
import { piaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const disease = String(body?.disease || "").trim();
    const country = String(body?.country || "").trim();

    if (!disease || !country) {
      return NextResponse.json(
        { detail: "Disease and country are required" },
        { status: 400 },
      );
    }

    const upstream = await piaGatewayRequest("/v1/pilots/suggest-requirement", {
      method: "POST",
      body: JSON.stringify({ disease, country }),
    });
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to suggest requirement" },
      { status: 500 },
    );
  }
}
