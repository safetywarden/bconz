"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Tab = "overview" | "portfolio" | "candidates" | "changes" | "run";

type Disease = {
  id: string;
  canonical_name: string;
  portfolio_status: string;
  portfolio_tier: string | null;
  opportunity_score: number | null;
  evidence_confidence: number | null;
  last_reviewed_at: string | null;
};

type Candidate = {
  id: string;
  disease_id: string;
  drug_name: string;
  gene_name: string | null;
  relation_type: string;
  hypothesis_summary: string;
  generation_score: number;
  confidence: number;
  status: string;
  preliminary_dra_score: number;
  routing_decision: string;
  novelty_score: number;
  competition_penalty: number;
  negative_evidence_penalty: number;
  human_exposure_score: number;
  development_readiness_score: number;
  cross_disease_support: number;
  ranking_version: string;
};

type HypothesisChange = {
  id: string;
  candidate_id: string;
  source_type: string;
  source_id: string;
  direction: "STRENGTHEN" | "WEAKEN" | "KILL" | "NEUTRAL";
  confidence: number;
  proposed_dra_delta: number;
  proposed_rdia_delta: number;
  hard_gate_candidate: boolean;
  rationale: string;
  matched_signals: string[];
  review_status: string;
  created_at: string;
};

type PipelineResult = {
  diseaseName: string;
  fetched: number;
  normalized: number;
  persisted: number;
  pubtator3?: { entitiesExtracted: number; relationsExtracted: number };
  ontology?: { resolved: number };
  evidenceQuality?: { scored: number; meanComposite: number; highQuality: number };
  materialChanges?: { red: number; amber: number; green: number; reviewRequired: number };
  hypothesisChanges?: { strengthen: number; weaken: number; kill: number; humanReviewRequired: number };
  candidateGeneration?: { generated: number; reviewReady: number; topScore: number };
  candidateRanking?: { ranked: number; fastTrack: number; review: number };
};

const tabs: Array<{ id: Tab; label: string; description: string }> = [
  { id: "overview", label: "Overview", description: "System status" },
  { id: "portfolio", label: "RDIA Portfolio", description: "Disease priorities" },
  { id: "candidates", label: "Candidate Ranking", description: "CRN-2.0 queue" },
  { id: "changes", label: "Hypothesis Changes", description: "Review signals" },
  { id: "run", label: "Run Engine", description: "Ingest & re-rank" },
];

function scoreTone(score: number | null | undefined) {
  if (score === null || score === undefined) return "bg-slate-100 text-slate-600";
  if (score >= 75) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (score >= 60) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

function routeTone(route: string) {
  if (route === "FAST_TRACK_DRA") return "bg-emerald-100 text-emerald-800";
  if (route === "DRA_REVIEW") return "bg-blue-100 text-blue-800";
  if (route === "HOLD") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-600";
}

function directionTone(direction: HypothesisChange["direction"]) {
  if (direction === "STRENGTHEN") return "bg-emerald-100 text-emerald-800";
  if (direction === "KILL") return "bg-rose-100 text-rose-800";
  if (direction === "WEAKEN") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-600";
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
    </div>
  );
}

export function ResearchIntelligenceDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<Disease[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [changes, setChanges] = useState<HypothesisChange[]>([]);
  const [routeFilter, setRouteFilter] = useState("ALL");
  const [reviewer, setReviewer] = useState("BCONZ Reviewer");
  const [runDisease, setRunDisease] = useState("Gaucher disease");
  const [runResult, setRunResult] = useState<PipelineResult | null>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("bconz_research_token");
    if (saved) setToken(saved);
  }, []);

  const api = useCallback(async <T,>(path: string, init?: RequestInit): Promise<T> => {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(path, { ...init, headers, cache: "no-store" });
    const payload = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(payload.error ?? `Request failed (${response.status})`);
    return payload;
  }, [token]);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const [portfolioResponse, candidateResponse, changeResponse] = await Promise.all([
        fetch("/api/research/portfolio", { cache: "no-store" }).then(async (r) => {
          const p = await r.json();
          if (!r.ok) throw new Error(p.error ?? "Portfolio unavailable");
          return p as { diseases: Disease[] };
        }),
        api<{ candidates: Candidate[] }>("/api/research/generated-candidates?status=PROPOSED&limit=100"),
        api<{ changes: HypothesisChange[] }>("/api/research/hypothesis-changes?status=PENDING"),
      ]);
      setPortfolio(portfolioResponse.diseases ?? []);
      setCandidates(candidateResponse.candidates ?? []);
      setChanges(changeResponse.changes ?? []);
      setConnected(true);
      window.sessionStorage.setItem("bconz_research_token", token);
    } catch (error) {
      setConnected(false);
      setMessage(error instanceof Error ? error.message : "Unable to connect to research engine");
    } finally {
      setLoading(false);
    }
  }, [api, token]);

  const connect = async (event: FormEvent) => {
    event.preventDefault();
    await refresh();
  };

  const visibleCandidates = useMemo(
    () => routeFilter === "ALL" ? candidates : candidates.filter((candidate) => candidate.routing_decision === routeFilter),
    [candidates, routeFilter],
  );

  const fastTrack = candidates.filter((c) => c.routing_decision === "FAST_TRACK_DRA").length;
  const reviewQueue = candidates.filter((c) => c.routing_decision === "DRA_REVIEW").length;
  const hardGates = changes.filter((c) => c.hard_gate_candidate).length;
  const activeDiseases = portfolio.filter((d) => d.portfolio_status === "ACTIVE").length;

  const candidateAction = async (candidate: Candidate, action: "REVIEW" | "REJECT" | "PROMOTE") => {
    if (action === "PROMOTE" && !window.confirm(`Promote ${candidate.drug_name} into the DRA candidate registry?`)) return;
    setMessage(null);
    try {
      await api("/api/research/generated-candidates", {
        method: "PATCH",
        body: JSON.stringify({ id: candidate.id, action, reviewedBy: reviewer }),
      });
      setMessage(`${candidate.drug_name}: ${action.toLowerCase()} recorded.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Candidate action failed");
    }
  };

  const reviewChange = async (change: HypothesisChange, decision: "APPROVED" | "REJECTED") => {
    try {
      await api("/api/research/hypothesis-changes", {
        method: "PATCH",
        body: JSON.stringify({ id: change.id, decision, reviewedBy: reviewer }),
      });
      setMessage(`Hypothesis change ${decision.toLowerCase()}. Score changes remain advisory.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Review failed");
    }
  };

  const runEngine = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setRunResult(null);
    setMessage(null);
    try {
      const result = await api<PipelineResult>("/api/research/ingest", {
        method: "POST",
        body: JSON.stringify({
          diseaseName: runDisease,
          sources: ["PUBMED", "CLINICAL_TRIALS"],
          limitPerSource: 20,
          includePubTator3: true,
          includeHypothesisDetection: true,
          includeOntologyResolution: true,
          includeEvidenceQuality: true,
          includeCandidateGeneration: true,
          includeCandidateRanking: true,
        }),
      });
      setRunResult(result);
      setMessage(`${runDisease} pipeline completed.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pipeline run failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Internal</span>
              <span className="text-sm text-slate-400">RDIA · DRA · CRN-2.0</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">BCONZ Research Intelligence</h1>
          </div>
          <div className="hidden text-right md:block">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Engine state</p>
            <p className={`mt-1 text-sm font-semibold ${connected ? "text-emerald-300" : "text-amber-300"}`}>
              {connected ? "Connected" : "Authentication required"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white p-5 lg:min-h-[calc(100vh-89px)] lg:border-b-0 lg:border-r lg:p-6">
          <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-xl px-4 py-3 text-left transition ${tab === item.id ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"}`}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`mt-1 block text-xs ${tab === item.id ? "text-slate-400" : "text-slate-500"}`}>{item.description}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Governance</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Generated hypotheses and score deltas remain review-only. No automatic portfolio promotion.</p>
          </div>
        </aside>

        <section className="min-w-0 p-5 sm:p-7 lg:p-10">
          {!connected ? (
            <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Secure console access</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Connect to the research engine</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Enter the same server-side token configured as <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">RESEARCH_ENGINE_API_TOKEN</code>. It is kept only in this browser session.</p>
              <form onSubmit={connect} className="mt-7 flex flex-col gap-3 sm:flex-row">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Research engine token"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-teal-500 focus:ring-2"
                  autoComplete="off"
                />
                <button disabled={!token || loading} className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                  {loading ? "Connecting…" : "Connect"}
                </button>
              </form>
              {message ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p> : null}
            </div>
          ) : (
            <>
              <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Research operations</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">{tabs.find((item) => item.id === tab)?.label}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" aria-label="Reviewer name" />
                  <button type="button" onClick={refresh} disabled={loading} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Refresh</button>
                  <button type="button" onClick={() => { window.sessionStorage.removeItem("bconz_research_token"); setConnected(false); setToken(""); }} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Lock</button>
                </div>
              </div>

              {message ? <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">{message}</div> : null}

              {tab === "overview" ? (
                <div className="space-y-7">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Metric label="RDIA diseases" value={portfolio.length} detail={`${activeDiseases} active`} />
                    <Metric label="Generated candidates" value={candidates.length} detail={`${fastTrack} fast-track`} />
                    <Metric label="DRA review queue" value={reviewQueue} detail="CRN-2.0 routed" />
                    <Metric label="Hypothesis alerts" value={changes.length} detail={`${hardGates} hard-gate candidates`} />
                  </div>
                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between"><h3 className="font-semibold">Top CRN-2.0 candidates</h3><button onClick={() => setTab("candidates")} className="text-sm font-semibold text-teal-700">View all</button></div>
                      <div className="mt-5 space-y-3">
                        {candidates.slice(0, 5).map((candidate) => (
                          <div key={candidate.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
                            <div className="min-w-0"><p className="truncate text-sm font-semibold">{candidate.drug_name}</p><p className="mt-1 truncate text-xs text-slate-500">{candidate.gene_name ?? candidate.relation_type}</p></div>
                            <div className="text-right"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${routeTone(candidate.routing_decision)}`}>{candidate.routing_decision.replaceAll("_", " ")}</span><p className="mt-2 text-sm font-semibold">DRA {candidate.preliminary_dra_score ?? 0}</p></div>
                          </div>
                        ))}
                        {candidates.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No generated candidates yet. Run the engine for a disease.</p> : null}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between"><h3 className="font-semibold">Pending hypothesis changes</h3><button onClick={() => setTab("changes")} className="text-sm font-semibold text-teal-700">Review queue</button></div>
                      <div className="mt-5 space-y-3">
                        {changes.slice(0, 5).map((change) => (
                          <div key={change.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${directionTone(change.direction)}`}>{change.direction}</span><span className="text-xs text-slate-500">{Math.round(change.confidence)}% confidence</span></div>
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">{change.rationale}</p>
                          </div>
                        ))}
                        {changes.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No pending hypothesis changes.</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "portfolio" ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-5 py-4">Disease</th><th className="px-5 py-4">Tier</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Opportunity</th><th className="px-5 py-4">Confidence</th><th className="px-5 py-4">Last review</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {portfolio.map((disease) => <tr key={disease.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold">{disease.canonical_name}</td><td className="px-5 py-4">{disease.portfolio_tier ?? "—"}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{disease.portfolio_status}</span></td><td className="px-5 py-4"><span className={`rounded-lg px-2.5 py-1 font-semibold ${scoreTone(disease.opportunity_score)}`}>{disease.opportunity_score ?? "—"}</span></td><td className="px-5 py-4">{disease.evidence_confidence ?? "—"}</td><td className="px-5 py-4 text-slate-500">{disease.last_reviewed_at ? new Date(disease.last_reviewed_at).toLocaleDateString() : "—"}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {tab === "candidates" ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {["ALL", "FAST_TRACK_DRA", "DRA_REVIEW", "HOLD", "DEPRIORITIZE"].map((route) => <button key={route} onClick={() => setRouteFilter(route)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${routeFilter === route ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{route.replaceAll("_", " ")}</button>)}
                  </div>
                  <div className="grid gap-4">
                    {visibleCandidates.map((candidate) => (
                      <article key={candidate.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-semibold">{candidate.drug_name}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${routeTone(candidate.routing_decision)}`}>{candidate.routing_decision?.replaceAll("_", " ") || "UNRANKED"}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{candidate.ranking_version || "CRN pending"}</span></div><p className="mt-2 text-sm text-slate-500">{candidate.gene_name ? `${candidate.gene_name} · ` : ""}{candidate.relation_type}</p><p className="mt-4 max-w-4xl text-sm leading-6 text-slate-700">{candidate.hypothesis_summary}</p></div>
                          <div className="flex shrink-0 gap-2"><button onClick={() => candidateAction(candidate, "REVIEW")} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold">Review</button><button onClick={() => candidateAction(candidate, "REJECT")} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">Reject</button><button onClick={() => candidateAction(candidate, "PROMOTE")} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Promote to DRA</button></div>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                          {[ ["Prelim DRA", candidate.preliminary_dra_score], ["Novelty", candidate.novelty_score], ["Confidence", candidate.confidence], ["Human exposure", candidate.human_exposure_score], ["Readiness", candidate.development_readiness_score], ["Competition", candidate.competition_penalty], ["Negative penalty", candidate.negative_evidence_penalty], ["Cross-disease", candidate.cross_disease_support] ].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p><p className="mt-2 text-lg font-semibold">{value ?? 0}</p></div>)}
                        </div>
                      </article>
                    ))}
                    {visibleCandidates.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No candidates in this routing bucket.</div> : null}
                  </div>
                </div>
              ) : null}

              {tab === "changes" ? (
                <div className="grid gap-4">
                  {changes.map((change) => (
                    <article key={change.id} className={`rounded-2xl border bg-white p-6 shadow-sm ${change.hard_gate_candidate ? "border-rose-300" : "border-slate-200"}`}>
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${directionTone(change.direction)}`}>{change.direction}</span>{change.hard_gate_candidate ? <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">HARD-GATE CANDIDATE</span> : null}<span className="text-xs text-slate-500">{Math.round(change.confidence)}% confidence</span></div><p className="mt-4 max-w-4xl text-sm leading-6 text-slate-700">{change.rationale}</p><div className="mt-3 flex flex-wrap gap-2">{change.matched_signals?.map((signal) => <span key={signal} className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">{signal}</span>)}</div><p className="mt-4 text-xs text-slate-500">{change.source_type} · {change.source_id} · {new Date(change.created_at).toLocaleString()}</p></div><div className="min-w-[210px] rounded-xl bg-slate-50 p-4"><div className="flex justify-between text-sm"><span>DRA delta</span><strong>{change.proposed_dra_delta > 0 ? "+" : ""}{change.proposed_dra_delta}</strong></div><div className="mt-2 flex justify-between text-sm"><span>RDIA delta</span><strong>{change.proposed_rdia_delta > 0 ? "+" : ""}{change.proposed_rdia_delta}</strong></div><div className="mt-4 flex gap-2"><button onClick={() => reviewChange(change, "APPROVED")} className="flex-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Approve</button><button onClick={() => reviewChange(change, "REJECTED")} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Reject</button></div></div></div>
                    </article>
                  ))}
                  {changes.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No pending hypothesis-change reviews.</div> : null}
                </div>
              ) : null}

              {tab === "run" ? (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                  <form onSubmit={runEngine} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Single disease pipeline</p><h3 className="mt-2 text-xl font-semibold">Ingest → resolve → score → discover → rank</h3><p className="mt-2 text-sm leading-6 text-slate-600">Runs the full operational pipeline with PubMed, ClinicalTrials.gov, PubTator3, ontology resolution, evidence-quality scoring, hypothesis monitoring, candidate generation and CRN-2.0.</p>
                    <label className="mt-6 block text-sm font-semibold">Disease name</label><input value={runDisease} onChange={(e) => setRunDisease(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="e.g. Gaucher disease" />
                    <button disabled={loading || !runDisease.trim()} className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Running pipeline…" : "Run full engine"}</button>
                  </form>
                  <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Latest run</p>{runResult ? <div className="mt-5 space-y-4"><div><p className="text-2xl font-semibold">{runResult.diseaseName}</p><p className="mt-1 text-sm text-slate-400">{runResult.fetched} fetched · {runResult.persisted} persisted</p></div><div className="grid grid-cols-2 gap-3">{[["Entities", runResult.pubtator3?.entitiesExtracted ?? 0],["Relations", runResult.pubtator3?.relationsExtracted ?? 0],["EQS mean", runResult.evidenceQuality?.meanComposite ?? 0],["High quality", runResult.evidenceQuality?.highQuality ?? 0],["Candidates", runResult.candidateGeneration?.generated ?? 0],["Fast-track", runResult.candidateRanking?.fastTrack ?? 0],["DRA review", runResult.candidateRanking?.review ?? 0],["Hard reviews", runResult.hypothesisChanges?.humanReviewRequired ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-white/5 p-3"><p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></div>)}</div></div> : <p className="mt-5 text-sm leading-6 text-slate-400">Run a disease to see ingestion, evidence-quality, hypothesis-change and candidate-ranking outputs here.</p>}</div>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
