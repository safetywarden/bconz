import { NextRequest, NextResponse } from "next/server";
import { piaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ pilotId: string }> },
) {
  try {
    const { pilotId } = await context.params;
    const body = await request.json();
    const upstream = await piaGatewayRequest(
      `/v1/pilots/${encodeURIComponent(pilotId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to update PIA run" },
      { status: 500 },
    );
  }
}
