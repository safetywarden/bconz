import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "bconz_pia_session";

function expectedSession() {
  const password = process.env.PIA_ACCESS_PASSWORD?.trim() || "";
  const secret = process.env.PIA_PRODUCT_API_TOKEN?.trim() || "";
  if (!password || !secret) return "";

  return createHmac("sha256", secret)
    .update(`bconz-pia-session-v1:${password}`)
    .digest("hex");
}

function authorized(request: NextRequest) {
  const expected = expectedSession();
  const supplied = request.cookies.get(COOKIE)?.value || "";
  if (!expected || !supplied) return false;

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (expectedBuffer.length !== suppliedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const isPiaCustomDomain = host === "pia.bconz.com";

  if (pathname === "/pia/login" || pathname === "/api/pia/session") {
    return NextResponse.next();
  }

  const isPiaPage = pathname === "/pia" || pathname.startsWith("/pia/");
  const isPiaApi = pathname.startsWith("/api/pia/") || pathname.startsWith("/api/pcia/");
  const isPiaDomainRoot = isPiaCustomDomain && pathname === "/";

  if (!isPiaPage && !isPiaApi && !isPiaDomainRoot) {
    return NextResponse.next();
  }

  if (!process.env.PIA_ACCESS_PASSWORD?.trim() || !process.env.PIA_PRODUCT_API_TOKEN?.trim()) {
    if (isPiaApi) {
      return NextResponse.json(
        { detail: "PIA access control is not configured" },
        { status: 503 },
      );
    }
    return new NextResponse("BCONZ PIA access control is not configured.", { status: 503 });
  }

  if (authorized(request)) {
    if (isPiaDomainRoot) {
      return NextResponse.rewrite(new URL("/pia", request.url));
    }
    return NextResponse.next();
  }

  if (isPiaApi) {
    return NextResponse.json({ detail: "PIA authentication required" }, { status: 401 });
  }

  const loginUrl = new URL("/pia/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/", "/pia/:path*", "/api/pia/:path*", "/api/pcia/:path*"],
};
