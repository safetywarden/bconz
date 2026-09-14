import { NextResponse } from "next/server";
import { piaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await piaGatewayRequest("/v1/pilots/index");
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to load PIA run index" },
      { status: 500 },
    );
  }
}
