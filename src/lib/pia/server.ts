import "server-only";

const DEFAULT_PIA_GATEWAY = "https://pia-gateway-live-production.up.railway.app";
const DEFAULT_PCIA_GATEWAY = "https://pcia-gateway-live-production.up.railway.app";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing server environment variable: ${name}`);
  }
  return value;
}

export async function piaGatewayRequest(path: string, init: RequestInit = {}) {
  const baseUrl = (process.env.PIA_GATEWAY_URL?.trim() || DEFAULT_PIA_GATEWAY).replace(/\/$/, "");
  const token = required("PIA_PRODUCT_API_TOKEN");
  const ownerId = required("PIA_OWNER_ID");

  return fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-PIA-Owner-Id": ownerId,
      ...(init.headers || {}),
    },
  });
}

export async function pciaGatewayRequest(path: string, init: RequestInit = {}) {
  const baseUrl = (process.env.PCIA_GATEWAY_URL?.trim() || DEFAULT_PCIA_GATEWAY).replace(/\/$/, "");
  const token = required("PCIA_PRODUCT_API_TOKEN");
  const ownerId = required("PIA_OWNER_ID");

  return fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-BCONZ-Owner-Id": ownerId,
      ...(init.headers || {}),
    },
  });
}

export async function proxyJson(response: Response) {
  const text = await response.text();
  let payload: unknown;

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { detail: text || response.statusText };
  }

  return { payload, status: response.status };
}
