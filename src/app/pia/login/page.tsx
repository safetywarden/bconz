"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PiaLoginPage() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/pia/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.detail || "Unable to sign in");
      }

      const next = searchParams.get("next");
      window.location.assign(next && next.startsWith("/pia") ? next : "/pia");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
          BCONZ PIA
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Provider Intelligence Agent
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the BCONZ PIA access password to continue.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="pia-password" className="text-sm font-medium text-slate-700">
              Access password
            </label>
            <input
              id="pia-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none ring-blue-600 focus:ring-2"
              required
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Open BCONZ PIA"}
          </button>
        </form>
      </div>
    </main>
  );
}
