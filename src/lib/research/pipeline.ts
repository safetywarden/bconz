import { detectMaterialChanges } from "./change-detection";
import { detectHypothesisImpacts } from "./hypothesis-change";
import { ingestPubmedDisease } from "./ingestion/pubmed";
import { ingestClinicalTrialsDisease } from "./ingestion/clinical-trials";
import { extractPubTator3 } from "./ingestion/pubtator3";
import {
  getCandidateHypotheses,
  persistEvidence,
  persistHypothesisImpacts,
  persistMaterialChanges,
  persistPubTatorExtraction,
} from "./ingestion/persist";
import { resolveEvidenceEntities } from "./ontology";

export type EvidenceSource = "PUBMED" | "CLINICAL_TRIALS";

export type ResearchPipelineInput = {
  diseaseName: string;
  sources?: EvidenceSource[];
  limitPerSource?: number;
  includePubTator3?: boolean;
  includeHypothesisDetection?: boolean;
  includeOntologyResolution?: boolean;
};

export async function runResearchPipeline(input: ResearchPipelineInput) {
  const diseaseName = input.diseaseName;
  const sources = input.sources ?? ["PUBMED", "CLINICAL_TRIALS"];
  const limitPerSource = input.limitPerSource ?? 20;
  const includePubTator3 = input.includePubTator3 ?? true;
  const includeHypothesisDetection = input.includeHypothesisDetection ?? true;
  const includeOntologyResolution = input.includeOntologyResolution ?? true;

  const results = await Promise.all(
    sources.map((source) =>
      source === "PUBMED"
        ? ingestPubmedDisease(diseaseName, limitPerSource)
        : ingestClinicalTrialsDisease(diseaseName, limitPerSource),
    ),
  );
  const normalized = results.flatMap((result) => result.normalized);
  const persistence = await persistEvidence(normalized);

  const pubmedEvidence = normalized.filter((item) => item.sourceType === "PUBMED");
  const pubtator = includePubTator3
    ? await extractPubTator3(pubmedEvidence)
    : { entities: [], relations: [] };
  const pubtatorPersistence = includePubTator3
    ? await persistPubTatorExtraction(diseaseName, pubtator)
    : { entities: 0, relations: 0 };

  const ontology = includeOntologyResolution && includePubTator3
    ? await resolveEvidenceEntities(diseaseName)
    : { examined: 0, resolved: 0, externalId: 0, alias: 0 };

  const changes = detectMaterialChanges(normalized, pubtator);
  const changePersistence = await persistMaterialChanges(diseaseName, changes);

  const hypotheses = includeHypothesisDetection
    ? await getCandidateHypotheses(diseaseName)
    : [];
  const hypothesisImpacts = includeHypothesisDetection
    ? detectHypothesisImpacts(normalized, pubtator, hypotheses)
    : [];
  const hypothesisPersistence = includeHypothesisDetection
    ? await persistHypothesisImpacts(diseaseName, hypothesisImpacts)
    : { logged: 0 };

  return {
    diseaseName,
    fetched: results.reduce((sum, result) => sum + result.fetched, 0),
    normalized: normalized.length,
    persisted: persistence.inserted,
    skippedUnknownDisease: persistence.skippedUnknownDisease,
    pubtator3: {
      enabled: includePubTator3,
      entitiesExtracted: pubtator.entities.length,
      relationsExtracted: pubtator.relations.length,
      entitiesPersisted: pubtatorPersistence.entities,
      relationsPersisted: pubtatorPersistence.relations,
    },
    ontology: {
      enabled: includeOntologyResolution,
      ...ontology,
    },
    materialChanges: {
      logged: changePersistence.logged,
      red: changes.filter((change) => change.severity === "RED").length,
      amber: changes.filter((change) => change.severity === "AMBER").length,
      green: changes.filter((change) => change.severity === "GREEN").length,
      reviewRequired: changes.filter((change) => change.materialReviewRequired).length,
    },
    hypothesisChanges: {
      enabled: includeHypothesisDetection,
      hypothesesEvaluated: hypotheses.length,
      impactsLogged: hypothesisPersistence.logged,
      strengthen: hypothesisImpacts.filter((impact) => impact.direction === "STRENGTHEN").length,
      weaken: hypothesisImpacts.filter((impact) => impact.direction === "WEAKEN").length,
      kill: hypothesisImpacts.filter((impact) => impact.direction === "KILL").length,
      neutral: hypothesisImpacts.filter((impact) => impact.direction === "NEUTRAL").length,
      hardGateCandidates: hypothesisImpacts.filter((impact) => impact.hardGateCandidate).length,
      humanReviewRequired: hypothesisImpacts.filter((impact) => impact.requiresHumanReview).length,
      proposedDraDelta: hypothesisImpacts.reduce((sum, impact) => sum + impact.proposedDraDelta, 0),
      proposedRdiaDelta: hypothesisImpacts.reduce((sum, impact) => sum + impact.proposedRdiaDelta, 0),
    },
    sources: results.map((result) => ({ source: result.source, fetched: result.fetched, normalized: result.normalized.length })),
  };
}
