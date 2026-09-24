import { researchDb } from "./supabase-rest";
import type { CandidateHypothesis } from "./hypothesis-change";

type CandidateRow = {
  id: string;
  drug_name: string;
  responder_hypothesis: string | null;
  biomarker: string | null;
  regimen_concept: string | null;
  dra_score: number | null;
  research_diseases: { canonical_name: string } | null;
};

type HypothesisRow = {
  candidate_id: string;
  responder_subgroup: string | null;
  mechanism_terms: string[] | null;
  biomarker_terms: string[] | null;
  phenotype_terms: string[] | null;
  genotype_terms: string[] | null;
  regimen_terms: string[] | null;
  positive_signal_terms: string[] | null;
  negative_signal_terms: string[] | null;
  kill_criteria: string[] | null;
};

type AliasRow = {
  candidate_id: string;
  alias_type: string;
  alias: string;
};

export type RegistryCandidateHypothesis = CandidateHypothesis & {
  aliases: string[];
  diseaseAliases: string[];
  mechanismTerms: string[];
  biomarkerTerms: string[];
  phenotypeTerms: string[];
  genotypeTerms: string[];
  regimenTerms: string[];
  positiveSignalTerms: string[];
  negativeSignalTerms: string[];
  killCriteria: string[];
  responderSubgroup?: string;
};

export async function loadCandidateHypotheses(diseaseName?: string): Promise<RegistryCandidateHypothesis[]> {
  const diseaseFilter = diseaseName
    ? `&research_diseases.canonical_name=eq.${encodeURIComponent(diseaseName)}`
    : "";

  const candidates = await researchDb<CandidateRow[]>(
    `repurposing_candidates?select=id,drug_name,responder_hypothesis,biomarker,regimen_concept,dra_score,research_diseases!inner(canonical_name)${diseaseFilter}`,
  );
  if (candidates.length === 0) return [];

  const candidateIds = candidates.map((candidate) => candidate.id);
  const inFilter = `(${candidateIds.join(",")})`;

  const [hypotheses, aliases] = await Promise.all([
    researchDb<HypothesisRow[]>(
      `candidate_hypotheses?candidate_id=in.${inFilter}&status=eq.ACTIVE&select=candidate_id,responder_subgroup,mechanism_terms,biomarker_terms,phenotype_terms,genotype_terms,regimen_terms,positive_signal_terms,negative_signal_terms,kill_criteria`,
    ),
    researchDb<AliasRow[]>(
      `candidate_aliases?candidate_id=in.${inFilter}&select=candidate_id,alias_type,alias`,
    ),
  ]);

  const hypothesisByCandidate = new Map(hypotheses.map((row) => [row.candidate_id, row]));
  const aliasesByCandidate = new Map<string, AliasRow[]>();
  for (const alias of aliases) {
    const current = aliasesByCandidate.get(alias.candidate_id) ?? [];
    current.push(alias);
    aliasesByCandidate.set(alias.candidate_id, current);
  }

  return candidates.flatMap((candidate) => {
    const diseaseName = candidate.research_diseases?.canonical_name;
    if (!diseaseName) return [];
    const registry = hypothesisByCandidate.get(candidate.id);
    const candidateAliases = aliasesByCandidate.get(candidate.id) ?? [];

    return [{
      candidateId: candidate.id,
      diseaseName,
      drugName: candidate.drug_name,
      responderHypothesis: candidate.responder_hypothesis ?? undefined,
      biomarker: candidate.biomarker ?? undefined,
      regimenConcept: candidate.regimen_concept ?? undefined,
      currentDraScore: candidate.dra_score ?? undefined,
      aliases: candidateAliases.filter((a) => a.alias_type === "DRUG").map((a) => a.alias),
      diseaseAliases: candidateAliases.filter((a) => a.alias_type === "DISEASE").map((a) => a.alias),
      mechanismTerms: registry?.mechanism_terms ?? [],
      biomarkerTerms: registry?.biomarker_terms ?? [],
      phenotypeTerms: registry?.phenotype_terms ?? [],
      genotypeTerms: registry?.genotype_terms ?? [],
      regimenTerms: registry?.regimen_terms ?? [],
      positiveSignalTerms: registry?.positive_signal_terms ?? [],
      negativeSignalTerms: registry?.negative_signal_terms ?? [],
      killCriteria: registry?.kill_criteria ?? [],
      responderSubgroup: registry?.responder_subgroup ?? undefined,
    }];
  });
}
