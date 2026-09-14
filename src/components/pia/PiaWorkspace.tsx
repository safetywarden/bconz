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

export function PiaWorkspace() {
  const [pilots, setPilots] = useState<JsonRecord[]>([]);
  const [selectedPilotId, setSelectedPilotId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [view, setView] = useState<"shortlist" | "universe" | "requirement">("shortlist");
  const [loading, setLoading] = useState(true);
  const [busyProvider, setBusyProvider] = useState("");
  const [busyShortlist, setBusyShortlist] = useState(false);
  const [error, setError] = useState("");

  const loadPilots = useCallback(async () => {
    setLoading(true);
    setError("");
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPilots();
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

  const rows = view === "universe" ? universe : shortlist;
  const selectedRow = useMemo(
    () => universe.find((row: JsonRecord) => providerId(row) === selectedProviderId),
    [universe, selectedProviderId],
  );

  const contact = selectedRow ? contactView(selectedRow) : null;

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
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || payload?.error || "PCIA enrichment failed");
      await loadPilots();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "PCIA enrichment failed");
    } finally {
      setBusyProvider("");
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
        body: JSON.stringify({ pilot_id: pilot.id, limit: Math.min(shortlist.length || 20, 20) }),
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

      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 py-6 xl:grid-cols-[1fr_460px]">
        <section className="min-w-0 space-y-5">
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
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
              {view === "shortlist" && shortlist.length ? (
                <button
                  onClick={() => void enrichShortlist()}
                  disabled={busyShortlist}
                  className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {busyShortlist ? "PCIA enriching…" : "Enrich shortlist with PCIA"}
                </button>
              ) : null}
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
                      <th className="px-5 py-3">Rank</th>
                      <th className="px-5 py-3">Provider</th>
                      <th className="px-5 py-3">Website</th>
                      <th className="px-5 py-3">Evidence</th>
                      <th className="px-5 py-3">PCIA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td className="px-5 py-10 text-sm text-slate-500" colSpan={5}>Loading saved PIA runs…</td></tr>
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
                              <StatusBadge status={contactRow.status} />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td className="px-5 py-10 text-sm text-slate-500" colSpan={5}>No providers available in this view.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {selectedRow && contact ? (
              <>
                <div className="border-b border-slate-200 px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">PCIA contact intelligence</div>
                      <h2 className="mt-1 text-xl font-semibold">{providerName(selectedRow)}</h2>
                    </div>
                    <StatusBadge status={contact.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => void enrichProvider()}
                      disabled={busyProvider === selectedProviderId}
                      className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {busyProvider === selectedProviderId ? "PCIA enriching…" : contact.status === "NOT_STARTED" ? "Enrich with PCIA" : "Refresh PCIA"}
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
                </div>
                <div className="divide-y divide-slate-100">
                  <ContactRow label="Address" value={contact.address} />
                  <ContactRow label="City" value={contact.city} />
                  <ContactRow label="State / region" value={contact.stateRegion} />
                  <ContactRow label="Country" value={contact.country} />
                  <ContactRow label="Postal code" value={contact.postalCode} />
                  <ContactRow label="Phone" value={contact.phone} href={contact.phone ? `tel:${contact.phone}` : undefined} />
                  <ContactRow label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
                  <ContactRow label="Contact person" value={contact.contactPerson} />
                  <ContactRow label="Role / department" value={contact.roleDepartment} />
                  <ContactRow label="Contact source" value={contact.contactSource} />
                  <ContactRow label="Last verified" value={formatDate(contact.lastVerified || null)} />
                  <ContactRow label="Website" value={contact.website} href={contact.website || undefined} />
                </div>
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
