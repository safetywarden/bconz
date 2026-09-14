"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type JsonRecord = Record<string, any>;

const MARKET_GROUPS = [
  {
    label: "North America",
    markets: ["United States", "Canada", "Mexico"],
  },
  {
    label: "United Kingdom & Europe",
    markets: [
      "United Kingdom", "Ireland", "Germany", "France", "Spain", "Italy",
      "Netherlands", "Belgium", "Switzerland", "Sweden", "Denmark", "Norway",
      "Finland", "Austria", "Poland", "Portugal", "Czechia", "Greece",
    ],
  },
  {
    label: "South Asia",
    markets: ["India", "Bangladesh", "Sri Lanka", "Nepal", "Pakistan"],
  },
  {
    label: "Southeast & East Asia",
    markets: [
      "Singapore", "Malaysia", "Thailand", "Indonesia", "Philippines", "Vietnam",
      "Japan", "South Korea", "China", "Hong Kong", "Taiwan",
    ],
  },
  {
    label: "Middle East",
    markets: [
      "United Arab Emirates", "Saudi Arabia", "Qatar", "Israel", "Türkiye",
    ],
  },
  {
    label: "Australia & New Zealand",
    markets: ["Australia", "New Zealand"],
  },
  {
    label: "Latin America & Africa",
    markets: ["Brazil", "Argentina", "Chile", "South Africa"],
  },
] as const;

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

export function PiaNewDiscovery() {
  const [title, setTitle] = useState("");
  const [disease, setDisease] = useState("");
  const [country, setCountry] = useState("United States");
  const [requirement, setRequirement] = useState("");
  const [shortlistSize, setShortlistSize] = useState(10);
  const [runId, setRunId] = useState("");
  const [run, setRun] = useState<JsonRecord | null>(null);
  const [starting, setStarting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [validation, setValidation] = useState<JsonRecord | null>(null);
  const [error, setError] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const existing = params.get("run");
    if (existing) {
      setRunId(existing);
      setStartedAt(Date.now());
    }
  }, []);

  useEffect(() => {
    if (!startedAt) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  useEffect(() => {
    if (!runId) return;

    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const response = await fetch(
          `/api/pia/pilots/${encodeURIComponent(runId)}`,
          { cache: "no-store" },
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.detail || "Unable to load PIA discovery");
        }
        if (cancelled) return;

        setRun(payload);
        if (!title && payload?.title) setTitle(String(payload.title));
        if (!requirement && payload?.requirement_text) setRequirement(String(payload.requirement_text));

        const status = String(payload?.status || "").toUpperCase();
        if (["READY_FOR_QUALIFICATION", "FAILED", "CLOSED"].includes(status)) {
          return;
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Unable to load PIA discovery");
        }
      }

      if (!cancelled) {
        timer = window.setTimeout(() => void poll(), 8000);
      }
    };

    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [runId, title, requirement]);

  const status = String(run?.status || (runId ? "QUEUED" : "")).toUpperCase();
  const complete = status === "READY_FOR_QUALIFICATION";
  const failed = status === "FAILED";
  const providerCount = Array.isArray(run?.provider_universe) ? run.provider_universe.length : 0;
  const shortlistCount = Array.isArray(run?.shortlist_provider_ids) ? run.shortlist_provider_ids.length : 0;
  const runtimeTone = useMemo(() => {
    if (!runId || complete || failed) return "normal";
    if (elapsedSeconds >= 1200) return "critical";
    if (elapsedSeconds >= 600) return "slow";
    return "normal";
  }, [runId, complete, failed, elapsedSeconds]);

  async function suggestRequirement() {
    const cleanDisease = disease.trim();
    if (!cleanDisease) {
      setError("Enter a disease or condition first.");
      return;
    }
    if (!country.trim()) {
      setError("Choose a country / market first.");
      return;
    }

    setSuggesting(true);
    setError("");
    setValidation(null);
    try {
      const response = await fetch("/api/pia/suggest-requirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease: cleanDisease,
          country,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail || "Unable to suggest a PIA requirement");
      }

      const suggestedRequirement = String(payload?.suggested_requirement || "").trim();
      if (!suggestedRequirement) {
        throw new Error("PIA did not return a suggested requirement");
      }

      setRequirement(suggestedRequirement);
      if (!title.trim() && payload?.suggested_title) {
        setTitle(String(payload.suggested_title));
      }
      if (payload?.resolved) {
        setValidation(payload.resolved);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to suggest a PIA requirement");
    } finally {
      setSuggesting(false);
    }
  }

  async function startDiscovery() {
    const cleanRequirement = requirement.trim();
    if (!cleanRequirement) {
      setError("Enter a disease, cohort or healthcare-data requirement.");
      return;
    }

    setStarting(true);
    setError("");
    setValidation(null);
    setRun(null);
    try {
      const validationResponse = await fetch("/api/pia/validate-requirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement_text: cleanRequirement }),
      });
      const validationPayload = await validationResponse.json();
      if (!validationResponse.ok || validationPayload?.valid !== true) {
        throw new Error(
          validationPayload?.detail ||
          "PIA could not resolve the requirement. No discovery run was created.",
        );
      }
      setValidation(validationPayload);

      const cleanTitle =
        title.trim() ||
        cleanRequirement.split(/\n|\.|;/)[0].slice(0, 90) ||
        "Provider intelligence discovery";

      const response = await fetch("/api/pia/pilots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          requirement_text: cleanRequirement,
          shortlist_size: Math.max(1, Math.min(100, Number(shortlistSize) || 10)),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail || "Unable to start PIA discovery");
      }

      const id = String(payload?.id || "");
      if (!id) throw new Error("PIA did not return a discovery run ID");

      setRunId(id);
      setStartedAt(Date.now());
      setElapsedSeconds(0);
      window.history.replaceState({}, "", `/pia/new?run=${encodeURIComponent(id)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start PIA discovery");
    } finally {
      setStarting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              BCONZ PIA
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">New provider discovery</h1>
            <p className="mt-1 text-sm text-slate-600">
              Discover and qualify healthcare-provider candidates across international markets for clinical-data and data-partnership opportunities.
            </p>
          </div>
          <Link
            href="/pia"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to saved runs
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-5 px-6 py-6">
        {!runId ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_190px]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Disease / condition
                    </span>
                    <input
                      value={disease}
                      onChange={(event) => {
                        setDisease(event.target.value);
                        setValidation(null);
                      }}
                      placeholder="e.g. Myasthenia Gravis"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Country / market
                    </span>
                    <select
                      value={country}
                      onChange={(event) => {
                        setCountry(event.target.value);
                        setValidation(null);
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {MARKET_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.markets.map((market) => (
                            <option key={market} value={market}>
                              {market}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void suggestRequirement()}
                    disabled={suggesting || !disease.trim() || !country.trim()}
                    className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggesting ? "Preparing requirement…" : "Suggest requirement"}
                  </button>
                  <span className="text-xs leading-5 text-slate-500">
                    PIA will draft a disease-appropriate requirement using a consistent discovery structure. You can edit it before running.
                  </span>
                </div>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Discovery title <span className="normal-case font-normal">(optional)</span>
                  </span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Auto-filled after requirement suggestion, or enter your own"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Disease / cohort / data requirement
                  </span>
                  <textarea
                    value={requirement}
                    onChange={(event) => {
                      setRequirement(event.target.value);
                      setValidation(null);
                    }}
                    rows={8}
                    placeholder="Enter your own requirement, or use Suggest requirement above to auto-populate a consistent editable draft."
                    className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Agent shortlist size
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={shortlistSize}
                    onChange={(event) => setShortlistSize(Number(event.target.value) || 10)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                {validation ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
                    <div className="font-semibold">PIA requirement resolved</div>
                    <div>Country: {String(validation.country || "—")}</div>
                    <div>
                      Disease: {Array.isArray(validation.diseases) ? validation.diseases.join(", ") : "—"}
                    </div>
                    <div>Specialty: {String(validation.specialty || "—")}</div>
                    <div>Intent: {String(validation.requirement_type || "—")}</div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => void startDiscovery()}
                  disabled={starting || suggesting || !requirement.trim()}
                  className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {starting ? "Starting PIA…" : "Run provider discovery"}
                </button>

                <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  <div className="font-semibold text-slate-800">Runtime target</div>
                  <div className="mt-1">Typical: 5–15 minutes</div>
                  <div>Hard execution budget: 20 minutes</div>
                  <div>Stale-run cutoff: 25 minutes</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Discovery run
                </div>
                <h2 className="mt-1 text-xl font-semibold">{String(run?.title || title || runId)}</h2>
                <p className="mt-1 text-xs text-slate-500">{runId}</p>
              </div>
              <div
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  complete
                    ? "bg-emerald-100 text-emerald-800"
                    : failed
                      ? "bg-rose-100 text-rose-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {status || "QUEUED"}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Elapsed</div>
                <div className="mt-1 text-lg font-semibold">{formatElapsed(elapsedSeconds)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stage</div>
                <div className="mt-1 text-sm font-semibold">{String(run?.stage || "QUEUED")}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Providers</div>
                <div className="mt-1 text-lg font-semibold">{providerCount}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shortlist</div>
                <div className="mt-1 text-lg font-semibold">{shortlistCount}</div>
              </div>
            </div>

            {!complete && !failed ? (
              <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                  runtimeTone === "critical"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : runtimeTone === "slow"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                {runtimeTone === "critical"
                  ? "This run has exceeded the 20-minute execution target and should terminate as failed rather than continue indefinitely."
                  : runtimeTone === "slow"
                    ? "This run is taking longer than typical, but is still within the hard execution budget."
                    : "PIA is discovering and ranking providers. Status is checked every 8 seconds."}
              </div>
            ) : null}

            {complete ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/pia"
                  className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Open discovery workspace
                </Link>
                <Link
                  href="/pia/new"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Start another discovery
                </Link>
              </div>
            ) : null}

            {failed ? (
              <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {String(run?.failure || "PIA discovery failed.")}
              </div>
            ) : null}
          </section>
        )}

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}