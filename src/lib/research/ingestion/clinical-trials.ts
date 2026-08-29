import type { IngestionResult, NormalizedEvidence } from "./types";

type Study = {
  protocolSection?: {
    identificationModule?: { nctId?: string; briefTitle?: string };
    statusModule?: { startDateStruct?: { date?: string }; overallStatus?: string };
    conditionsModule?: { conditions?: string[] };
    designModule?: { phases?: string[]; studyType?: string };
    descriptionModule?: { briefSummary?: string };
  };
};

type CtgovResponse = { studies?: Study[] };

function classifyTrial(study: Study): NormalizedEvidence["evidenceClass"] {
  const phases = study.protocolSection?.designModule?.phases ?? [];
  if (phases.some((phase) => phase.includes("PHASE3") || phase.includes("PHASE4"))) return "E1";
  if (phases.some((phase) => phase.includes("PHASE2"))) return "E2";
  return "E3";
}

export async function ingestClinicalTrialsDisease(diseaseName: string, limit = 20): Promise<IngestionResult> {
  const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(diseaseName)}&pageSize=${Math.min(limit, 100)}&format=json`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`ClinicalTrials.gov search failed (${response.status})`);
  const payload = (await response.json()) as CtgovResponse;
  const studies = payload.studies ?? [];

  const normalized: NormalizedEvidence[] = studies.flatMap((study) => {
    const protocol = study.protocolSection;
    const nctId = protocol?.identificationModule?.nctId;
    const title = protocol?.identificationModule?.briefTitle;
    if (!nctId || !title) return [];
    const status = protocol?.statusModule?.overallStatus;
    const summary = protocol?.descriptionModule?.briefSummary?.trim();
    const conditions = protocol?.conditionsModule?.conditions?.join(", ");
    return [{
      diseaseName,
      sourceType: "CLINICAL_TRIALS" as const,
      sourceId: nctId,
      sourceUrl: `https://clinicaltrials.gov/study/${nctId}`,
      title,
      publicationDate: protocol?.statusModule?.startDateStruct?.date,
      population: conditions,
      extractedClaim: [status ? `Status: ${status}.` : "", summary ?? title].filter(Boolean).join(" "),
      evidenceClass: classifyTrial(study),
      confidence: 70,
    }];
  });

  return { source: "CLINICAL_TRIALS", diseaseName, fetched: studies.length, normalized };
}
