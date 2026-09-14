import { NextRequest, NextResponse } from "next/server";
import {
  expectedPiaSession,
  PIA_SESSION_COOKIE,
  piaAccessConfigured,
  verifyPiaPassword,
} from "@/lib/pia/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!piaAccessConfigured()) {
    return NextResponse.json(
      { detail: "PIA access control is not configured" },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = String(body?.password || "");

  if (!verifyPiaPassword(password)) {
    return NextResponse.json({ detail: "Invalid access password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PIA_SESSION_COOKIE, expectedPiaSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PIA_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
