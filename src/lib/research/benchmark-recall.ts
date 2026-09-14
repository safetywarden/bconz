import { normalizedCandidateKey } from "./candidate-eligibility";
import { researchDb } from "./supabase-rest";

type DiseaseRow={id:string;canonical_name:string};
type EvidenceRow={id:string;source_type:string;source_id:string|null;title:string;extracted_claim:string|null};
type EntityRow={evidence_id:string;entity_type:string;text:string;normalized_id:string|null};
type RelationRow={evidence_id:string;relation_type:string;entity1_text:string|null;entity2_text:string|null};
type CandidateRow={drug_name:string;relation_type:string;status:string;routing_decision:string|null;ranking_version:string|null};

const benchmarks:Record<string,string[]>= {
  "gaucher disease":["ambroxol"]
};
const norm=(v?:string|null)=>normalizedCandidateKey(v??"");
const contains=(hay?:string|null,needle?:string)=>!!needle&&norm(hay).includes(norm(needle));

export type BenchmarkRecallDiagnostic={
  benchmark:string;
  evidenceMention:boolean;
  evidenceMatches:number;
  entityAnnotation:boolean;
  entityMatches:number;
  relationSignal:boolean;
  relationMatches:number;
  generatedCandidate:boolean;
  candidateMatches:number;
  stageReached:"RANKING"|"GENERATION"|"RELATION"|"ANNOTATION"|"RETRIEVAL"|"NOT_RETRIEVED";
  likelyFailureStage:string;
  sampleEvidence:Array<{sourceType:string;sourceId:string|null;title:string}>;
};

export async function diagnoseBenchmarkRecall(diseaseName:string):Promise<{version:string;benchmarks:BenchmarkRecallDiagnostic[]}> {
  const names=benchmarks[norm(diseaseName)]??[]; if(!names.length)return{version:"BRD-1.0",benchmarks:[]};
  const disease=(await researchDb<DiseaseRow[]>(`research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id,canonical_name`))[0]; if(!disease)return{version:"BRD-1.0",benchmarks:[]};
  const evidence=await researchDb<EvidenceRow[]>(`research_evidence?disease_id=eq.${disease.id}&select=id,source_type,source_id,title,extracted_claim`); const ids=evidence.map(e=>e.id);
  const [entities,relations,candidates]=await Promise.all([
    ids.length?researchDb<EntityRow[]>(`research_evidence_entities?evidence_id=in.(${ids.join(",")})&select=evidence_id,entity_type,text,normalized_id`):Promise.resolve([]),
    ids.length?researchDb<RelationRow[]>(`research_evidence_relations?evidence_id=in.(${ids.join(",")})&select=evidence_id,relation_type,entity1_text,entity2_text`):Promise.resolve([]),
    researchDb<CandidateRow[]>(`generated_candidate_hypotheses?disease_id=eq.${disease.id}&select=drug_name,relation_type,status,routing_decision,ranking_version`)
  ]);
  return{version:"BRD-1.0",benchmarks:names.map(benchmark=>{
    const ev=evidence.filter(e=>contains(e.title,benchmark)||contains(e.extracted_claim,benchmark));
    const ent=entities.filter(e=>contains(e.text,benchmark));
    const rel=relations.filter(r=>contains(r.entity1_text,benchmark)||contains(r.entity2_text,benchmark));
    const cand=candidates.filter(c=>norm(c.drug_name)===norm(benchmark));
    const stageReached=cand.length?"RANKING":rel.length?"RELATION":ent.length?"ANNOTATION":ev.length?"RETRIEVAL":"NOT_RETRIEVED";
    const likelyFailureStage=cand.length?"Benchmark reached candidate/ranking layer.":rel.length?"Relation exists but candidate generation did not retain it.":ent.length?"Entity was annotated but no supported relation was persisted/inferred.":ev.length?"Evidence was retrieved but benchmark was not annotated as an entity.":"Benchmark is absent from the persisted retrieval set; inspect or expand retrieval query/window.";
    return{benchmark,evidenceMention:ev.length>0,evidenceMatches:ev.length,entityAnnotation:ent.length>0,entityMatches:ent.length,relationSignal:rel.length>0,relationMatches:rel.length,generatedCandidate:cand.length>0,candidateMatches:cand.length,stageReached,likelyFailureStage,sampleEvidence:ev.slice(0,5).map(e=>({sourceType:e.source_type,sourceId:e.source_id,title:e.title}))};
  })};
}
