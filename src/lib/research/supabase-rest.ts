type SupabaseMethod = "GET" | "POST" | "PATCH" | "DELETE";

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required for research persistence");
  }

  return { url: url.replace(/\/$/, ""), key };
}

export async function researchDb<T>(
  path: string,
  options: { method?: SupabaseMethod; body?: unknown; prefer?: string } = {},
): Promise<T> {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Research database request failed (${response.status}): ${await response.text()}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
