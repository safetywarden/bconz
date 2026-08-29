import type { IngestionResult, NormalizedEvidence } from "./types";

type ESearchResponse = { esearchresult?: { idlist?: string[] } };
type ESummaryItem = { uid?: string; title?: string; pubdate?: string; source?: string; sortfirstauthor?: string };
type ESummaryResponse = { result?: Record<string, ESummaryItem | string[]> };

function classifyPubmedEvidence(title: string): NormalizedEvidence["evidenceClass"] {
  const t = title.toLowerCase();
  if (t.includes("randomized") || t.includes("randomised") || t.includes("phase 3") || t.includes("phase iii")) return "E1";
  if (t.includes("prospective")) return "E3";
  if (t.includes("retrospective") || t.includes("cohort")) return "E4";
  if (t.includes("case report") || t.includes("case series")) return "E5";
  return "E6";
}

export async function ingestPubmedDisease(diseaseName: string, limit = 20): Promise<IngestionResult> {
  const term = encodeURIComponent(`\"${diseaseName}\"[Title/Abstract]`);
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&sort=pub+date&retmax=${limit}&term=${term}`;
  const searchResponse = await fetch(searchUrl, { cache: "no-store" });
  if (!searchResponse.ok) throw new Error(`PubMed search failed (${searchResponse.status})`);
  const search = (await searchResponse.json()) as ESearchResponse;
  const ids = search.esearchresult?.idlist ?? [];
  if (ids.length === 0) return { source: "PUBMED", diseaseName, fetched: 0, normalized: [] };

  const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`;
  const summaryResponse = await fetch(summaryUrl, { cache: "no-store" });
  if (!summaryResponse.ok) throw new Error(`PubMed summary failed (${summaryResponse.status})`);
  const summary = (await summaryResponse.json()) as ESummaryResponse;

  const normalized: NormalizedEvidence[] = ids.flatMap((id) => {
    const item = summary.result?.[id];
    if (!item || Array.isArray(item) || typeof item !== "object") return [];
    const title = item.title?.trim();
    if (!title) return [];
    const date = item.pubdate?.match(/\d{4}(?:\s+[A-Z][a-z]{2})?(?:\s+\d{1,2})?/)?.[0];
    return [{
      diseaseName,
      sourceType: "PUBMED" as const,
      sourceId: id,
      sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      title,
      publicationDate: date,
      population: undefined,
      extractedClaim: title,
      evidenceClass: classifyPubmedEvidence(title),
      confidence: 60,
    }];
  });

  return { source: "PUBMED", diseaseName, fetched: ids.length, normalized };
}
