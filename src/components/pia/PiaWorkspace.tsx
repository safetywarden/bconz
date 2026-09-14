"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type JsonRecord = Record<string, any>;

type ContactView = {
  status: string;
  address?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
  contactPerson?: string | null;
  roleDepartment?: string | null;
  contactSource?: string[] | string | null;
  lastVerified?: string | null;
  website?: string | null;
};

type PciaPerson = {
  person_key?: string;
  person_name?: string;
  role_title?: string | null;
  organization_name?: string | null;
  linkedin_url?: string | null;
  professional_email?: string | null;
  professional_phone?: string | null;
  status?: string;
  relevance_score?: number | string | null;
  confidence?: number | string | null;
  relevance_reason?: string | null;
  source_urls?: string[];
  metadata?: JsonRecord;
  last_verified?: string | null;
};

type EngagementPathway = {
  recommended_first_contact?: string | null;
  recommended_sequence?: string[];
  best_channel?: string | null;
  rationale?: string | null;
};

type PciaProviderIntel = {
  status?: string;
  error?: string | null;
  contact_details?: JsonRecord;
  people?: PciaPerson[];
  official_website?: string | null;
  last_verified?: string | null;
  updated_at?: string | null;
};

function value(...candidates: any[]) {
  return candidates.find((candidate) => candidate !== undefined && candidate !== null && candidate !== "");
}

function providerObject(row: JsonRecord) {
  return (row?.provider && typeof row.provider === "object" ? row.provider : row) || {};
}

function providerId(row: JsonRecord) {
  const provider = providerObject(row);
  return String(value(row?.provider_id, row?.providerId, provider?.id, provider?.provider_id, "") || "");
}

function providerName(row: JsonRecord) {
  const provider = providerObject(row);
  return String(
    value(
      provider?.canonical_name,
      provider?.canonicalName,
      provider?.name,
      row?.canonical_name,
      row?.provider_name,
      "Unnamed provider",
    ),
  );
}

function providerWebsite(row: JsonRecord) {
  const provider = providerObject(row);
  const details =
    provider?.contact_details ||
    provider?.contactDetails ||
    row?.contact_details ||
    row?.contactDetails ||
    {};
  return value(
    provider?.official_website,
    provider?.officialWebsite,
    row?.official_website,
    row?.officialWebsite,
    details?.website,
    provider?.website,
    row?.website,
    provider?.access_pathways?.[0]?.url,
  );
}

function contactView(row: JsonRecord): ContactView {
  const provider = providerObject(row);
  const details =
    provider?.contact_details ||
    provider?.contactDetails ||
    provider?.contact ||
    row?.contact_details ||
    row?.contactDetails ||
    row?.contact ||
    {};

  return {
    status: String(
      value(
        provider?.contact_enrichment_status,
        provider?.contactEnrichmentStatus,
        row?.contact_enrichment_status,
        row?.contactEnrichmentStatus,
        details?.enrichment_status,
        "NOT_STARTED",
      ),
    ),
    address: value(provider?.address, row?.address, details?.address),
    city: value(provider?.city, row?.city, details?.city),
    stateRegion: value(
      provider?.state_region,
      provider?.stateRegion,
      row?.state_region,
      row?.stateRegion,
      details?.state_region,
    ),
    country: value(provider?.country, row?.country, details?.country, provider?.country_code),
    postalCode: value(
      provider?.postal_code,
      provider?.postalCode,
      row?.postal_code,
      row?.postalCode,
      details?.postal_code,
    ),
    phone: value(provider?.phone, row?.phone, details?.phone),
    email: value(provider?.email, row?.email, details?.email),
    contactPerson: value(
      provider?.contact_person,
      provider?.contactPerson,
      row?.contact_person,
      row?.contactPerson,
      details?.contact_person,
    ),
    roleDepartment: value(
      provider?.role_department,
      provider?.roleDepartment,
      row?.role_department,
      row?.roleDepartment,
      details?.role_department,
    ),
    contactSource: value(
      provider?.contact_source,
      provider?.contactSource,
      row?.contact_source,
      row?.contactSource,
      details?.contact_source,
    ),
    lastVerified: value(
      provider?.last_verified,
      provider?.lastVerified,
      row?.last_verified,
      row?.lastVerified,
      details?.last_verified,
    ),
    website: providerWebsite(row),
  };
}

function rowContactDetails(row: JsonRecord | undefined) {
  if (!row) return {};
  const provider = providerObject(row);
  return (
    provider?.contact_details ||
    provider?.contactDetails ||
    row?.contact_details ||
    row?.contactDetails ||
    {}
  ) as JsonRecord;
}

function contactFromIntel(row: JsonRecord, intel: PciaProviderIntel | null): ContactView {
  const base = contactView(row);
  const details = intel?.contact_details || {};

  return {
    status: String(value(intel?.status, details?.enrichment_status, base.status)),
    address: value(details?.address, base.address),
    city: value(details?.city, base.city),
    stateRegion: value(details?.state_region, details?.stateRegion, base.stateRegion),
    country: value(details?.country, base.country),
    postalCode: value(details?.postal_code, details?.postalCode, base.postalCode),
    phone: value(details?.phone, base.phone),
    email: value(details?.email, base.email),
    contactPerson: value(details?.contact_person, details?.contactPerson, base.contactPerson),
    roleDepartment: value(details?.role_department, details?.roleDepartment, base.roleDepartment),
    contactSource: value(details?.contact_source, details?.contactSource, base.contactSource),
    lastVerified: value(details?.last_verified, intel?.last_verified, base.lastVerified),
    website: value(details?.website, intel?.official_website, base.website),
  };
}

function numericScore(value: unknown, scale = 100) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed <= 1 && scale === 100 ? Math.round(parsed * 100) : Math.round(parsed);
}

function canonicalPersonName(name: string) {
  return name
    .replace(/^(dr|prof|professor|mr|mrs|ms|miss)\.?\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function uniqueUrls(...values: unknown[]) {
  const urls: string[] = [];
  for (const value of values) {
    const candidates = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.startsWith("http") && !urls.includes(candidate)) {
        urls.push(candidate);
      }
    }
  }
  return urls;
}

function rankOf(row: JsonRecord, index: number) {
  return Number(value(row?.rank, row?.shortlist_rank, row?.shortlistRank, index + 1));
}

function signalOf(row: JsonRecord) {
  return String(
    value(
      row?.relevance_band,
      row?.relevanceBand,
      row?.provider?.evidence_summary?.signal,
      row?.provider?.qualification_intelligence?.status,
      "—",
    ),
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function textOrDash(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not collected";
  if (typeof value === "string" && value.trim()) return value;
  return "Not collected";
}

function peopleStatusOfRow(row: JsonRecord) {
  const details = rowContactDetails(row);
  return String(value(details?.people_status, "NOT_STARTED")).toUpperCase();
}

function deepPciaFinished(status: string) {
  return [
    "OUTREACH_READY",
    "MULTI_SOURCE_VERIFIED",
    "CANDIDATES_FOUND",
    "NO_MATCH",
    "FAILED",
  ].includes(String(status).toUpperCase());
}

export function PiaWorkspace() {
  const [pilots, setPilots] = useState<JsonRecord[]>([]);
  const [selectedPilotId, setSelectedPilotId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [view, setView] = useState<"shortlist" | "universe" | "requirement">("shortlist");
  const [loading, setLoading] = useState(true);
  const [busyProvider, setBusyProvider] = useState("");
  const [busyShortlist, setBusyShortlist] = useState(false);
  const [pciaSelectedIds, setPciaSelectedIds] = useState<string[]>([]);
  const [batchProviderIds, setBatchProviderIds] = useState<string[]>([]);
  const [batchMessage, setBatchMessage] = useState("");
  const [providerIntel, setProviderIntel] = useState<PciaProviderIntel | null>(null);
  const [providerIntelLoading, setProviderIntelLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPilots = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    if (showLoading) setError("");
    try {
      const response = await fetch("/api/pia/pilots", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || "Unable to load PIA runs");
      const items = Array.isArray(payload?.pilots) ? payload.pilots : [];
      setPilots(items);
      setSelectedPilotId((current) => current || String(items[0]?.id || ""));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load PIA runs");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPilots(true);
  }, [loadPilots]);

  const pilot = useMemo(
    () => pilots.find((item) => String(item?.id) === selectedPilotId) || pilots[0],
    [pilots, selectedPilotId],
  );

  const universe = useMemo(
    () => (Array.isArray(pilot?.provider_universe) ? pilot.provider_universe : []),
    [pilot],
  );

  const shortlistIds = useMemo(() => {
    const values =
      (Array.isArray(pilot?.viewer_shortlist_provider_ids) && pilot.viewer_shortlist_provider_ids.length
        ? pilot.viewer_shortlist_provider_ids
        : pilot?.shortlist_provider_ids) || [];
    return new Set(values.map(String));
  }, [pilot]);

  const shortlist = useMemo(
    () => universe.filter((row: JsonRecord) => shortlistIds.has(providerId(row))),
    [universe, shortlistIds],
  );

  useEffect(() => {
    if (!batchProviderIds.length) return;
    const timer = window.setInterval(() => {
      void loadPilots(false);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [batchProviderIds.length, loadPilots]);

  useEffect(() => {
    if (!batchProviderIds.length || !universe.length) return;

    const targetRows = batchProviderIds
      .map((id) => universe.find((row: JsonRecord) => providerId(row) === id))
      .filter(Boolean) as JsonRecord[];

    if (targetRows.length !== batchProviderIds.length) return;
    if (!targetRows.every((row) => deepPciaFinished(peopleStatusOfRow(row)))) return;

    const failed = targetRows.filter((row) => peopleStatusOfRow(row) === "FAILED").length;
    setBatchMessage(
      failed
        ? `Deep PCIA finished: ${targetRows.length - failed} completed, ${failed} failed.`
        : `Deep PCIA finished for ${targetRows.length} provider${targetRows.length === 1 ? "" : "s"}.`,
    );
    setBatchProviderIds([]);
    void loadPilots(false);
  }, [batchProviderIds, universe, loadPilots]);

  const rows = view === "universe" ? universe : shortlist;
  const selectedRow = useMemo(
    () => universe.find((row: JsonRecord) => providerId(row) === selectedProviderId),
    [universe, selectedProviderId],
  );

  const selectedRowDetails = rowContactDetails(selectedRow);
  const contact = selectedRow ? contactFromIntel(selectedRow, providerIntel) : null;
  const people = useMemo(() => {
    const source =
      (Array.isArray(providerIntel?.people) && providerIntel.people.length
        ? providerIntel.people
        : Array.isArray(providerIntel?.contact_details?.people_intelligence)
          ? providerIntel?.contact_details?.people_intelligence
          : Array.isArray(selectedRowDetails?.people_intelligence)
            ? selectedRowDetails.people_intelligence
            : []) as PciaPerson[];

    const seen = new Set<string>();
    return source.filter((person) => {
      const key = canonicalPersonName(String(person.person_name || ""));
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [providerIntel, selectedRowDetails]);
  const engagement = (
    providerIntel?.contact_details?.engagement_pathway ||
    selectedRowDetails?.engagement_pathway ||
    {}
  ) as EngagementPathway;
  const peopleStatus = String(
    value(
      providerIntel?.contact_details?.people_status,
      selectedRowDetails?.people_status,
      people.length ? "CANDIDATES_FOUND" : "NOT_STARTED",
    ),
  );
  const evidenceUrls = uniqueUrls(
    contact?.contactSource,
    ...people.map((person) => person.source_urls || []),
  );

  useEffect(() => {
    if (!pilot?.id || !selectedProviderId) {
      setProviderIntel(null);
      return;
    }

    let cancelled = false;
    setProviderIntelLoading(true);

    const query = new URLSearchParams({
      pilot_id: String(pilot.id),
      provider_id: selectedProviderId,
    });

    fetch(`/api/pcia/provider?${query.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.detail || "Unable to load PCIA provider intelligence");
        if (!cancelled) setProviderIntel(payload);
      })
      .catch(() => {
        if (!cancelled) {
          // The saved PIA row already carries the persisted PCIA overlay.
          // Keep the drawer usable even if the provider-details refresh is unavailable.
          setProviderIntel(null);
        }
      })
      .finally(() => {
        if (!cancelled) setProviderIntelLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pilot?.id, selectedProviderId]);

  async function enrichProvider() {
    if (!pilot?.id || !selectedProviderId) return;
    setBusyProvider(selectedProviderId);
    setError("");
    try {
      const response = await fetch("/api/pcia/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pilot_id: pilot.id,
          provider_id: selectedProviderId,
          force: true,
          people: true,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || payload?.error || "PCIA enrichment failed");
      setProviderIntel(payload);
      await loadPilots();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "PCIA enrichment failed");
    } finally {
      setBusyProvider("");
    }
  }

  function togglePciaSelection(id: string) {
    setError("");
    setBatchMessage("");
    setPciaSelectedIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      if (current.length >= 20) {
        setError("Deep PCIA batch is limited to 20 selected providers.");
        return current;
      }
      return [...current, id];
    });
  }

  async function startDeepBatch(providerIds: string[]) {
    if (!pilot?.id) return;
    const ids = Array.from(new Set(providerIds.filter(Boolean))).slice(0, 20);
    if (!ids.length) {
      setError("Select at least one provider for deep PCIA.");
      return;
    }

    setBusyShortlist(true);
    setError("");
    setBatchMessage("");
    try {
      const response = await fetch("/api/pcia/enrich-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pilot_id: pilot.id,
          provider_ids: ids,
          people: true,
          force: false,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail || "Unable to queue deep PCIA batch");
      }

      const queued = Array.isArray(payload?.provider_ids) ? payload.provider_ids.map(String) : ids;
      setBatchProviderIds(queued);
      setBatchMessage(
        `Deep PCIA queued for ${queued.length} provider${queued.length === 1 ? "" : "s"}. Completed intelligence will be reused; only missing people intelligence will run.`,
      );
      setPciaSelectedIds([]);
      await loadPilots(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to queue deep PCIA batch");
    } finally {
      setBusyShortlist(false);
    }
  }

  async function enrichShortlist() {
    if (!pilot?.id) return;
    setBusyShortlist(true);
    setError("");
    try {
      const response = await fetch("/api/pcia/enrich-shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pilot_id: pilot.id,
          limit: Math.min(shortlist.length || 20, 20),
          people: false,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || "PCIA shortlist enrichment failed");
      await loadPilots();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "PCIA shortlist enrichment failed");
    } finally {
      setBusyShortlist(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              BCONZ PIA
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Provider Intelligence Agent</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Discover, evaluate and prioritize healthcare providers, then hand selected targets to PCIA for contact intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Saved PIA run"
              value={pilot?.id || ""}
              onChange={(event) => {
                setSelectedPilotId(event.target.value);
                setSelectedProviderId("");
                setPciaSelectedIds([]);
                setBatchProviderIds([]);
                setBatchMessage("");
              }}
              className="min-w-72 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm"
            >
              {pilots.map((item) => (
                <option key={String(item.id)} value={String(item.id)}>
                  {String(item.title || item.id)}
                </option>
              ))}
            </select>
            <button
              onClick={() => void loadPilots()}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1720px] gap-5 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_620px]">
        <section className="min-w-0 space-y-5">
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          ) : null}

          {batchMessage ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              {batchMessage}
              {batchProviderIds.length ? (
                <span className="ml-2 font-semibold">Refreshing progress every 8 seconds.</span>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="Complete universe" value={universe.length} detail="providers retained" />
            <Metric label="Agent shortlist" value={shortlist.length} detail="prioritized providers" />
            <Metric
              label="PCIA enriched"
              value={universe.filter((row: JsonRecord) => ["PARTIAL", "COMPLETE"].includes(contactView(row).status)).length}
              detail="reusable contact records"
            />
            <Metric label="Run status" value={String(pilot?.status || "—")} detail={pilot?.updated_at ? formatDate(pilot.updated_at) || "" : ""} small />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex gap-2">
                {[
                  ["shortlist", "Agent shortlist"],
                  ["universe", "Provider universe"],
                  ["requirement", "Requirement"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setView(key as typeof view)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      view === key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {view === "shortlist" && shortlist.length ? (
                  <>
                    <button
                      onClick={() => void enrichShortlist()}
                      disabled={busyShortlist || batchProviderIds.length > 0}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Enrich shortlist contacts
                    </button>
                    <button
                      onClick={() => void startDeepBatch(shortlist.map((row: JsonRecord) => providerId(row)))}
                      disabled={busyShortlist || batchProviderIds.length > 0}
                      className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {batchProviderIds.length ? "Deep PCIA running…" : `Deep PCIA all shortlist (${Math.min(shortlist.length, 20)})`}
                    </button>
                  </>
                ) : null}

                {view === "universe" ? (
                  <>
                    <span className="text-xs font-medium text-slate-500">
                      {pciaSelectedIds.length}/20 selected
                    </span>
                    {pciaSelectedIds.length ? (
                      <button
                        onClick={() => setPciaSelectedIds([])}
                        disabled={batchProviderIds.length > 0}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Clear
                      </button>
                    ) : null}
                    <button
                      onClick={() => void startDeepBatch(pciaSelectedIds)}
                      disabled={!pciaSelectedIds.length || busyShortlist || batchProviderIds.length > 0}
                      className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {batchProviderIds.length
                        ? "Deep PCIA running…"
                        : `Deep PCIA selected (${pciaSelectedIds.length})`}
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {view === "requirement" ? (
              <div className="p-6">
                <h2 className="text-lg font-semibold">{pilot?.title || "Provider intelligence requirement"}</h2>
                <div className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {String(
                    value(
                      pilot?.requirement_text,
                      pilot?.requirement,
                      pilot?.requirement?.raw_text,
                      "No requirement text available.",
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Select</th>
                      <th className="px-5 py-3">Rank</th>
                      <th className="px-5 py-3">Provider</th>
                      <th className="px-5 py-3">Website</th>
                      <th className="px-5 py-3">Evidence</th>
                      <th className="px-5 py-3">PCIA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td className="px-5 py-10 text-sm text-slate-500" colSpan={6}>Loading saved PIA runs…</td></tr>
                    ) : rows.length ? (
                      rows.map((row: JsonRecord, index: number) => {
                        const id = providerId(row);
                        const contactRow = contactView(row);
                        const website = providerWebsite(row);
                        return (
                          <tr
                            key={id || index}
                            onClick={() => setSelectedProviderId(id)}
                            className={`cursor-pointer hover:bg-blue-50/60 ${
                              selectedProviderId === id ? "bg-blue-50" : "bg-white"
                            }`}
                          >
                            <td className="px-5 py-4">
                              <input
                                type="checkbox"
                                aria-label={`Select ${providerName(row)} for deep PCIA`}
                                checked={pciaSelectedIds.includes(id)}
                                disabled={
                                  batchProviderIds.length > 0 ||
                                  (!pciaSelectedIds.includes(id) && pciaSelectedIds.length >= 20)
                                }
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => togglePciaSelection(id)}
                                className="h-4 w-4 rounded border-slate-300"
                              />
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-slate-500">{rankOf(row, index)}</td>
                            <td className="px-5 py-4">
                              <div className="font-semibold text-slate-900">{providerName(row)}</div>
                              <div className="mt-1 text-xs text-slate-500">
                                {String(providerObject(row)?.country_code || "—")} · {String(providerObject(row)?.provider_type || "provider")}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm">
                              {website ? (
                                <a
                                  href={String(website)}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="font-medium text-blue-700 hover:underline"
                                >
                                  Visit website ↗
                                </a>
                              ) : (
                                <span className="text-slate-400">Not resolved</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-xs font-medium text-slate-600">{signalOf(row)}</td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-1.5">
                                <StatusBadge status={contactRow.status} />
                                {peopleStatusOfRow(row) !== "NOT_STARTED" ? (
                                  <PeopleStatusBadge status={peopleStatusOfRow(row)} />
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td className="px-5 py-10 text-sm text-slate-500" colSpan={6}>No providers available in this view.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            {selectedRow && contact ? (
              <>
                <div className="border-b border-slate-200 px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                        PCIA people & engagement intelligence
                      </div>
                      <h2 className="mt-1 text-xl font-semibold">{providerName(selectedRow)}</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge status={contact.status} />
                        <PeopleStatusBadge status={peopleStatus} />
                        {people.length ? (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                            {people.length} people
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => void enrichProvider()}
                      disabled={busyProvider === selectedProviderId}
                      className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {busyProvider === selectedProviderId
                        ? "Deep PCIA running…"
                        : contact.status === "NOT_STARTED"
                          ? "Deep enrich with PCIA"
                          : "Refresh deep PCIA"}
                    </button>
                    {contact.website ? (
                      <a
                        href={String(contact.website)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Official website ↗
                      </a>
                    ) : null}
                  </div>
                  {providerIntelLoading ? (
                    <div className="mt-3 text-xs text-slate-500">Loading full PCIA intelligence…</div>
                  ) : null}
                </div>

                <DrawerSection title="Institutional contact">
                  <div className="divide-y divide-slate-100">
                    <ContactRow label="Phone" value={contact.phone} href={contact.phone ? `tel:${contact.phone}` : undefined} />
                    <ContactRow label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
                    <ContactRow label="Address" value={contact.address} />
                    <ContactRow label="City" value={contact.city} />
                    <ContactRow label="State / region" value={contact.stateRegion} />
                    <ContactRow label="Country" value={contact.country} />
                    <ContactRow label="Postal code" value={contact.postalCode} />
                    <ContactRow label="Last verified" value={formatDate(contact.lastVerified || null)} />
                  </div>
                </DrawerSection>

                <DrawerSection
                  title="Recommended people"
                  subtitle={
                    people.length
                      ? "Ranked for this PIA requirement — not generic organizational seniority."
                      : "Run deep PCIA to identify requirement-specific people."
                  }
                >
                  {people.length ? (
                    <div className="space-y-3">
                      {people.map((person, index) => (
                        <PersonCard key={person.person_key || `${person.person_name}-${index}`} person={person} rank={index + 1} />
                      ))}
                    </div>
                  ) : (
                    <EmptyHint text={providerIntelLoading ? "Loading people intelligence…" : "No source-backed people candidates captured yet."} />
                  )}
                </DrawerSection>

                <DrawerSection title="Recommended engagement pathway">
                  {engagement?.recommended_first_contact ||
                  engagement?.best_channel ||
                  engagement?.recommended_sequence?.length ? (
                    <div className="space-y-4 text-sm">
                      {engagement.recommended_first_contact ? (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">First approach</div>
                          <div className="mt-1 leading-6 text-slate-800">{engagement.recommended_first_contact}</div>
                        </div>
                      ) : null}
                      {engagement.best_channel ? (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Best channel</div>
                          <div className="mt-1 leading-6 text-slate-800">{engagement.best_channel}</div>
                        </div>
                      ) : null}
                      {engagement.recommended_sequence?.length ? (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sequence</div>
                          <ol className="mt-2 space-y-2">
                            {engagement.recommended_sequence.map((step, index) => (
                              <li key={index} className="flex gap-3 leading-6 text-slate-700">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                                  {index + 1}
                                </span>
                                <span>{step.replace(/^\d+\.\s*/, "")}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ) : null}
                      {engagement.rationale ? (
                        <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <summary className="cursor-pointer text-xs font-semibold text-slate-600">Why this pathway</summary>
                          <p className="mt-2 leading-6 text-slate-700">{engagement.rationale}</p>
                        </details>
                      ) : null}
                    </div>
                  ) : (
                    <EmptyHint text="No engagement pathway captured yet." />
                  )}
                </DrawerSection>

                <DrawerSection title="Evidence & provenance" subtitle={`${evidenceUrls.length} source URLs captured`}>
                  <EvidenceLinks urls={evidenceUrls} />
                </DrawerSection>
              </>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="text-sm font-semibold text-slate-700">Select a provider</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose a provider from the shortlist or universe to inspect its PCIA contact intelligence.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
  small = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className={`mt-2 font-semibold tracking-tight text-slate-950 ${small ? "text-lg" : "text-3xl"}`}>
        {value}
      </div>
      <div className="mt-1 truncate text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const className =
    normalized === "COMPLETE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : normalized === "PARTIAL"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : normalized === "FAILED"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : normalized === "RUNNING"
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      {normalized === "NOT_STARTED" ? "Not enriched" : normalized}
    </span>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: unknown;
  href?: string;
}) {
  const rendered = textOrDash(value);
  const missing = rendered === "Not collected";

  return (
    <div className="grid grid-cols-[125px_1fr] gap-4 px-5 py-3.5 text-sm">
      <div className="text-slate-500">{label}</div>
      <div className={missing ? "italic text-amber-700" : "break-words font-medium text-slate-900"}>
        {href && !missing ? (
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-blue-700 hover:underline">
            {rendered}
          </a>
        ) : (
          rendered
        )}
      </div>
    </div>
  );
}


function DrawerSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 px-5 py-5 last:border-b-0">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function PeopleStatusBadge({ status }: { status: string }) {
  const normalized = String(status || "NOT_STARTED").toUpperCase();
  const className =
    normalized === "OUTREACH_READY"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : normalized === "MULTI_SOURCE_VERIFIED"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : normalized === "CANDIDATES_FOUND"
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : normalized === "FAILED"
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      People: {normalized.replaceAll("_", " ")}
    </span>
  );
}

function PersonCard({ person, rank }: { person: PciaPerson; rank: number }) {
  const relevance = numericScore(person.relevance_score);
  const confidence = numericScore(person.confidence);
  const sources = uniqueUrls(person.source_urls || []);

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-slate-950">{person.person_name || "Unnamed professional"}</h4>
            <PersonStatusBadge status={person.status || "IDENTIFIED"} />
          </div>
          {person.role_title ? (
            <p className="mt-1 text-xs leading-5 text-slate-600">{person.role_title}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {relevance !== null ? (
              <span className="rounded-full bg-white px-2 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                Relevance {relevance}/100
              </span>
            ) : null}
            {confidence !== null ? (
              <span className="rounded-full bg-white px-2 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                Confidence {confidence}%
              </span>
            ) : null}
          </div>

          {person.relevance_reason ? (
            <p className="mt-3 text-xs leading-5 text-slate-700">{person.relevance_reason}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {person.professional_email ? (
              <a href={`mailto:${person.professional_email}`} className="font-medium text-blue-700 hover:underline">
                Email / route ↗
              </a>
            ) : null}
            {person.professional_phone ? (
              <a href={`tel:${person.professional_phone}`} className="font-medium text-blue-700 hover:underline">
                Phone ↗
              </a>
            ) : null}
            {person.linkedin_url ? (
              <a href={person.linkedin_url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">
                LinkedIn ↗
              </a>
            ) : null}
          </div>

          {sources.length ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-600">
                Evidence sources ({sources.length})
              </summary>
              <div className="mt-2">
                <EvidenceLinks urls={sources} compact />
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function PersonStatusBadge({ status }: { status: string }) {
  const normalized = String(status).toUpperCase();
  const className =
    normalized === "OUTREACH_READY"
      ? "bg-emerald-100 text-emerald-800"
      : normalized === "MULTI_SOURCE_VERIFIED"
        ? "bg-blue-100 text-blue-800"
        : normalized === "ROLE_MATCHED"
          ? "bg-violet-100 text-violet-800"
          : normalized === "CONTACT_FOUND"
            ? "bg-amber-100 text-amber-800"
            : "bg-slate-200 text-slate-700";

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}>
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

function EvidenceLinks({ urls, compact = false }: { urls: string[]; compact?: boolean }) {
  if (!urls.length) return <EmptyHint text="No source URLs captured." />;

  return (
    <div className="space-y-2">
      {urls.map((url, index) => {
        let host = url;
        try {
          host = new URL(url).hostname.replace(/^www\./, "");
        } catch {
          // Keep the original URL label.
        }

        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`block rounded-lg border border-slate-200 bg-white px-3 py-2 text-blue-700 hover:border-blue-200 hover:bg-blue-50 ${compact ? "text-[11px]" : "text-xs"}`}
          >
            <span className="font-semibold">Source {index + 1}</span>
            <span className="ml-2 break-all text-slate-500">{host}</span>
            <span className="ml-1">↗</span>
          </a>
        );
      })}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="rounded-lg bg-slate-50 px-3 py-4 text-sm text-slate-500">{text}</div>;
}
