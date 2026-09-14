import { NextRequest, NextResponse } from "next/server";
import { piaGatewayRequest, proxyJson } from "@/lib/pia/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await piaGatewayRequest("/v1/pilots");
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to reach PIA gateway" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const upstream = await piaGatewayRequest("/v1/pilots/run", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const { payload, status } = await proxyJson(upstream);
    return NextResponse.json(payload, { status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to create PIA run" },
      { status: 500 },
    );
  }
}
