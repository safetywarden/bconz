import { NextRequest, NextResponse } from "next/server";
import { piaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requirement = String(body?.requirement_text || body?.requirement || "").trim();
    if (!requirement) {
      return NextResponse.json(
        { valid: false, detail: "Requirement text is required" },
        { status: 400 },
      );
    }

    const upstream = await piaGatewayRequest("/v1/pilots/validate-requirement", {
      method: "POST",
      body: JSON.stringify({ requirement_text: requirement }),
    });
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        detail: error instanceof Error ? error.message : "Unable to validate requirement",
      },
      { status: 500 },
    );
  }
}
