import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const PIA_SESSION_COOKIE = "bconz_pia_session";
// Access is enforced server-side for both the PIA UI and PIA/PCIA proxy routes.

function accessPassword(): string {
  return process.env.PIA_ACCESS_PASSWORD?.trim() || "";
}

function signingSecret(): string {
  return process.env.PIA_PRODUCT_API_TOKEN?.trim() || "";
}

export function piaAccessConfigured(): boolean {
  return Boolean(accessPassword() && signingSecret());
}

export function expectedPiaSession(): string {
  const password = accessPassword();
  const secret = signingSecret();
  if (!password || !secret) return "";

  return createHmac("sha256", secret)
    .update(`bconz-pia-session-v1:${password}`)
    .digest("hex");
}

export function verifyPiaPassword(candidate: string): boolean {
  const expected = accessPassword();
  if (!expected || !candidate) return false;

  const expectedBuffer = Buffer.from(expected);
  const candidateBuffer = Buffer.from(candidate);
  if (expectedBuffer.length !== candidateBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, candidateBuffer);
}

export function verifyPiaSession(candidate: string | undefined): boolean {
  const expected = expectedPiaSession();
  if (!expected || !candidate) return false;

  const expectedBuffer = Buffer.from(expected);
  const candidateBuffer = Buffer.from(candidate);
  if (expectedBuffer.length !== candidateBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, candidateBuffer);
}
