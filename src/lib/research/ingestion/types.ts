export type EvidenceClass = "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7" | "E8" | "H";

export type NormalizedEvidence = {
  diseaseName: string;
  sourceType: "PUBMED" | "CLINICAL_TRIALS";
  sourceId: string;
  sourceUrl: string;
  title: string;
  publicationDate?: string;
  population?: string;
  extractedClaim: string;
  evidenceClass: EvidenceClass;
  confidence: number;
};

export type IngestionResult = {
  source: NormalizedEvidence["sourceType"];
  diseaseName: string;
  fetched: number;
  normalized: NormalizedEvidence[];
};
